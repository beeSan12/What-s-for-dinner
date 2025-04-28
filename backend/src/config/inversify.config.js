/**
 * This file contains the InversifyJS configuration for dependency injection.
 *
 * @module inversify.config
 * @author Beatriz Sanssi
 */
import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'

// Product modules
import { ProductModel } from '../models/ProductModel.js'
import { ProductRepository } from '../repositories/ProductRepository.js'
import { ProductService } from '../services/ProductService.js'
import { ProductController } from '../controllers/ProductController.js'
// User modules
import { UserModel } from '../models/UserModel.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { UserService } from '../services/UserService.js'
import { UserController } from '../controllers/UserController.js'
// Shopping List modules
import { ShoppingListModel } from '../models/ShoppingListModel.js'
import { ShoppingListRepository } from '../repositories/ShoppingListRepository.js'
import { ShoppingListService } from '../services/ShoppingListService.js'
import { ShoppingListController } from '../controllers/ShoppingListController.js'
// User Product modules
import { UserProductModel } from '../models/UserProductModel.js'
import { UserProductRepository } from '../repositories/UserProductRepository.js'
import { UserProductService } from '../services/UserProductService.js'
import { UserProductController } from '../controllers/UserProductController.js'
// Embedding modules
import { EmbeddingController } from '../controllers/EmbeddingController.js'

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

export const SHOPPINGLISTTYPES = {
  ShoppingListController: Symbol.for('ShoppingListController'),
  ShoppingListRepository: Symbol.for('ShoppingListRepository'),
  ShoppingListService: Symbol.for('ShoppingListService'),
  ShoppingListModel: Symbol.for('ShoppingListModel')
}

export const USERPRODUCTTYPES = {
  UserProductController: Symbol.for('UserProductController'),
  UserProductRepository: Symbol.for('UserProductRepository'),
  UserProductService: Symbol.for('UserProductService'),
  UserProductModel: Symbol.for('UserProductModel')
}

export const EMBEDDINGTYPES = {
  EmbeddingController: Symbol.for('EmbeddingController')
}

/**
 * Decorate the classes with InversifyJS decorators.
 * This is necessary for InversifyJS to recognize the classes as injectable.
 */
// Decorate Product classes
decorate(injectable(), ProductRepository)
decorate(injectable(), ProductService)
decorate(injectable(), ProductController)

decorate(inject(PRODUCTTYPES.ProductModel), ProductRepository, 0)
decorate(inject(PRODUCTTYPES.ProductRepository), ProductService, 0)
decorate(inject(PRODUCTTYPES.ProductService), ProductController, 0)
decorate(inject(USERPRODUCTTYPES.UserProductService), ProductController, 1)

// Decorate User classes
decorate(injectable(), UserRepository)
decorate(injectable(), UserService)
decorate(injectable(), UserController)

decorate (inject(USERTYPES.UserModel), UserRepository, 0)
decorate (inject(USERTYPES.UserRepository), UserService, 0)
decorate (inject(USERTYPES.UserService), UserController, 0)

// Decorate Shopping List classes
decorate(injectable(), ShoppingListRepository)
decorate(injectable(), ShoppingListService)
decorate(injectable(), ShoppingListController)

decorate(inject(SHOPPINGLISTTYPES.ShoppingListModel), ShoppingListRepository, 0)
decorate(inject(SHOPPINGLISTTYPES.ShoppingListRepository), ShoppingListService, 0)
decorate(inject(SHOPPINGLISTTYPES.ShoppingListService), ShoppingListController, 0)

// Decorate User Product classes
decorate(injectable(), UserProductRepository)
decorate(injectable(), UserProductService)
decorate(injectable(), UserProductController)

decorate(inject(USERPRODUCTTYPES.UserProductModel), UserProductRepository, 0)
decorate(inject(USERPRODUCTTYPES.UserProductRepository), UserProductService, 0)
decorate(inject(USERPRODUCTTYPES.UserProductService), UserProductController, 0)

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

// Shopping List bindings
container.bind(SHOPPINGLISTTYPES.ShoppingListController).to(ShoppingListController).inSingletonScope()
container.bind(SHOPPINGLISTTYPES.ShoppingListRepository).to(ShoppingListRepository).inSingletonScope()
container.bind(SHOPPINGLISTTYPES.ShoppingListService).to(ShoppingListService).inSingletonScope()
container.bind(SHOPPINGLISTTYPES.ShoppingListModel).toConstantValue(ShoppingListModel)

// User Product bindings
container.bind(USERPRODUCTTYPES.UserProductController).to(UserProductController).inSingletonScope()
container.bind(USERPRODUCTTYPES.UserProductRepository).to(UserProductRepository).inSingletonScope()
container.bind(USERPRODUCTTYPES.UserProductService).to(UserProductService).inSingletonScope()
container.bind(USERPRODUCTTYPES.UserProductModel).toConstantValue(UserProductModel)

// Embedding bindings
container.bind(EMBEDDINGTYPES.EmbeddingController).to(EmbeddingController).inSingletonScope()