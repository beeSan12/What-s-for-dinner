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
// Auth modules
import { AuthService } from '../services/AuthService.js'
import { AuthController } from '../controllers/AuthController.js'
import { AuthRepository } from '../repositories/AuthRepository.js'
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
import { EmbeddingModel } from '../models/EmbeddingModel.js'
import { EmbeddingController } from '../controllers/EmbeddingController.js'
import { EmbeddingRepository } from '../repositories/EmbeddingRepository.js'
import { EmbeddingService } from '../services/EmbeddingService.js'
// Recipe modules
import { RecipeController } from '../controllers/RecipeController.js'
import { RecipeModel } from '../models/RecipeModel.js'
import { RecipeRepository } from '../repositories/RecipeRepository.js'
import { RecipeService } from '../services/RecipeService.js'

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

export const AUTHTYPES = {
  AuthController: Symbol.for('AuthController'),
  AuthRepository: Symbol.for('AuthRepository'),
  AuthService: Symbol.for('AuthService')
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
  EmbeddingController: Symbol.for('EmbeddingController'),
  EmbeddingModel: Symbol.for('EmbeddingModel'),
  EmbeddingRepository: Symbol.for('EmbeddingRepository'),
  EmbeddingService: Symbol.for('EmbeddingService')
}

export const RECIPETYPES = {
  RecipeController: Symbol.for('RecipeController'),
  RecipeModel: Symbol.for('RecipeModel'),
  RecipeRepository: Symbol.for('RecipeRepository'),
  RecipeService: Symbol.for('RecipeService')
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

decorate(inject(USERTYPES.UserModel), UserRepository, 0)
decorate(inject(USERTYPES.UserRepository), UserService, 0)
decorate(inject(USERTYPES.UserService), UserController, 0)

// Decorate Auth classes
decorate(injectable(), AuthRepository)
decorate(injectable(), AuthService)
decorate(injectable(), AuthController)

decorate(inject(USERTYPES.UserModel), AuthRepository, 0)
decorate(inject(AUTHTYPES.AuthRepository), AuthService, 0)
decorate(inject(AUTHTYPES.AuthService), AuthController, 0)

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

// Decorate Embedding classes
decorate(injectable(), EmbeddingRepository)
decorate(injectable(), EmbeddingService)
decorate(injectable(), EmbeddingController)

decorate(inject(EMBEDDINGTYPES.EmbeddingModel), EmbeddingRepository, 0)
decorate(inject(EMBEDDINGTYPES.EmbeddingRepository), EmbeddingService, 0)
decorate(inject(EMBEDDINGTYPES.EmbeddingService), EmbeddingController, 0)
decorate(inject(RECIPETYPES.RecipeService), EmbeddingController, 1)

// Decorate Recipe classes
decorate(injectable(), RecipeRepository)
decorate(injectable(), RecipeService)
decorate(injectable(), RecipeController)

decorate(inject(RECIPETYPES.RecipeModel), RecipeRepository, 0)
decorate(inject(RECIPETYPES.RecipeRepository), RecipeService, 0)
decorate(inject(RECIPETYPES.RecipeService), RecipeController, 0)
decorate(inject(EMBEDDINGTYPES.EmbeddingService), RecipeController, 1)

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

// Auth bindings
container.bind(AUTHTYPES.AuthController).to(AuthController).inSingletonScope()
container.bind(AUTHTYPES.AuthRepository).to(AuthRepository).inSingletonScope()
container.bind(AUTHTYPES.AuthService).to(AuthService).inSingletonScope()
container.bind(AUTHTYPES.UserModel).toConstantValue(UserModel)

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
container.bind(EMBEDDINGTYPES.EmbeddingModel).toConstantValue(EmbeddingModel)
container.bind(EMBEDDINGTYPES.EmbeddingRepository).to(EmbeddingRepository).inSingletonScope()
container.bind(EMBEDDINGTYPES.EmbeddingService).to(EmbeddingService).inSingletonScope()

// Recipe bindings
container.bind(RECIPETYPES.RecipeController).to(RecipeController).inSingletonScope()
container.bind(RECIPETYPES.RecipeModel).toConstantValue(RecipeModel)
container.bind(RECIPETYPES.RecipeRepository).to(RecipeRepository).inSingletonScope()
container.bind(RECIPETYPES.RecipeService).to(RecipeService).inSingletonScope()
