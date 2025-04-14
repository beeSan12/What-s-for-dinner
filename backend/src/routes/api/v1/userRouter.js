import express from 'express'
import dotenv from 'dotenv'
import { container, USERTYPES } from '../../../config/inversify.config.js'

dotenv.config()

export const router = express.Router()

// Register
router.route('/register')
router.post((req, res, next) => container.get(USERTYPES.UserController).register(req, res, next))

// Login
router.route('/login')
router.post((req, res, next) => container.get(USERTYPES.UserController).login(req, res, next))

export { router as userRouter }