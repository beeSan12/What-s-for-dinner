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

/**
 * The TYPES object contains the identifiers for the dependencies in the application.
 */
export const TYPES = {
  ProductController: Symbol.for('ProductController'),
  ProductRepository: Symbol.for('ProductRepository'),
  ProductService: Symbol.for('ProductService'),
  ProductModelClass: Symbol.for('ProductModelClass')
}

/**
 * Decorate the classes with InversifyJS decorators.
 * This is necessary for InversifyJS to recognize the classes as injectable.
 */
decorate(injectable(), ProductRepository)
decorate(injectable(), ProductService)
decorate(injectable(), ProductController)

decorate(inject(TYPES.ProductModelClass), ProductRepository, 0)
decorate(inject(TYPES.ProductRepository), ProductService, 0)
decorate(inject(TYPES.ProductService), ProductController, 0)

export const container = new Container()

/**
 * The container is configured with the bindings for the dependencies.
 * Each binding associates an identifier with a specific implementation.
 * The inSingletonScope() method ensures that only one instance of the class is created.
 */
container.bind(TYPES.ProductController).to(ProductController).inSingletonScope()
container.bind(TYPES.ProductRepository).to(ProductRepository).inSingletonScope()
container.bind(TYPES.ProductService).to(ProductService).inSingletonScope()
container.bind(TYPES.ProductModelClass).toConstantValue(ProductModel)