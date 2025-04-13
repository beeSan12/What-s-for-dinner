/**
 * @file Defines the Product router class.
 * @module productRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import dotenv from 'dotenv'
import { container } from '../config/inversify.config.js'
import { TYPES } from '../config/types.js'

export const router = express.Router()

dotenv.config()

const productController = container.get(TYPES.ProductController)

// GET all products
router.get('/products', (req, res, next) =>
  productController.getAll(req, res, next))

// GET a product by ID
router.get('/products/:id', (req, res, next) =>
  productController.getById(req, res, next))

// GET products by category
router.get('/products/search', (req, res, next) =>
  productController.search(req, res, next))

export { router as productRouter }