/**
 * @file API version 1 router.
 * @module router
 * @author Mats Loock & Beatriz Sanssi <bs222eh@student.lnu.se>
 */

// User-land modules.
import express from 'express'

// Application modules.
import { router as authRouter } from './authRouter.js'
import { router as userRouter } from './userRouter.js'
import { authenticateUser } from '../../../middleware/authenticateUser.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/auth', authRouter)
router.use('/user', authenticateUser, userRouter)
