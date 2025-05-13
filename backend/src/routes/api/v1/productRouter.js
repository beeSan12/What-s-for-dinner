/**
 * @file Defines the Product router class.
 * @module productRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import dotenv from 'dotenv'
import { authenticate } from '../../../middlewares/authenticate.js'
import { container, PRODUCTTYPES } from '../../../config/inversify.config.js'

export const router = express.Router()
dotenv.config()

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

// GET /products/
router.route('/:barcode/allergens')
  .get(authenticate, (req, res, next) => container.get(PRODUCTTYPES.ProductController).getAllergens(req, res, next))

// GET /products/:barcode/ingredients
router.route('/:barcode/ingredients')
  .get(authenticate, (req, res, next) => container.get(PRODUCTTYPES.ProductController).getIngredients(req, res, next))

// POST /products/eco-score/filter
router.route('/eco-score/filter')
  .post(authenticate, (req, res, next) => container.get(PRODUCTTYPES.ProductController).filterByEcoScore(req, res, next))

// GET /products/eco-score
router.route('/:barcode/eco-score')
  .get(authenticate, (req, res, next) => container.get(PRODUCTTYPES.ProductController).getEcoScore(req, res, next))

// GET /products/smart-search
router.route('/smart-search')
  .get(authenticate, (req, res, next) => container.get(PRODUCTTYPES.ProductController).smartSearch(req, res, next))

export { router as productRouter }
