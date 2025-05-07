/**
 * @file Defines the product schema.
 * @module productSchema
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  brands: { type: String, required: false },
  categories: { type: String, required: false },
  ingredients_text: { type: String, required: false },
  nutriscore_grade: { type: String, required: false },
  nova_group: { type: Number, required: false },
  image_url: { type: String, required: false },
  barcode: { type: String, required: false, unique: true },
  nutrition: {
    calories: { type: String },
    protein: { type: String },
    carbs: { type: String },
    fat: { type: String },
    fiber: { type: String },
    sugars: { type: String },
    salt: { type: String },
    sodium: { type: String },
    saturated_fat: { type: String },
    cholesterol: { type: String }
  },
  allergens: {
    gluten: { type: Boolean },
    lactose: { type: Boolean },
    nuts: { type: Boolean },
    peanuts: { type: Boolean },
    soy: { type: Boolean },
    eggs: { type: Boolean },
    fish: { type: Boolean },
    shellfish: { type: Boolean }
  },
  eco_score: {
    score: { type: Number, default: -1 },
    grade: { type: String, default: 'unknown' }
  },
  origins: { type: String },
  manufacturing_places: { type: String },
  packaging: { type: String },
  labels: { type: String }
}, { timestamps: true })

export const ProductModel = mongoose.model('Product', productSchema)
