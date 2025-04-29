/**
 * @file This file contains the EmbeddingRepository class
 * @module EmbeddingRepository
 * @author Beatriz Sanssi
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'

/**
 * Encapsulates the embedding repository.
 */
export class EmbeddingRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance of the EmbeddingRepository class.
   *
   * @param {*} model - The Mongoose model to use for the repository.
   */
  constructor (model) {
    super(model)
  }
}
