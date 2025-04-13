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
   * Fetches products based on a search query.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  async search(req, res, next) {
    try {
      const query = req.query.q || ''
      const result = await this.productService.search(query)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Fetches all products.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   */
  async findAll(req, res, next) {
    try {
      const products = await this.productService.findAll()
      res.json(products)
    } catch (error) {
      next(error)
    }
  }
}