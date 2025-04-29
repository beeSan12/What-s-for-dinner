/**
 * @file This file contains the ShoppingListRepository class
 * @module ShoppingListRepository
 * @author Beatriz Sanssi
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'

/**
 * Encapsulates the shopping list repository.
 */
export class ShoppingListRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance of the ShoppingListRepository class.
   *
   * @param {*} model - The Mongoose model to use for the repository.
   */
  constructor (model) {
    super(model)
  }
}
