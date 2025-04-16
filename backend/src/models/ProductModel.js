/**
 * @file Defines the product schema.
 * @module productSchema
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  product_name: String,
  brands: String,
  categories: String,
  ingredients_text: String,
  nutriscore_grade: String,
  nova_group: Number,
  image_url: String
}, { timestamps: true })

export const ProductModel = mongoose.model('Product', productSchema)