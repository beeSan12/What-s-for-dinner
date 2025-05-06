/**
 * @file This file contains the NutritionService class
 * @module NutritionService
 * @author Beatriz Sanssi
 */

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { APIClientFactory } from '../utils/APIClientFactory.js'

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
    const product = await this.findOne({ barcode })

    if (product?.nutrition?.calories) {
      return {
        calories: product.nutrition.calories,
        protein: product.nutrition.protein,
        carbs: product.nutrition.carbs,
        fat: product.nutrition.fat
      }
    }

    const client = APIClientFactory.createOpenFoodAPIClient()
    const response = await client.get(`/api/v0/product/${barcode}.json`)
    if (response.data.status !== 1) {
      throw new Error('Product not found')
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
