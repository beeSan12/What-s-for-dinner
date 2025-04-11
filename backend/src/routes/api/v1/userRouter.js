/**
 * @file Defines the User router class.
 * @module userRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import { UserController } from '../../../controllers/UserController.js'

export const router = express.Router()

router.get('/profile', UserController.getUserProfile)
router.get('/projects', UserController.getUserProjects)
router.get('/activities', UserController.getUserActivities)

export { router as userRouter }
