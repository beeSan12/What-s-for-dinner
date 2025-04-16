/**
 * @file Defines the ShoppingListController.
 * @module ShoppingListController
 * @author Beatriz Sanssi
 */

/**
 * Encapsulates a controller.
 */
export class ShoppingListController {
  /**
   * The service.
   *
   * @type {ProductService}
   */
  constructor(service) {
    this.service = service
  }

  /**
   * Searches for products by name.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async search(req, res, next) {
    const results = await this.service.searchProductsByName(req.query.name)
    if (results.length === 0) {
      return res.json({ message: 'No product found', showAddCustomOption: true })
    }
    res.json(results)
  }

  /**
   * Adds a product to a shopping list.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async addToList(req, res, next) {
    const { listId, productId, quantity } = req.body
    const product = { productId, quantity }
    const result = await this.service.addProductToList(listId, product)
    res.json(result)
  }

  /**
   * Creates a custom product and adds it to a shopping list.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async addCustomProduct(req, res, next) {
    const { listId, name, quantity } = req.body
    const result = await this.service.createCustomProductAndAdd(listId, { product_name: name, quantity })
    res.json(result)
  }
}