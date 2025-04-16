/**
 * @file Defines the UserProductController.
 * @module UserProductController
 * @author Beatriz Sanssi
 */

// Application modules.
// import { NotModifiedError } from '../lib/errors/NotModifiedError.js'
import { convertToHttpError } from '../lib/util.js'
import { UserProductService } from '../services/UserProductService.js'
import { logger } from '../config/winston.js'

/**
 * Encapsulates a controller.
 */
export class UserProductController {
  /**
   * The service.
   *
   * @type {UserProductService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {UserProductService} service - A service instantiated from a class with the same capabilities as TaskService.
   */
  constructor (service) {
    logger.silly('UserProductController constructor')
    this.#service = service
  }

  /**
   * Provide req.doc to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the product to load.
   */
    async loadProductDocument (req, res, next, id) {
    try {
      req.doc = await this.#service.getById(id)
      next()
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

   /**
   * Sends a JSON response containing a product.
   *
   * @param {string} userId - The ID of the user.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
   async find (userId, req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Creates a new product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async createCustom(req, res, next) {
    try {
      const userId = req.user.id
      const productData = req.body
      const saved = await this.#service.insert(productData)
      res.status(201).json(saved)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles the request to update an existing product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async update(req, res, next) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const updated = await this.#service.updateByUser(id, userId, req.body)
      res.json(updated)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles the request to delete an existing product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async remove(req, res, next) {
    try {
      const { id } = req.params
      const userId = req.user.id
      await this.#service.deleteByUser(id, userId)
      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles the request to get all products for a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll(req, res, next) {
    try {
      const userId = req.user.id
      const nameFilter = req.query.name?.toString() || undefined

      const products = await this.#service.getAllByUser(userId, nameFilter)
      res.json(products)
    } catch (err) {
      next(err)
    }
  }
}