/**
 * @file This file contains the ProductRepository class
 * @module ProductRepository
 * @author Beatriz Sanssi
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'

export class ProductRepository extends MongooseRepositoryBase {
  constructor(model) {
    super(model)
  }
}