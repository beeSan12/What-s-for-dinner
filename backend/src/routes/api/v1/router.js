/**
 * @file API version 1 router.
 * @module router
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

// User-land modules.
import express from 'express'

// Application modules.
import { authenticate } from '../../../middlewares/authenticate.js'
import { router as productRouter } from './productRouter.js'
import { router as userRouter } from './userRouter.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/products', authenticate, productRouter)
router.use('/user', userRouter)