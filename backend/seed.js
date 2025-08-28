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
import { fallbackCountries, normalizeCountry } from './src/utils/countryUtils.js'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json' with { type: 'json' }
import frLocale from 'i18n-iso-countries/langs/fr.json' with { type: 'json' }
import esLocale from 'i18n-iso-countries/langs/es.json' with { type: 'json' }

dotenv.config()
const FILE_PATH = process.env.PATH_TO_DATA_GZ
const maxImport = 20000
const LOG_FIRST_N = 5

countries.registerLocale(enLocale)
countries.registerLocale(frLocale)
countries.registerLocale(esLocale)

/**
 * Parses the origins string and returns an array of ISO country codes.
 *
 * @param {string} originsRaw - The raw origins string.
 * @param {string} originsTagsRaw - The raw origins tags string.
 * @returns {string[]} - An array of ISO country codes.
 */
function parseOrigins(originsRaw, originsTagsRaw) {
  const rawList = []

  if (originsRaw) rawList.push(...originsRaw.split(/[,;]/))
  if (originsTagsRaw) rawList.push(...originsTagsRaw.split(/[,;]/))

  return rawList
    .map(o => o.trim().toLowerCase().replace(/^([a-z]{2,3}):/, ''))
    .map(normalizeCountry)
    .map(o => fallbackCountries[`en:${o}`] || fallbackCountries[o] || countries.getAlpha2Code(o, 'en'))
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
}

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
  const raw = [
    row.allergens,
    row.allergens_tags,
    row.allergens_en,
    row.traces,
    row.traces_tags
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

  // Check if the grade is valid
  const gradeToScore = { a: 90, 'a-plus': 95, b: 70, c: 50, d: 30, e: 10 }

  return {
    product_name: row.product_name,
    brands: row.brands,
    categories: row.categories,
    ingredients: row.ingredients_text?.slice(0, 120),
    nutriscore_grade: row.nutriscore_grade,
    nova_group: row.nova_group ? Number(row.nova_group) : null,
    image_url: row.image_url,
    barcode: row.code,
    nutrition: parseNutrition(row),
    allergens: parseAllergens(row, importedCount),
    eco_score_grade: row.environmental_score_grade,
    eco_score_score: row.environmental_score_score
      ? Number(row.environmental_score_score)
      : gradeToScore[(row.environmental_score_grade || '').toLowerCase()] ?? -1,
    origin_tags: row.origins_tags,
    origins_iso: parseOrigins(row.origins, row.origins_tags),
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
          origin_tags: row.origins_tags,
          ecoScore: row.environmental_score_grade,
          ecoScoreScore: row.environmental_score_score,
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

seed()
