import express from 'express'
import dotenv from 'dotenv'
import { container, USERTYPES } from '../../../config/inversify.config.js'

dotenv.config()

export const router = express.Router()

// Register
router.post('/register', (req, res, next) =>
  container.get(USERTYPES.UserController).register(req, res, next)
)

// Login
router.post('/login', (req, res, next) =>
  container.get(USERTYPES.UserController).login(req, res, next)
)
export { router as userRouter }
