/**
 * @file This file contains the AuthRepository class
 * @module AuthRepository
 * @author Beatriz Sanssi
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { UserModel } from '../models/UserModel.js'

/**
 * Encapsulates the auth repository.
 */
export class AuthRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance of the EmbeddingRepository class.
   *
   */
  constructor () {
    super(UserModel)
  }
}
