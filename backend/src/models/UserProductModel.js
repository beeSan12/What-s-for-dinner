/**
 * @file Defines the user product schema.
 * @module userProductSchema
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

const userProductSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_name: { type: String, required: true },
  brands: String,
  categories: String,
  image_url: String
}, { timestamps: true })

export const UserProductModel = mongoose.model('UserProduct', userProductSchema)
