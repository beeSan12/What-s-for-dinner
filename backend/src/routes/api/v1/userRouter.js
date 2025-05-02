import express from 'express'
import dotenv from 'dotenv'
import { container, USERTYPES, AUTHTYPES } from '../../../config/inversify.config.js'

dotenv.config()

export const router = express.Router()

// Register
router.post('/register', (req, res, next) =>
  container.get(USERTYPES.UserController).register(req, res, next)
)

// Login
router.post('/login', (req, res, next) =>
  container.get(AUTHTYPES.AuthController).login(req, res, next)
)

// Refresh token
router.post('/refresh', (req, res, next) =>
  container.get(AUTHTYPES.AuthController).refresh(req, res, next)
)

export { router as userRouter }
