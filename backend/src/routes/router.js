/**
 * @file Defines the main router.
 * @module router
 * @author Mats Loock & Beatriz Sanssi <bs222eh@student.lnu.se>
 */

// User-land modules.
import express from 'express'

// Application modules.
import { router as v1Router } from './api/v1/router.js'

export const router = express.Router()

router.use('/api/v1', v1Router)
