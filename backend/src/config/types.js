/**
 * @file Defines the types used in the IoC container.
 * @module types
 * @author Beatriz Sanssi
 */

export const TYPES = {
  ProductController: Symbol.for('ProductController'),
  ProductService: Symbol.for('ProductService'),
  ProductRepository: Symbol.for('ProductRepository'),
  ProductModel: Symbol.for('ProductModel')
}