/**
 * @file API version 1 router.
 * @module router
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

// User-land modules.
import express from 'express'

// Application modules.
import { router as productRouter } from './productRouter.js'
import { router as nutritionRouter } from './nutritionRouter.js'
import { router as userRouter } from './userRouter.js'
import { router as shoppingListRouter } from './shoppingListRouter.js'
import { router as userProductRouter } from './userProductRouter.js'
import { router as embeddingRouter } from './embeddingRouter.js'
import { router as recipeRouter } from './recipeRouter.js'
import { router as statisticsRouter } from './statisticsRouter.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/products', productRouter)
router.use('/food', nutritionRouter)
router.use('/statistics', statisticsRouter)
router.use('/user', userRouter)
router.use('/shoppinglist', shoppingListRouter)
router.use('/userproducts', userProductRouter)
router.use('/embeddings', embeddingRouter)
router.use('/recipes', recipeRouter)
