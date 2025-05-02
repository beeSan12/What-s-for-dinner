/**
 * This script creates embeddings for all products in the database.
 * It connects to the MongoDB database, retrieves all products, and generates embeddings using the OpenAI API.
 *
 * @module seedEmbeddings
 * @author Beatriz Sanssi
 */

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { ProductModel } from './src/models/ProductModel.js'
import { EmbeddingModel } from './src/models/EmbeddingModel.js'
import { createEmbedding } from './src/utils/embedding.js'

dotenv.config()

await mongoose.connect(process.env.DB_CONNECTION_STRING)
console.log('Connected to MongoDB')

// Clear existing embeddings first
await EmbeddingModel.deleteMany({})
console.log('Old embeddings removed')

const BATCH_SIZE = 1000
const products = await ProductModel.find({})

console.log(`Found ${products.length} products. Start creating embeddings...`)

for (let i = 0; i < products.length; i += BATCH_SIZE) {
  const batch = products.slice(i, i + BATCH_SIZE)
  const texts = batch.map(p => p.ingredients_text || p.product_name)

  let embeddings
  while (true) {
    try {
      embeddings = await createEmbedding(texts)
      break
    } catch (err) {
      if (err.message.includes('Rate limit') || err.message.includes('Connection error')) {
        console.warn('Rate limit hit – retrying in 1 second...')
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        throw err
      }
    }
  }

  for (let j = 0; j < batch.length; j++) {
    const product = batch[j]
    await EmbeddingModel.create({
      productId: product._id.toString(),
      text: texts[j],
      embedding: embeddings[j]
    })
  }

  console.log(`✅ Batch ${i / BATCH_SIZE + 1} done.`)
}

console.log('🎉 All embeddings created!')
await mongoose.disconnect()
