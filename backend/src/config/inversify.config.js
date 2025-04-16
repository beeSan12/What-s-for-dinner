/**
 * This file contains the InversifyJS configuration for dependency injection.
 *
 * @module inversify.config
 * @author Beatriz Sanssi
 */
import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'

import { ProductModel } from '../models/ProductModel.js'
import { ProductRepository } from '../repositories/ProductRepository.js'
import { ProductService } from '../services/ProductService.js'
import { ProductController } from '../controllers/ProductController.js'
import { UserModel } from '../models/UserModel.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserService } from '../services/UserService.js'
import { UserController } from '../controllers/UserController.js'

/**
 * The TYPES object contains the identifiers for the dependencies in the application.
 */
export const PRODUCTTYPES = {
  ProductController: Symbol.for('ProductController'),
  ProductRepository: Symbol.for('ProductRepository'),
  ProductService: Symbol.for('ProductService'),
  ProductModel: Symbol.for('ProductModel')
}

export const USERTYPES = {
  UserController: Symbol.for('UserController'),
  UserRepository: Symbol.for('UserRepository'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel')
}

/**
 * Decorate the classes with InversifyJS decorators.
 * This is necessary for InversifyJS to recognize the classes as injectable.
 */
// Product types
decorate(injectable(), ProductRepository)
decorate(injectable(), ProductService)
decorate(injectable(), ProductController)

decorate(inject(PRODUCTTYPES.ProductModel), ProductRepository, 0)
decorate(inject(PRODUCTTYPES.ProductRepository), ProductService, 0)
decorate(inject(PRODUCTTYPES.ProductService), ProductController, 0)

// User types
decorate(injectable(), UserRepository)
decorate(injectable(), UserService)
decorate(injectable(), UserController)

decorate (inject(USERTYPES.UserModel), UserRepository, 0)
decorate (inject(USERTYPES.UserRepository), UserService, 0)
decorate (inject(USERTYPES.UserService), UserController, 0)
export const container = new Container()

/**
 * The container is configured with the bindings for the dependencies.
 * Each binding associates an identifier with a specific implementation.
 * The inSingletonScope() method ensures that only one instance of the class is created.
 */
// Product bindings
container.bind(PRODUCTTYPES.ProductController).to(ProductController).inSingletonScope()
container.bind(PRODUCTTYPES.ProductRepository).to(ProductRepository).inSingletonScope()
container.bind(PRODUCTTYPES.ProductService).to(ProductService).inSingletonScope()
container.bind(PRODUCTTYPES.ProductModel).toConstantValue(ProductModel)

// User bindings
container.bind(USERTYPES.UserController).to(UserController).inSingletonScope()
container.bind(USERTYPES.UserRepository).to(UserRepository).inSingletonScope()
container.bind(USERTYPES.UserService).to(UserService).inSingletonScope()
container.bind(USERTYPES.UserModel).toConstantValue(UserModel)