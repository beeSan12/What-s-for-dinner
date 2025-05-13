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
const FILE_PATH = process.env.PATH_TO_DATA_GZ
const maxImport = 20000
const LOG_FIRST_N = 5
/**
 * This function creates a regular expression to match allergen words by using boundary and allowing for up to 20 additional characters after the word.
 *
 * @param {*} w - The allergen word to create a regex for.
 * @returns {string} - The regex pattern for the allergen word.
 */
const w = w => `\\b${w}[a-zA-ZÀ-ÿ]{0,20}`

const ALLERGEN_KEYS = [
  'gluten', 'milk', 'nuts', 'peanuts',
  'soybeans', 'eggs', 'fish', 'crustaceans',
  'lactose', 'apple', 'celery', 'mustard', 'sesame',
  'sulphites', 'sulfur_dioxide'
]

const ALLERGEN_WORDS = {
  gluten: new RegExp(`${w('gluten')}|${w('wheat')}|${w('weizen')}|${w('ble')}|${w('trigo')}|${w('vete')}|${w('durum')}|${w('spelt')}|${w('rye')}|${w('roggen')}|${w('seigle')}|${w('barley')}|${w('gerste')}`, 'i'),
  milk: new RegExp(`${w('milk')}|${w('lait')}|${w('milch')}|${w('leche')}|${w('mjölk')}|${w('lactose')}|${w('laktos')}|${w('casein')}|${w('whey')}`, 'i'),
  lactose: new RegExp(`${w('lactose')}|${w('laktos')}|${w('milk')}|${w('lait')}|${w('milch')}|${w('leche')}`, 'i'),
  apple: new RegExp(`${w('apple')}|${w('äpple')}|${w('manzana')}|${w('apfel')}|${w('pomme')}`, 'i'),
  crustaceans: new RegExp(`${w('crustacean')}|${w('shellfish')}|${w('shellfish')}|${w('skaldjur')}|${w('crustacé')}|${w('marisco')}|${w('krabba')}|${w('krabben')}`, 'i'),
  shellfish: new RegExp(`${w('shellfish')}|${w('skaldjur')}|${w('crustacé')}|${w('marisco')}|${w('krabba')}|${w('krabben')}`, 'i'),
  nuts: new RegExp(`${w('nut')}|${w('nuts')}|${w('noix')}|${w('nuss')}|${w('nüsse')}|${w('noci')}|${w('nuez')}|${w('mandel')}|${w('almond')}|${w('hazelnut')}|${w('walnut')}|${w('cashew')}|${w('pistachio')}|${w('macadamia')}|${w('pecan')}`, 'i'),
  peanuts: new RegExp(`${w('peanut')}|${w('peanuts')}|${w('cacahuète')}|${w('erdnuss')}|${w('erdnüsse')}|${w('cacahuetes')}|${w('jordnöt[ter]*')}`, 'i'),
  soybeans: new RegExp(`${w('soy')}|${w('soja')}|${w('soya')}|${w('soybean[s]*')}|${w('sojaböna[r]*')}`, 'i'),
  eggs: new RegExp(`${w('egg')}|${w('eggs')}|${w('œuf[s]?')}|${w('eier')}|${w('huevo[s]?')}|${w('ägg')}`, 'i'),
  fish: new RegExp(`${w('fish')}|${w('fisk')}|${w('poisson')}|${w('fisch')}|${w('pesce')}|${w('pez')}|${w('cod')}|${w('torsk')}|${w('salmon')}|${w('lax')}|${w('tuna')}|${w('tonfisk')}|${w('trout')}|${w('forel')}|${w('haddock')}|${w('anchovy')}|${w('anchovis')}`, 'i'),
  soy: new RegExp(`${w('soy')}|${w('soja')}|${w('soya')}|${w('soybean[s]*')}|${w('sojaböna[r]*')}`, 'i'),
  sesame: new RegExp(`${w('sesame')}|${w('sesam')}|${w('sesameseed[s]*')}|${w('sesamfrö[n]*')}`, 'i'),
  celery: new RegExp(`${w('celery')}|${w('céleri')}|${w('selleri')}|${w('sedano')}|${w('apio')}`, 'i'),
  mustard: new RegExp(`${w('mustard')}|${w('senap')}|${w('mostaza')}|${w('moutarde')}|${w('senape')}`, 'i'),
  sulphites: new RegExp(`${w('sulphite[s]?')}|${w('sulfite[s]?')}|${w('sulfit')}|${w('sulfitt')}|${w('sulfur_dioxide')}|${w('svaveldioxid')}`, 'i')
}
// nuts: /\b(nut|nuts|noix|nuss|nüsse|noci|nuez|mandel|almond|hazelnut|walnut|cashew|pistachio|macadamia|pecan)\b/i,
// peanuts: /\b(peanut|peanuts|cacahuète|erdnuss|erdnüsse|cacahuetes|jordnöt[ter]*)\b/i,
// soybeans: /\b(soy|soja|soya|soybean[s]*|sojaböna[r]*)\b/i,
// eggs: /\b(egg|eggs|œuf[s]?|eier|huevo[s]?|ägg)\b/i,
// fish: /\b(fish|fisk|poisson|fisch|pesce|pez|cod|torsk|salmon|lax|tuna|tonfisk|trout|forel|haddock|anchovy|anchovis)\b/i,
// crustaceans: /\b(shrimp|shrimps|räka|räkor|gambero|crevette|crevettes|prawn[s]?|crab|krabba|crabe|lobster|hummer|langosta|crayfish|kräfta|écrevisse)\b/i,
// sesame: /\b(sesame|sesam|sesameseed[s]*|sesamfrö[n]*)\b/i,
// celery: /\b(celery|céleri|selleri|sedano|apio)\b/i,
// mustard: /\b(mustard|senap|mostaza|moutarde|senape)\b/i,
// sulphites: /\b(sulphite[s]?|sulfite[s]?|sulfit|sulfitt|sulfur_dioxide|svaveldioxid)\b/i
// }

