/**
 * @file Defines the Embedding router class.
 * @module embeddingRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import dotenv from 'dotenv'
import { authenticate } from '../../../middlewares/authenticate.js'
import { container, EMBEDDINGTYPES } from '../../../config/inversify.config.js'

export const router = express.Router()

dotenv.config()

// POST /embeddings/save
router.route('/save')
  .post(authenticate, (req, res, next) =>
    container.get(EMBEDDINGTYPES.EmbeddingController).saveEmbedding(req, res, next)
  )

// POST /embeddings/search
router.route('/search')
  .post(authenticate, (req, res, next) =>
    container.get(EMBEDDINGTYPES.EmbeddingController).searchEmbedding(req, res, next)
  )

export { router as embeddingRouter }
