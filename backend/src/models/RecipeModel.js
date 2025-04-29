/**
 * @file Defines the recipe schema.
 * @module recipeSchema
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  usedProducts: [{ type: String, required: false }],
  prompt: { type: String, required: false }
}, { timestamps: true })

export const RecipeModel = mongoose.model('Recipe', recipeSchema)
