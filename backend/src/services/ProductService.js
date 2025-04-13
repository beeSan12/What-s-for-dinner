/**
 * @file This file contains the ProductService class
 * @module ProductService
 * @author Beatriz Sanssi
*/

/**
 * The ProductService class provides methods to interact with the product repository.
 * It allows searching for products by name and retrieving all products.
 */
export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository
  }

  /**
   * Searches for products by name.
   *
   * @param {string} query - The search query.
   * @returns {Promise<Array>} - A promise that resolves to an array of products.
   */
  async search(query) {
    return this.productRepository.get({ product_name: new RegExp(query, 'i') })
  }

  /**
   * Retrieves all products.
   *
   * @returns {Promise<Array>} - A promise that resolves to an array of all products.
   */
  async findAll() {
    return this.productRepository.get({})
  }

  /**
   * Retrieves a product by its ID.
   *
   * @param {string} id - The product ID.
   * @returns {Promise<object>} - A promise that resolves to the product object.
   */
  async findById(id) {
    return this.repository.getById(id)
  }
}