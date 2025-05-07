/**
 * @file Defines the AuthController class.
 * @module AuthController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { logger } from '../config/winston.js'
import { AuthService } from '../services/AuthService.js'

/**
 * Encapsulates a controller.
 */
export class AuthController {
  /**
   * The service.
   *
   * @type {AuthService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {AuthService} service - A service instantiated from a class with the same capabilities as AuthService.
   */
  constructor (service) {
    logger.silly('AuthController constructor')
    this.#service = service
  }

  /**
   * Handles the request to login a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async login (req, res, next) {
    const result = await this.#service.login(req.body)
    res.json(result)
  }

  /**
   * Handles the request to refresh a token.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async refresh (req, res, next) {
    const result = await this.#service.refreshToken(req.body)
    res.json(result)
  }
}

export const authController = new AuthController()
