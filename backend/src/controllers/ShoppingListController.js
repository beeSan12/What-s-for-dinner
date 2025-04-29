/**
 * @file Defines the ShoppingListController.
 * @module ShoppingListController
 * @author Beatriz Sanssi
 */

import { ShoppingListService } from '../services/ShoppingListService.js'
import { logger } from '../config/winston.js'
import { convertToHttpError } from '../lib/util.js'

/**
 * Encapsulates a controller.
 */
export class ShoppingListController {
  /**
   * The service.
   *
   * @type {ShoppingListService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {ShoppingListService} service - A service instantiated from a class with the same capabilities as ShoppingListService.
   */
  constructor (service) {
    logger.silly('ShoppingListController constructor')
    this.#service = service
  }

  /**
   * Searches for products by name.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async search (req, res, next) {
    try {
      const results = await this.#service.searchProductsByName(req.query.name)
      if (results.length === 0) {
        return res.json({ message: 'No product found', showAddCustomOption: true })
      }
      res.json(results)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Adds a product to a shopping list.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async addToList (req, res, next) {
    try {
      const { listId, productId, quantity } = req.body
      const product = { productId, quantity }
      const result = await this.#service.addProductToList(listId, product)
      res.json(result)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Creates a custom product and adds it to a shopping list.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async addCustomProduct (req, res, next) {
    try {
      const { listId, name, quantity } = req.body
      const result = await this.#service.createCustomProductAndAdd(listId, { product_name: name, quantity })
      res.json(result)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Creates a new shopping list.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async createList (req, res, next) {
    try {
      const { name, items } = req.body
      const userId = req.user.id
      const result = await this.#service.createList(name, userId, items)
      res.json(result)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }
}
