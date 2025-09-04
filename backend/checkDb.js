/**
 * @file This script checks if there is any data in the database.
 * If there is no data, it exits with code 1 to indicate that the seeding script should be run.
 * If there is data, it exits with code 0.
 * If there is an error connecting to the database, it exits with code 2.
 * @module checkDb
 * @author Beatriz Sanssi
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { ProductModel } from './src/models/ProductModel.js'

dotenv.config()

// Connect to MongoDB.
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    const count = await ProductModel.countDocuments()
    console.log(`✅ Found ${count} products in database.`)

    if (count > 0) {
      process.exit(0) // If data exists – exit
    } else {
      process.exit(1) // No data – run seed
    }
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err)
    process.exit(2) // Error – exit with code 2
  })
