import express from 'express'
import dotenv from 'dotenv'
import { authenticate } from '../../../middlewares/authenticate.js'
import { container, PRODUCTTYPES } from '../../../config/inversify.config.js'

export const router = express.Router()
dotenv.config()

console.log('statisticsRouter loaded')

// GET /products/eco-score-distribution
router.route('/eco-score-distribution')
  .get(authenticate, (req, res, next) => container.get(PRODUCTTYPES.ProductController).getEcoScoreDistribution(req, res, next))

export { router as statisticsRouter }
