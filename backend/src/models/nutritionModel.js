/**
 * @file Defines the nutrition schema.
 * @module nutritionSchema
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

const nutritionSchema = new mongoose.Schema({
  calories: { type: String, required: false },
  protein: { type: String, required: false },
  carbs: { type: String, required: false },
  fat: { type: String, required: false },
  nutriscore_grade: { type: String, required: false }
}, { timestamps: true })

export const NutritionModel = mongoose.model('Nutrition', nutritionSchema)
