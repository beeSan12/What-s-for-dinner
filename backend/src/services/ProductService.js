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
