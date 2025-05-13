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
  ingredients: { type: String },
  nutriscore_grade: { type: String, required: false },
  nova_group: { type: Number, required: false },
  image_url: { type: String, required: false },
  barcode: { type: String, required: false, unique: true },
  nutrition: { type: Map, of: Number },
  allergens: { type: Map, of: Boolean },
  // nutrition: {
  //   calories: { type: String },
  //   protein: { type: String },
  //   carbs: { type: String },
  //   fat: { type: String },
  //   fiber: { type: String },
  //   sugars: { type: String },
  //   salt: { type: String },
  //   sodium: { type: String },
  //   saturated_fat: { type: String },
  //   cholesterol: { type: String }
  // },
  // allergens: {
  //   gluten: { type: Boolean },
  //   lactose: { type: Boolean },
  //   nuts: { type: Boolean },
  //   peanuts: { type: Boolean },
  //   soy: { type: Boolean },
  //   eggs: { type: Boolean },
  //   fish: { type: Boolean },
  //   shellfish: { type: Boolean }
  // },
  // eco_score: {
  //   // score: { type: Number, default: -1 },
  //   score: { type: Number },
  //   // grade: { type: String, default: 'unknown' }
  //   grade: { type: String }
  // },
  eco_score_grade: { type: String },
  eco_score_score: { type: Number },
  origins: { type: String },
  manufacturing_places: { type: String },
  packaging: { type: String },
  labels: { type: String },
  product_quantity: { type: String },
  co2_footprint: { type: String }
}, { timestamps: true })

/**
 * Maps a value to an object.
 *
 * @param {any} value - The value to map.
 * @returns {object} The mapped object.
 */
function mapToObj (value) {
  // If the value is a Map, convert it to an object
  if (value instanceof Map) return Object.fromEntries(value)
  // null/undefined? -> return empty object
  if (value == null) return {}
  // Else if the value is an object, return it as is
  return value
}

productSchema.set('toJSON', {
  versionKey: false, // remove __v
  virtuals: false, // include virtuals
  /**
   * Transforms the document to JSON format.
   *
   * @param {object} doc - The document to convert.
   * @param {object} ret - The object to transform.
   * @returns {object} The transformed object.
   */
  transform (doc, ret) {
    ret.allergens = mapToObj(ret.allergens)
    const nutrMap = mapToObj(ret.nutrition)
    // eco_score is not always present, so add a default value

    ret.nutrition = {
      calories: nutrMap['energy-kcal_100g'] ?? nutrMap.calories ?? null,
      protein: nutrMap.proteins_100g ?? nutrMap.protein ?? null,
      fat: nutrMap.fat_100g ?? nutrMap.fat ?? null,
      carbs: nutrMap.carbohydrates_100g ?? nutrMap.carbs ?? null,
      fiber: nutrMap.fiber_100g ?? nutrMap.fiber ?? null,
      sugar: nutrMap.sugars_100g ?? nutrMap.sugar ?? null,
      salt: nutrMap.salt_100g ?? nutrMap.salt ?? null,
      saturated_fat: nutrMap['saturated-fat_100g'] ?? nutrMap.saturated_fat ?? null,
      cholesterol: nutrMap.cholesterol_100g ?? nutrMap.cholesterol ?? null,
      sodium: nutrMap.sodium_100g ?? nutrMap.sodium ?? null
    }
    // ret.eco_score = ret.eco_score || { grade: 'unknown', score: -1 }
    ret.eco_score = {
      grade: ret.eco_score_grade ?? 'unknown',
      score: ret.eco_score_score ?? -1
    }

    delete ret.eco_score_grade // Remove the old eco_score fields
    delete ret.eco_score_score // Remove the old eco_score fields
    return ret // Return the transformed object
  }
})

export const ProductModel = mongoose.model('Product', productSchema)
