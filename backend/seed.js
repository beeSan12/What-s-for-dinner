/**
 * @description This script connects to a MongoDB database, clears existing product data, and imports new product data from a CSV file.
 * @module seed
 * @author Beatriz Sanssi
 */

import fs from 'fs'
import zlib from 'zlib'
import csv from 'csv-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { ProductModel } from './src/models/ProductModel.js'

dotenv.config()

const foodFactsData = process.env.PATH_TO_DATA_GZ
const maxImport = 20000

// Connect to MongoDB
await mongoose.connect(process.env.DB_CONNECTION_STRING)
console.log('Connected to MongoDB')

// Clear existing products if any
await ProductModel.deleteMany({})
console.log('Old products removed')

// Import new products
let count = 0

fs.createReadStream(foodFactsData)
  .pipe(zlib.createGunzip())
  .pipe(csv({ separator: '\t' }))
  .on('data', async (row) => {
    if (count >= maxImport) {
      console.log(`Max limit (${maxImport}) reached. Stopping import.`)
      mongoose.disconnect()
      process.exit()
    }

    try {
      if (row.product_name && row.brands && row.image_url) {
        await ProductModel.create({
          product_name: row.product_name,
          brands: row.brands,
          categories: row.categories,
          ingredients_text: row.ingredients_text,
          nutriscore_grade: row.nutriscore_grade,
          nova_group: row.nova_group ? parseInt(row.nova_group) : null,
          image_url: row.image_url,
          barcode: row.code,
          nutrition: {
            calories: row['energy-kcal_100g'],
            protein: row.proteins_100g,
            carbs: row.carbohydrates_100g,
            fat: row.fat_100g
          }
        })
        count++
        if (count % 100 === 0) console.log(`${count} products imported...`)
      }
    } catch (err) {
      console.error('Error inserting product:', err.message)
    }
  })
  .on('end', () => {
    console.log(`Done! Imported ${count} products.`)
    mongoose.disconnect()
  })
