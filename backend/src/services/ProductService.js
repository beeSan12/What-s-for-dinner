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
  async searchByName(name) {
    if (!name) {
      throw new Error('Missing search term')
    }
    return this.search({ product_name: new RegExp(name, 'i') })
  }

  /**
   * Return combined list from both sources.
   * @param {string} userId
   * @param {string} nameFilter
   */
  async getAllProducts(userId, nameFilter) {
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

  //  /**
  //  * Inserts a new product if it doesn't already exist.
  //  *
  //  * @param {object} data - Product data to insert.
  //  * @returns {Promise<object>} - The created product document.
  //  */
  //  async insert(data) {
  //   // Check if a product with the same name already exists
  //   const existing = await this.search({ product_name: new RegExp(`^${data.product_name}$`, 'i') })

  //   if (existing.length > 0) {
  //     throw new Error(`Product with name "${data.product_name}" already exists.`)
  //   }

  //   // Insert the new product
  //   return this.insert(data)
  // }
}

// /**
//  * The ProductService class provides methods to interact with the product repository.
//  * It allows searching for products by name and retrieving all products.
//  */
// export class ProductService {
//   constructor(productRepository) {
//     this.productRepository = productRepository
//   }

//   /**
//    * Searches for products by name.
//    *
//    * @param {string} query - The search query.
//    * @returns {Promise<Array>} - A promise that resolves to an array of products.
//    */
//   async search(query) {
//     return this.productRepository.get({ product_name: new RegExp(query, 'i') })
//   }

//   /**
//    * Retrieves all products.
//    *
//    * @returns {Promise<Array>} - A promise that resolves to an array of all products.
//    */
//   async findAll() {
//     return this.productRepository.get({})
//   }

//   /**
//    * Retrieves a product by its ID.
//    *
//    * @param {string} id - The product ID.
//    * @returns {Promise<object>} - A promise that resolves to the product object.
//    */
//   async findById(id) {
//     return this.repository.getById(id)
//   }
// }