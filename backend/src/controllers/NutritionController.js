/**
 * @file Defines the NutritionController.
 * @module NutritionController
 * @author Beatriz Sanssi
 */

// Application modules.
import { NutritionService } from '../services/NutritionService.js'
import { logger } from '../config/winston.js'

/**
 * Encapsulates a controller.
 */
export class NutritionController {
  /**
   * The service.
   *
   * @type {NutritionService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {NutritionService} service - A service instantiated from a class with the same capabilities as NutritionService.
   */
  constructor (service) {
    logger.silly('NutritionController constructor')
    this.#service = service
  }

  /**
   * Sends a JSON response containing a product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async getNutrition (req, res, next) {
    try {
      const { barcode } = req.params
      const data = await this.#service.getNutritionInformation(barcode)
      res.json(data)
    } catch (err) {
      next(err)
    }
  }
}
