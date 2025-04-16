/**
 * @file This file contains the ShoppingListService class
 * @module ShoppingListService
 * @author Beatriz Sanssi
*/

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'

/**
 * Encapsulates a task service.
 */
export class ShoppingListService extends MongooseServiceBase {
  /**
   * Adds a product to a shopping list.
   *
   * @param {string} listId - The ID of the shopping list.
   * @param {object} product - The product to add.
   */
  async addProductToList(listId, product) {
    const list = await this.getById(listId)
    list.products.push(product)
    return await list.save()
  }

  /**
   * Creates a custom product and adds it to a shopping list.
   *
   * @param {string} listId - The ID of the shopping list.
   * @param {object} productData - The data for the custom product.
   * @returns {Promise<object>} The updated shopping list.
   */
  async createCustomProductAndAdd(listId, productData) {
    const newProduct = await this.repository.model.db.model('Product').create(productData)
    return this.addProductToList(listId, { productId: newProduct._id, customName: productData.product_name })
  }

  /**
   * Searches for products by name.
   *
   * @param {string} name - The name to search for.
   * @returns {Promise<object[]>} A list of matching products.
   */
  async searchProductsByName(name) {
    return this.repository.model.db.model('Product').find({ product_name: new RegExp(name, 'i') })
  }
}