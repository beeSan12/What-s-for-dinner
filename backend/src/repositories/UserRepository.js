/**
 * @file This file contains the UserRepository class
 * @module UserRepository
 * @author Beatriz Sanssi
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { UserModel } from '../models/UserModel.js'

/**
 * Encapsulates the user repository.
 */
export class UserRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance of the EmbeddingRepository class.
   *
   */
  constructor () {
    super(UserModel)
  }
}
