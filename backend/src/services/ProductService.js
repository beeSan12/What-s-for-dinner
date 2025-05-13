/**
 * @file This file contains the ProductService class
 * @module ProductService
 * @author Beatriz Sanssi
 */

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { APIClientFactory } from '../utils/APIClientFactory.js'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json' assert { type: 'json' }

// Register English locale
countries.registerLocale(enLocale)

/**
 * Encapsulates a task service.
 */
export class ProductService extends MongooseServiceBase {
  /**
   * Gets the origin map for products through an aggregation pipeline.
   *
   * @param {object} options - The options for the aggregation.
   * @param {string[]} [options.gradesFilter] - An array of eco grades to filter by.
   * @returns {Promise<object[]>} The origin map.
   */
  async getOriginMap ({ gradesFilter = [] } = {}) {
    // Build the aggregation pipeline
    const pipeline = [
      // 1) Exlude products without origins
      { $match: { origins: { $exists: true, $nin: [null, ''] } } },

      // 2) Only include grades that are in the filter
      ...(gradesFilter.length
        ? [{ $match: { 'eco_score.grade': { $in: gradesFilter.map(g => g.toLowerCase()) } } }]
        : []),

      // 3) Convert to country names
      {
        $project: {
          ecoGrade: '$eco_score.grade',
          originsArr: {
            $filter: {
              input: { $split: ['$origins', ','] },
              as: 'o',
              cond: { $ne: ['$$o', ''] }
            }
          }
        }
      },
      { $unwind: '$originsArr' },
      {
        $addFields: {
          // Convert origins to ISO-2 codes for the maps coordinates
          cc: {
            $let: {
              vars: {
                clean: { $trim: { input: '$originsArr' } }
              },
              in: {
                $cond: [
                  { $eq: [{ $strLenCP: '$$clean' }, 2] }, // redan ISO?
                  { $toUpper: '$$clean' },
                  {
                    $toUpper: {
                      $function: {
                        /**
                         * Converts a country name to its ISO-2 code.
                         *
                         * @param {string} name - The country name.
                         * @returns {string} The ISO-2 code or the original name if not found.
                         */
                        body: (name) => {
                          const iso = countries.getAlpha2Code(name, 'en')
                          return iso || name // fallback: sends back the original name
                        },
                        args: ['$$clean'],
                        lang: 'js'
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },

      // 4) Group by country code and eco grade
      {
        $group: {
          _id: '$cc',
          total: { $sum: 1 },
          grades: {
            $push: '$ecoGrade'
          }
        }
      },

      // 5) Format the output
      {
        $project: {
          _id: 0,
          cc: '$_id',
          total: 1,
          grades: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ['$grades', []] }, // unique grades
                as: 'g',
                in: [
                  { $toUpper: '$$g' },
                  {
                    $size: {
                      $filter: { input: '$grades', as: 'x', cond: { $eq: ['$$x', '$$g'] } }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    ]
    return this.aggregate(pipeline)
  }

  /**
   * Searches for products by name.
   *
   * @param {string} name - The name to search for.
   * @returns {Promise<object[]>} A list of matching products.
   */
  async searchByName (name) {
    if (!name) {
      throw new Error('Missing search term')
    }
    return this.search({ product_name: new RegExp(name, 'i') })
  }

  /**
   * Return combined list from both sources.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} nameFilter - The name filter to apply.
   * @returns {Promise<object[]>} A list of all products.
   */
  async getAllProducts (userId, nameFilter) {
    // Check if nameFilter is a string
    const regex = nameFilter ? new RegExp(nameFilter, 'i') : undefined
    const filter = regex
      ? { $or: [{ product_name: regex }, { ingredients: regex }] }
      : {}

    // Fetch standard products and user products
    const { data: standardProducts } = await this.search({ filter })
    const userProducts = await this.userProductService.getAllByUser(userId, nameFilter)

    // Combine and remove duplicates by product_name
    const combined = [...userProducts, ...standardProducts]

    const unique = Array.from(
      new Map(combined.map(p => [p.product_name.toLowerCase(), p])).values()
    )
    return unique
  }

  /**
   * Enriches product data with allergens information.
   *
   * @param {object} productData - The product data to enrich.
   * @returns {Promise<object>} The enriched product data.
   */
  async getAllergensByProduct (productData) {
    if (productData.allergens || !productData.barcode) return productData

    const client = APIClientFactory.createOpenFoodAPIClient()
    const response = await client.get(`/api/v0/product/${productData.barcode}.json`)

    const allergensTags = response.data?.product?.allergens_tags || []

    const allAllergens = [
      { key: 'gluten', tag: 'en:gluten', negTag: 'en:no-gluten' },
      { key: 'lactose', tag: 'en:milk', negTag: 'en:no-lactose' },
      { key: 'nuts', tag: 'en:nuts', negTag: 'en:no-nuts' },
      { key: 'peanuts', tag: 'en:peanuts', negTag: 'en:no-peanuts' },
      { key: 'soy', tag: 'en:soybeans', negTag: 'en:no-soybeans' },
      { key: 'eggs', tag: 'en:eggs', negTag: 'en:no-eggs' },
      { key: 'fish', tag: 'en:fish', negTag: 'en:no-fish' },
      { key: 'shellfish', tag: 'en:crustaceans', negTag: 'en:no-crustaceans' },
      { key: 'celery', tag: 'en:celery', negTag: 'en:no-celery' },
      { key: 'mustard', tag: 'en:mustard', negTag: 'en:no-mustard' },
      { key: 'sesame', tag: 'en:sesame-seeds', negTag: 'en:no-sesame-seeds' },
      { key: 'sulphites', tag: 'en:sulphur-dioxide-and-sulphites', negTag: 'en:no-sulphur-dioxide-and-sulphites' }
    ]

    const allergens = {}
    for (const { key, tag, negTag } of allAllergens) {
      if (allergensTags.includes(tag)) {
        allergens[key] = true
      } else if (allergensTags.includes(negTag)) {
        allergens[key] = false
      } else {
        allergens[key] = undefined // if not found, set to undefined
      }
    }

    console.log('Extracted allergens:', allergens)
    return {
      ...productData,
      allergens
    }
  }

  /**
   * Enriches product data with ingredients information.
   *
   * @param {object} productData - The product data to enrich.
   * @returns {Promise<object>} The enriched product data.
   */
  async getIngredientsByProduct (productData) {
    if (productData.ingredients_text || !productData.barcode) return productData

    const client = APIClientFactory.createOpenFoodAPIClient()
    const response = await client.get(`/api/v0/product/${productData.barcode}.json`)

    const ingredients = response.data?.product?.ingredients_text || ''
    return {
      ...productData,
      ingredients_text: ingredients || null
    }
  }

  /**
   * Fetches the eco score for a product by barcode.
   *
   * @param {string} barcode - The barcode of the product.
   * @returns {Promise<object>} The eco score data.
   */
  async getEcoScoreByProduct (barcode) {
    const client = APIClientFactory.createOpenFoodAPIClient()
    const response = await client.get(`/api/v0/product/${barcode}.json`)

    const score = response.data?.product?.eco_score_score
    const grade = response.data?.product?.eco_score_grade

    if (score === undefined || grade === undefined) {
      console.warn(`No eco score found for barcode ${barcode}`)
      return { eco_score: { score: -1, grade: 'unknown' } }
    }

    return {
      eco_score: {
        score,
        grade
      }
    }
  }

  /**
   * Filters products based on eco score and allergens.
   *
   * @param {object[]} products - The product data to filter.
   * @returns {Promise<object[]>} - The filtered products.
   */
  async filterProducts ({ ecoScoreMissing, ecoGrades = [], excludeAllergens = [] }) {
    const query = {}

    if (ecoScoreMissing) {
      query['eco_score.score'] = { $lt: 0 }
    }
    if (ecoGrades.length > 0) {
      query['eco_score.grade'] = { $in: ecoGrades.map(g => g.toLowerCase()) }
    }
    for (const allergen of excludeAllergens) {
      query[`allergens.${allergen}`] = { $ne: true }
    }
    return this.model.find(query).limit(100)
  }

  /**
   * Filters products in memory based on eco score and allergens.
   *
   * @param {object[]} products - The product data to filter.
   * @param {object} filters - Filter parameters.
   * @param {boolean} [filters.ecoGrades] - If true, only products missing eco score will be included.
   * @param {string[]} [filters.excludeAllergens] - A list of allergens to exclude (e.g. ['gluten', 'lactose']).
   * @returns {object[]} - The filtered products.
   */
  filterInMemory (products, { ecoGrades = [], excludeAllergens = [] }) {
    let filtered = products

    if (ecoGrades.length > 0) {
      filtered = filtered.filter(p =>
        p.eco_score &&
        p.eco_score.grade &&
        ecoGrades.includes(p.eco_score.grade.toUpperCase())
      )
    }

    if (excludeAllergens.length > 0) {
      filtered = filtered.filter(p =>
        !p.allergens || !excludeAllergens.some(a => p.allergens?.[a] === true)
      )
    }

    return filtered
  }

  /**
   * Filters products by eco score.
   *
   * @param {object} products - The product data to filter.
   * @returns {Promise<object>} - The filtered product data.
   */
  async filterByEcoScore (products) {
    return products.map(p => {
      if (p?.eco_score?.grade === 'unknown') {
        p.eco_warning = 'No eco score available'
        p.recommendation = 'Choose a product with an eco score'
      }
      return p
    })
  }

  /**
   * Fetches the eco score distribution for all products through an aggregation pipeline.
   *
   * @param {object} options - The options for the aggregation.
   * @param {string[]} [options.gradesFilter] - An array of eco grades to filter by.
   * @returns {Promise<object[]>} The eco score distribution.
   */
  async getEcoScoreDistribution ({ gradesFilter = [] } = {}) {
    const pipeline = [

      // 1) Filter out products without eco_score
      {
        $match: {
          eco_score_grade: { $exists: true, $nin: [null, ''] },
          eco_score_score: { $type: 'number' }
        }
      },

      // 2) If the user has selected grades, filter by them
      ...(gradesFilter.length
        ? [{ $match: { eco_score_grade: { $in: gradesFilter.map(g => g.toLowerCase()) } } }]
        : []),

      // 3) Group by eco_score_grade and calculate the average score
      {
        $group: {
          _id: { $toUpper: '$eco_score_grade' }, // ⇢ 'A', 'B' …
          count: { $sum: 1 },
          avgScore: { $avg: '$eco_score_score' }
        }
      },

      // 4) Format the output and round the average score
      {
        $project: {
          _id: 0,
          grade: '$_id',
          count: 1,
          avgScore: { $round: ['$avgScore', 1] }
        }
      },

      // 5) Sort by grade
      {
        $addFields: {
          sortKey: {
            $switch: {
              branches: [
                { case: { $eq: ['$grade', 'A-PLUS'] }, then: 0 },
                { case: { $eq: ['$grade', 'A'] }, then: 1 },
                { case: { $eq: ['$grade', 'B'] }, then: 2 },
                { case: { $eq: ['$grade', 'C'] }, then: 3 },
                { case: { $eq: ['$grade', 'D'] }, then: 4 },
                { case: { $eq: ['$grade', 'E'] }, then: 5 }
              ],
              default: 6 // t.ex. 'UNKNOWN'
            }
          }
        }
      },
      { $sort: { sortKey: 1 } },
      { $project: { sortKey: 0 } } // ⇢ remove sortKey from the output
    ]

    return this.aggregate(pipeline)
  }

  /**
   * Performs a smart search for products based on name, eco grades, and category.
   *
   * @param {object} params - The search parameters.
   * @param {string} params.name - The name to search for.
   * @param {string[]} params.ecoGrades - The eco grades to filter by.
   * @param {string} params.category - The category to filter by.
   * @returns {Promise<object[]>} A list of matching products.
   */
  async smartSearch ({ name, ecoGrades = [], category }) {
    const filter = {}
    if (name) filter.product_name = new RegExp(name, 'i')
    if (ecoGrades.length) filter['eco_score.grade'] = { $in: ecoGrades }
    if (category) filter.categories = new RegExp(category, 'i')
    return this.search({ filter })
  }

  /**
   * Saves the product data with allergens information.
   *
   * @param {object} productData - The product data to save.
   * @returns {Promise<object>} The saved product data.
   */
  async insertProductWithAllergens (productData) {
    const enriched = await this.getAllergensByProduct(productData)
    return this.insert(enriched)
  }
}
