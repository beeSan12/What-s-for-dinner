/**
 * @file Defines the UserController.
 * @module UserController
 * @author Beatriz Sanssi
 */

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * The service.
   *
   * @type {UserService}
   */
  constructor(service) {
    this.service = service
  }

  /**
   * Handles the request to register a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async register(req, res, next) {
    const result = await this.userService.register(req.body)
    res.json(result)
  }

  /**
   * Handles the request to login a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async login(req, res, next) {
    const result = await this.userService.login(req.body)
    res.json(result)
  }
}