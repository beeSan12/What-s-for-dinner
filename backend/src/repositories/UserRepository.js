/**
 * @file This file contains the UserRepository class
 * @module UserRepository
 * @author Beatriz Sanssi
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'

/**
 * Encapsulates the user repository.
 */
export class UserRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance of the UserRepository class.
   *
   * @param {*} model - The Mongoose model to use for the repository.
   */
  constructor (model) {
    super(model)
  }
}
