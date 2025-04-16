/**
 * @file This file contains the ShoppingListRepository class
 * @module ShoppingListRepository
 * @author Beatriz Sanssi
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'

export class ShoppingListRepository extends MongooseRepositoryBase {
  constructor(model) {
    super(model)
  }
}