/**
 * @file Defines the Product router class.
 * @module productRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import dotenv from 'dotenv'
import { container, TYPES } from '../../../config/inversify.config.js'
// import { container } from '../../../config/inversify.config.js'
// import { TYPES } from '../../../config/types.js'

export const router = express.Router()

dotenv.config()

// const productController = container.get(TYPES.ProductController)

// // GET all products
// router.get('/', (req, res, next) =>
//   productController.getAll(req, res, next))

// // GET a product by ID
// router.get('/:id', (req, res, next) =>
//   productController.getById(req, res, next))

// // GET products by category
// router.get('/search', (req, res, next) =>
//   productController.search(req, res, next))
// GET products/search
router.get('/search', (req, res, next) =>
  container.get(TYPES.ProductController).search(req, res, next))

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) =>
  container.get(TYPES.ProductController).loadProductDocument(req, res, next, id))

// Map HTTP verbs and route paths to controller action methods.

// GET products
router.route('/')
  .get((req, res, next) => container.get(TYPES.ProductController).findAll(req, res, next))

// GET products/:id
router.route('/:id')
  .get((req, res, next) => container.get(TYPES.ProductController).find(req, res, next))


export { router as productRouter }