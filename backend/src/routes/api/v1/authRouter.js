/**
 * @file Defines the Auth router class.
 * @module authRouter
 * @author Beatriz Sanssi <bs222eh@student.lnu>
 */

import express from 'express'
import dotenv from 'dotenv'
import { AuthController } from '../../../controllers/AuthController.js'
import { authenticateUser } from '../../../middleware/authenticateUser.js'

export const router = express.Router()

dotenv.config()

router.get('/login', AuthController.login)
router.get('/callback', AuthController.callback)
router.get('/logout', authenticateUser, AuthController.logout)

export { router as authRouter }
