/**
 * @file Defines the Product router class.
 * @module productRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import dotenv from 'dotenv'
import { authenticate } from '../../../middlewares/authenticate.js'
import { container, PRODUCTTYPES } from '../../../config/inversify.config.js'
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

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) =>
  container.get(PRODUCTTYPES.ProductController).loadProductDocument(req, res, next, id))

// GET products/search
router.route('/search')
  .get(authenticate, (req, res, next) => container.get(PRODUCTTYPES.ProductController).search(req, res, next))

// Map HTTP verbs and route paths to controller action methods.

// GET products
router.route('/')
  .get(authenticate, (req, res, next) => container.get(PRODUCTTYPES.ProductController).findAll(req, res, next))

// GET products/:id
router.route('/:id')
  .get(authenticate, (req, res, next) => container.get(PRODUCTTYPES.ProductController).find(req, res, next))

// POST /products/custom — add a custom product
router.route('/custom')
  .post(authenticate, (req, res, next) => container.get(PRODUCTTYPES.ProductController).createCustom(req, res, next))

export { router as productRouter }
