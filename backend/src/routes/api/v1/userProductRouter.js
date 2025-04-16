/**
 * @file Defines the User Product router class.
 * @module userProductRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import dotenv from 'dotenv'
import { container, USERPRODUCTTYPES } from '../../../config/inversify.config.js'

export const router = express.Router()

dotenv.config()

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) =>
  container.get(USERPRODUCTTYPES.UserProductController).loadProductDocument(req, res, next, id))

// GET products/search
router.route('/search')
  .get((req, res, next) => container.get(USERPRODUCTTYPES.UserProductController).search(req, res, next))

// Map HTTP verbs and route paths to controller action methods.

// GET user products
router.route('/')
  .get((req, res, next) => container.get(USERPRODUCTTYPES.UserProductController).findAll(req, res, next))

// POST /products/custom — add a custom product
router.route('/')
  .post((req, res, next) => container.get(USERPRODUCTTYPES.UserProductController).createCustom(req, res, next))

// GET user products/:id
router.route('/:id')
  .get((req, res, next) => container.get(USERPRODUCTTYPES.UserProductController).find(req, res, next))

// PUT /products/:id — update a product
router.route('/:id')
  .put((req, res, next) => container.get(USERPRODUCTTYPES.UserProductController).update(req, res, next))
// DELETE /products/:id — delete a product
router.route('/:id')
  .delete((req, res, next) => container.get(USERPRODUCTTYPES.UserProductController).delete(req, res, next))
// PATCH /products/:id — partially update a product
router.route('/:id')
  .patch((req, res, next) => container.get(USERPRODUCTTYPES.UserProductController).update(req, res, next))

export { router as userProductRouter }