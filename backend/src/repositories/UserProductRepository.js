/**
 * @file This file contains the UserProductRepository class
 * @module UserProductRepository
 * @author Beatriz Sanssi
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'

export class UserProductRepository extends MongooseRepositoryBase {
  constructor(model) {
    super(model)
  }
}