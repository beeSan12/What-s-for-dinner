/**
 * @file Defines the Shopping List router class.
 * @module shoppingListRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import dotenv from 'dotenv'
import { authenticate } from '../../../middlewares/authenticate.js'
import { container, SHOPPINGLISTTYPES } from '../../../config/inversify.config.js'

export const router = express.Router()

dotenv.config()

router.post('/', authenticate, (req, res, next) =>
  container.get(SHOPPINGLISTTYPES.ShoppingListController).createList(req, res, next)
)

export { router as shoppingListRouter }