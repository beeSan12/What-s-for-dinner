/**
 * @file Defines the Recipe router class.
 * @module recipeRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import dotenv from 'dotenv'
import { authenticate } from '../../../middlewares/authenticate.js'
import { container, RECIPETYPES } from '../../../config/inversify.config.js'

export const router = express.Router()

dotenv.config()

// POST /recipes/generate
router.route('/generate')
  .post(authenticate, (req, res, next) => container.get(RECIPETYPES.RecipeController).generateRecipe(req, res, next))

export { router as recipeRouter }