// /**
//  * Parses a CSV file and returns an array of objects.
//  *
//  * @param {string} filePath - The path to the CSV file.
//  * @param {Function} transformRow - A function that transforms a CSV row to a Mongoose object.
//  * @returns {Promise<object[]>} - An array of objects.
//  */
// function parseCSV (filePath, transformRow) {
//   return new Promise((resolve, reject) => {
//     const results = []
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (row) => {
//         // Call the transformRow function to convert the row to a Mongoose object
//         const doc = transformRow(row)
//         if (doc) {
//           // Push the transformed object to the results array
//           results.push(doc)
//         }
//       })
//       // When the CSV file has been read completely (end event)
//       .on('end', () => {
//         console.log(`Finished reading CSV: ${filePath}. Found ${results.length} rows.`)
//         resolve(results)
//       })
//       .on('error', (err) => {
//         reject(err)
//       })
//   })
// }

/**
 * Scans the ingredients text for allergen words and updates the result object.
 *
 * @param {*} row - The CSV row to scan.
 * @param {*} result - The result object to update.
 * @param {string} result.key - The key to update in the result object.
 * @param {RegExp} result.rx - The regular expression to test against the ingredients text.
 * @returns {void}
 */
function scanIngredients (row, result) {
  if (!row.ingredients_text) return
  for (const [key, rx] of Object.entries(ALLERGEN_WORDS)) {
    if (rx.test(row.ingredients_text) && result[key] === undefined) {
      result[key] = true // only set to true if not already set
    }
  }
}

/**
 * Parses a CSV row and extracts nutrition information.
 *
 * @param {*} row - The CSV row to parse.
 * @returns {object} - An object containing the parsed nutrition information.
 */
function parseNutrition (row) {
  const n = {}
  for (const key of Object.keys(row)) {
    if (key.endsWith('_100g') && row[key]) {
      const v = Number(row[key])
      if (!Number.isNaN(v)) n[key] = v
    }
  }
  return n
}

/**
 * Parses a CSV row and extracts allergen information.
 *
 * @param {*} row - The CSV row to parse.
 * @param {number} importedCount - The number of products imported so far.
 * @returns {object} - An object containing the parsed allergen information.
 */
function parseAllergens (row, importedCount) {
  const result = {}

  // 1) get string of allergen tags
  // const raw = row.allergens || row.allergens_tags
  const raw = [
    row.allergens, // ex: "en:milk,en:nuts"
    row.allergens_tags, // identisk info – olika exporter använder olika namn
    row.allergens_en, // ex: "milk,nuts"
    row.traces, // ex: "soy,celery"
    row.traces_tags // ex: "en:soybeans,en:celery"
  ].filter(Boolean).join(',')

  if (!raw) return result

  // for debugging
  if (importedCount < LOG_FIRST_N) {
    console.log('─'.repeat(70))
    console.log(`BARCODE: ${row.code}`)
    console.log(`NAME   : ${row.product_name}`)
    console.log('RAW TAGS:', raw)
    console.log(`INGREDIENTS:, ${row.ingredients_text}`)
  }

  // 2) make clean tags
  raw.split(',').forEach(tag => {
    const clean = tag
      // remove language prefix (e.g., "en:")
      .replace(/^[a-z]{2,3}:/, '')
      // replace spaces and dashes with underscores
      .replace(/[\s-]+/g, '_')
      .toLowerCase()
      .trim()
    if (clean.startsWith('no_') && importedCount < LOG_FIRST_N) {
      console.log('NEG TAG:', clean)
    }
    // if (ALLERGEN_KEYS.includes(clean)) result[clean] = true
    if (clean.startsWith('no_')) {
      const key = clean.slice(3) // ex: "no_gluten" → "gluten"
      if (ALLERGEN_KEYS.includes(key)) result[key] = false
    } else if (ALLERGEN_KEYS.includes(clean)) {
      result[clean] = true
    }
  })

  if (importedCount < LOG_FIRST_N) {
    console.log('PARSED :', Object.keys(result))
  }
  scanIngredients(row, result)
  return result // { gluten:true, milk:true, ... }
}

/**
 * Converts a CSV row to a Mongoose object.
 *
 * @param {*} row - The CSV row to convert.
 * @param {number} importedCount - The number of products imported so far.
 * @returns {object|null} - The converted Mongoose object or null if the row is invalid.
 */
function rowToProduct (row, importedCount) {
  // Check if the row contains the required fields
  if (!(row.product_name && row.brands && row.image_url)) return null

  return {
    product_name: row.product_name,
    brands: row.brands,
    categories: row.categories,
    // ingredients_text: row.ingredients_text?.trim() || null,
    ingredients: row.ingredients_text?.slice(0, 120),
    nutriscore_grade: row.nutriscore_grade,
    nova_group: row.nova_group ? Number(row.nova_group) : null,
    image_url: row.image_url,
    barcode: row.code,
    nutrition: parseNutrition(row),
    allergens: parseAllergens(row, importedCount),
    eco_score_grade: row.environmental_score_grade,
    origins: row.origins,
    manufacturing_places: row.manufacturing_places,
    packaging: row.packaging,
    labels: row.labels
  }
}

/**
 * Connects to a MongoDB database, drops the existing database, and executes a callback function.
 *
 * @param {*} uri - The MongoDB connection URI.
 * @param {*} fn - The callback function to execute after connecting to the database.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function withDatabase (uri, fn) {
  await mongoose.connect(uri)
  console.log('✔  MongoDB connected')
  await mongoose.connection.db.dropDatabase()
  console.log('✔  Database dropped')
  try {
    await fn()
  } finally {
    await mongoose.connection.close()
    console.log('✔  MongoDB connection closed')
  }
}

/**
 * Imports product data from a CSV file into a MongoDB database.
 */
export async function seed () {
  const headerKeys = []
  const exampleRows = []
  let importedCount = 0

  await withDatabase(process.env.DB_CONNECTION_STRING, async () => {
    const stream = fs.createReadStream(FILE_PATH)
      .pipe(zlib.createGunzip())
      .pipe(csv({ separator: '\t' }))

    for await (const row of stream) {
      // Save header keys
      if (!headerKeys.length) headerKeys.push(...Object.keys(row))

      // Save example rows for display
      if (exampleRows.length < 10) {
        exampleRows.push({
          // barcode: row.code,
          categories: row.categories,
          name: row.product_name,
          ecoScore: row.environmental_score_grade,
          allergens: parseAllergens(row, importedCount),
          ingredients: row.ingredients_text?.slice(0, 120),
          nutriments: parseNutrition(row, importedCount)
        })
      }

      // Stop if max import limit is reached
      if (importedCount >= maxImport) break

      const doc = rowToProduct(row, importedCount)
      if (!doc) continue

      try {
        await ProductModel.create(doc)
        importedCount++
        if (importedCount % 1_000 === 0) { console.log(`… ${importedCount} imported products`) }
      } catch (e) {
        console.warn('⨯  Skipped row – DB-error:', e.message)
      }
    }
  })

  // ---------- Conclusion ----------
  console.log('\n============== Conclusion ==============')
  console.log(`Total imported rows: ${importedCount}`)
  console.log('\nColumn headers:')
  console.log(headerKeys.join(', '))
  console.log('\nExample rows (first three):')
  console.table(exampleRows)
}
// const foodFactsData = process.env.PATH_TO_DATA_GZ
// const maxImport = 20000

// // Connect to MongoDB
// await mongoose.connect(process.env.DB_CONNECTION_STRING)
// console.log('Connected to MongoDB')

// // Clear existing products if any
// await ProductModel.deleteMany({})
// console.log('Old products removed')

// // Import new products
// let count = 0
// let headerKeys = null
// const firstExamples = []

// fs.createReadStream(foodFactsData)
//   .pipe(zlib.createGunzip())
//   .pipe(csv({ separator: '\t' }))
//   .on('data', async (row) => {
//     if (!headerKeys) {
//       headerKeys = Object.keys(row)
//     }
//     if (firstExamples.length < 3) { // t.ex. tre exempel
//       firstExamples.push({
//         code: row.code,
//         name: row.product_name,
//         allergensRaw: row.allergens || row.allergens_tags || ''
//       })
//     }

//     // if (count >= maxImport) {
//     //   console.log(row[0])
//     //   console.log(`Max limit (${maxImport}) reached. Stopping import.`)
//     //   mongoose.disconnect()
//     //   process.exit()
//     // }

//     try {
//       if (row.product_name && row.brands && row.image_url) {
//         const nutrition = {}
//         for (const key in row) {
//           if (key.endsWith('_100g') && row[key]) {
//             const value = parseFloat(row[key])
//             if (!isNaN(value)) {
//               nutrition[key] = value
//             }
//           }
//         }

//         // Dynamic allergens
//         const allergens = {}
//         if (row.allergens_tags) {
//           if (count < 5) { // <–– ändra 5 till hur många exempel du vill se
//             console.log('─'.repeat(60))
//             console.log(`BARCODE: ${row.code}`)
//             console.log(`NAME   : ${row.product_name}`)
//             console.log('RAW TAGS:', row.allergens_tags)

//             const parsed = row.allergens_tags
//               .split(',')
//               .map(t => t.replace(/^en:/, '').trim())
//               .filter(Boolean)

//             console.log('PARSED :', parsed)
//           }
//           // const tags = row.allergens_tags.split(',')
//           // for (const tag of tags) {
//           //   const clean = tag.replace(/^en:/, '').trim()
//           //   if (clean) allergens[clean] = true
//           // }
//         }

//         // const allergensTags = row.allergens_tags?.split(',') || []

//         await ProductModel.create({
//           product_name: row.product_name,
//           brands: row.brands,
//           categories: row.categories,
//           ingredients_text: row.ingredients_text?.trim() || null,
//           nutriscore_grade: row.nutriscore_grade,
//           nova_group: row.nova_group ? parseInt(row.nova_group) : null,
//           image_url: row.image_url,
//           barcode: row.code,
//           nutrition,
//           allergens,
//           // nutrition: {
//           //   calories: row['energy-kcal_100g'],
//           //   protein: row.proteins_100g,
//           //   carbs: row.carbohydrates_100g,
//           //   fat: row.fat_100g,
//           //   fiber: row.fiber_100g,
//           //   sugars: row.sugars_100g,
//           //   salt: row.salt_100g,
//           //   sodium: row.sodium_100g,
//           //   saturated_fat: row['saturated-fat_100g'],
//           //   cholesterol: row.cholesterol_100g
//           // },
//           // allergens: {
//           //   gluten: allergensTags.includes('en:gluten'),
//           //   lactose: allergensTags.includes('en:milk'),
//           //   nuts: allergensTags.includes('en:nuts'),
//           //   peanuts: allergensTags.includes('en:peanuts'),
//           //   soy: allergensTags.includes('en:soybeans'),
//           //   eggs: allergensTags.includes('en:eggs'),
//           //   fish: allergensTags.includes('en:fish'),
//           //   shellfish: allergensTags.includes('en:crustaceans')
//           // },
//           eco_score: row.environmental_score_grade,
//           // eco_score: {
//           //   score: row.environmental_score_score ? parseFloat(row.environmental_score_score) : -1,
//           //   grade: row.environmental_score_grade || 'unknown'
//           // },
//           // eco_score: {
//           //   score: row.eco_score_score ? parseFloat(row.eco_score_score) : -1,
//           //   grade: row.eco_score_grade || 'unknown'
//           // },
//           origins: row.origins,
//           manufacturing_places: row.manufacturing_places,
//           packaging: row.packaging,
//           labels: row.labels
//         })
//         console.log(row.allergens_tags)
//         count++
//         if (count % 100 === 0) console.log(`${count} products imported...`)
//       }
//     } catch (err) {
//       console.error('Error inserting product:', err.message)
//     }
//   })
//   .on('end', () => {
//     if (count >= maxImport) {
//       console.log(row[0])
//       console.log(`Max limit (${maxImport}) reached. Stopping import.`)
//       mongoose.disconnect()
//       process.exit()
//     }
//     console.log(`Totalt importerade: ${count}`)
//     console.log('\nTillgängliga kolumner:')
//     console.log(headerKeys)

//     console.log('\nExempelrader:')
//     console.table(firstExamples)

//     console.log(`Done! Imported ${count} products.`)
//     mongoose.disconnect()
//   })
// Execute the seed function
seed()
