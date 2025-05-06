/**
 * @file This file contains the NutritionService class
 * @module NutritionService
 * @author Beatriz Sanssi
 */

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { APIClientFactory } from '../api/APIClientFactory.js'

/**
 * Encapsulates a task service.
 */
export class NutritionService extends MongooseServiceBase {
  /**
   * Searches for products by name.
   *
   * @param {string} barcode - The barcode of the product to search for.
   * @returns {Promise<{calories: number, protein: number, carbs: number, fat: number}>} - The nutrition information of the product.
   */
  async getNutritionInformation (barcode) {
    const client = APIClientFactory.createOpenFoodAPIClient()
    const response = await client.get(`/api/v0/product/${barcode}.json`)
    if (response.data.status !== 1) {
      throw new Error('Product not found')
    }
    if (response.data.status !== 1) {
      const msg = response.data.status_verbose || 'Product not found'
      const error = new Error(msg)
      error.status = 404
      throw error
    }

    const nutri = response.data.product.nutriments || {}
    return {
      calories: nutri['energy-kcal_100g'] || 0,
      protein: nutri.proteins_100g || 0,
      carbs: nutri.carbohydrates_100g || 0,
      fat: nutri.fat_100g || 0
    }
  }
}
