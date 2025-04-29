/**
 * @file Defines the embedding schema.
 * @module embeddingSchema
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  productId: String,
  text: String,
  embedding: [Number]
})

export const EmbeddingModel = mongoose.model('Embedding', schema)