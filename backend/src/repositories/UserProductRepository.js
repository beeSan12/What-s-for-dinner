/**
 * @file This file contains the UserProductRepository class
 * @module UserProductRepository
 * @author Beatriz Sanssi
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'

/**
 * Encapsulates the user product repository.
 */
export class UserProductRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance of the UserProductRepository class.
   *
   * @param {*} model - The Mongoose model to use for the repository.
   */
  constructor (model) {
    super(model)
  }
}
