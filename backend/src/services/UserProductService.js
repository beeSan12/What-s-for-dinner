/**
 * @file This file contains the UserProductService class
 * @module UserProductService
 * @author Beatriz Sanssi
*/

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'

/**
 * Encapsulates a task service.
 */
export class UserProductService extends MongooseServiceBase {
  /**
   * Searches for products by name.
   *
   * @param {string} name - The name to search for.
   * @param {string} userId - The ID of the user who owns the products.
   * @returns {Promise<object[]>} A list of matching products.
   */
  async searchByNameAndUser(name, userId) {
    return this.search({ userId,product_name: new RegExp(name, 'i') })
  }

  /**
   * Retrieves a product by ID and user ID.
   *
   * @param {string} id - The ID of the product to retrieve.
   * @param {string} userId - The ID of the user who owns the product.
   * @returns {Promise<object>} - The product document.
   */
  async getById(id, userId) {
    const product = await this.getOne({ _id: id, userId })
    
    if (!product) {
      throw new Error('Product not found or unauthorized')
    }

    return product
  }

   /**
   * Inserts a new product if it doesn't already exist.
   *
   * @param {object} data - Product data to insert.
   * @returns {Promise<object>} - The created product document.
   */
   async insert(data) {
    // Check if a product with the same name already exists
    const existing = await this.search({ product_name: new RegExp(`^${data.product_name}$`, 'i') })

    if (existing.length > 0) {
      throw new Error(`Product with name "${data.product_name}" already exists.`)
    }

    // Insert the new product
    return this.insert(data)
  }

  /**
   * Updates a product by ID and user ID.
   *
   * @param {string} id - The ID of the product to update.
   * @param {string} userId - The ID of the user who owns the product.
   * @param {object} updateData - The data to update the product with.
   * @returns {Promise<object>} - The updated product document.
   */
  async updateByUser(id, userId, updateData) {
    // Check if the product exists and belongs to the user
    const doc = await this.getOne({ _id: id, userId })

    if (!doc) {
      throw new Error('Product not found or unauthorized')
    }
    return this.updateOrReplace(doc, updateData)
  }

  /**
   * Deletes a product by ID and user ID.
   *
   * @param {string} id - The ID of the product to delete.
   * @param {string} userId - The ID of the user who owns the product.
   * @returns {Promise<object>} - The deleted product document.
   */
  async deleteByUser(id, userId) {
    const doc = await this.getOne({ _id: id, userId })

    if (!doc) {
      throw new Error('Product not found or unauthorized')
    }
  
    return this.delete(doc, {}) // Empty object because version key data can be internally added
  }
  
  /**
   * Retrieves all products for a specific user.
   *
   * @param {string} userId - The ID of the user whose products to retrieve.
   * @returns {Promise<object[]>} A list of products for the specified user.
   */
  async getAllByUser(userId, nameFilter) {
    const filter = { userId }
    if (nameFilter) {
      filter.product_name = new RegExp(nameFilter, 'i')
    }
    return this.get({ filter })
  }
}