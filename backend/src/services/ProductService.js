/**
 * @file This file contains the ProductService class
 * @module ProductService
 * @author Beatriz Sanssi
 */

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { APIClientFactory } from '../utils/APIClientFactory.js'

/**
 * Encapsulates a task service.
 */
export class ProductService extends MongooseServiceBase {
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
    const regex = nameFilter ? new RegExp(nameFilter, 'i') : undefined

    const standardProducts = await this.search(regex ? { product_name: regex } : {})
    const userProducts = await this.userProductService.getAllByUser(userId, nameFilter)

    // Combine and remove duplicates by product_name
    const combined = [...userProducts, ...standardProducts.data || standardProducts]

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
      { key: 'shellfish', tag: 'en:crustaceans', negTag: 'en:no-crustaceans' }
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
    const product = await this.getOne({ barcode })

    if (product?.eco_score?.score !== undefined) return product.eco_score

    const client = APIClientFactory.createOpenFoodAPIClient()
    const response = await client.get(`/api/v0/product/${barcode}.json`)

    const score = response.data?.product?.eco_score_score || -1
    const grade = response.data?.product?.eco_score_grade || 'unknown'

    return {
      eco_score: {
        score,
        grade
      }
    }
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
   * Fetches the eco score distribution for all products.
   *
   * @returns {Promise<object>} The eco score distribution.
   */
  async getEcoScoreDistribution () {
    const ecoScores = await this.search({ eco_score: { $exists: true } }, { eco_score: 1 })
    const distribution = {}

    for (const product of ecoScores) {
      const grade = product.eco_score.grade
      if (!distribution[grade]) {
        distribution[grade] = 0
      }
      distribution[grade]++
    }

    return Object.entries(distribution).map(([grade, value]) => ({ grade, value }))
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
