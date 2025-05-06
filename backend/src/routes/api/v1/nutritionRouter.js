/**
 * @file Defines the Nutrition router class.
 * @module nutritionRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import dotenv from 'dotenv'
import { authenticate } from '../../../middlewares/authenticate.js'
import { container, NUTRITIONTYPES } from '../../../config/inversify.config.js'

export const router = express.Router()
dotenv.config()

// GET products/:barcode/nutrition
router.route('/:barcode/nutrition')
  .get(authenticate, (req, res, next) => container.get(NUTRITIONTYPES.NutritionController).getNutrition(req, res, next))

export { router as nutritionRouter }
