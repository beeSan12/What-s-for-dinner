/**
 * @file This file contains the ProductService class
 * @module ProductService
 * @author Beatriz Sanssi
 */

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'

/**
 * Encapsulates a task service.
 */
export class ProductService extends MongooseServiceBase {
  /**
   * Searches for products by name.
   *
   * @param {string} name - The name to search for.
   * @returns {Promise<object[]>} A list of matching products.
   */
  async searchByName (name) {
    if (!name) {
      throw new Error('Missing search term')
    }
    return this.search({ product_name: new RegExp(name, 'i') })
  }

  /**
   * Return combined list from both sources.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} nameFilter - The name filter to apply.
   * @returns {Promise<object[]>} A list of all products.
   */
  async getAllProducts (userId, nameFilter) {
    const regex = nameFilter ? new RegExp(nameFilter, 'i') : undefined

    const standardProducts = await this.search(regex ? { product_name: regex } : {})
    const userProducts = await this.userProductService.getAllByUser(userId, nameFilter)

    // Combine and remove duplicates by product_name
    const combined = [...userProducts, ...standardProducts.data || standardProducts]

    const unique = Array.from(
      new Map(combined.map(p => [p.product_name.toLowerCase(), p])).values()
    )
    return unique
  }
}
