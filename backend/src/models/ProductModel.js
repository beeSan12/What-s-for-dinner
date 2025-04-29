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
  image_url: { type: String, required: false }
}, { timestamps: true })

export const ProductModel = mongoose.model('Product', productSchema)
