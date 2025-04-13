/**
 * @file Defines the ProductController.
 * @module ProductController
 * @author Beatriz Sanssi
 */

/**
 * Controller for handling product-related requests.
 */
export class ProductController {
  constructor(productService) {
    this.productService = productService
  }

  /**
   * Fetches all products.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async getAll(req, res, next) {
    try {
      const result = await this.productService.findAll()
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Fetches a product by its ID.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async getById(req, res, next) {
    try {
      const result = await this.productService.findById(req.params.id)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Searches for products by name.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async search(req, res, next) {
    try {
      const { name } = req.query
      const result = await this.productService.searchByName(name)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }
}