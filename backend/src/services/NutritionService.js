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
    const product = await this.getOne({ barcode })

    if (product?.nutrition?.calories) {
      return {
        calories: product.nutrition.calories,
        protein: product.nutrition.protein,
        carbs: product.nutrition.carbs,
        fat: product.nutrition.fat,
        fiber: product.nutrition.fiber,
        sugars: product.nutrition.sugars,
        salt: product.nutrition.salt,
        sodium: product.nutrition.sodium,
        saturatedFat: product.nutrition.saturatedFat,
        cholesterol: product.nutrition.cholesterol
      }
    }

    const client = APIClientFactory.createOpenFoodAPIClient()
    const response = await client.get(`/api/v0/product/${barcode}.json`)
    if (response.data.status !== 1) {
      throw new Error('Product not found')
    }

    const nutri = response.data.product.nutriments || {}
    return {
      calories: Math.round(nutri['energy-kcal_100g'] || 0),
      protein: Math.round(nutri.proteins_100g || 0),
      carbs: Math.round(nutri.carbohydrates_100g || 0),
      fat: Math.round(nutri.fat_100g || 0),
      fiber: Math.round(nutri.fiber_100g || 0),
      sugars: Math.round(nutri.sugars_100g || 0),
      salt: Math.round(nutri.salt_100g || 0),
      sodium: Math.round(nutri.sodium_100g || 0),
      saturatedFat: Math.round(nutri.saturated_fat_100g || 0),
      cholesterol: Math.round(nutri.cholesterol_100g || 0)
    }
  }
}
