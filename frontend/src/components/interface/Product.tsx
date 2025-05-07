/**
 * This file defines the Product interface used in the application.
 *
 * @file Product.tsx
 * @author Beatriz Sanssi
 */

export interface Product {
  _id: string
  product_name: string
  brands?: string
  categories?: string
  image_url?: string
  ingredients_text?: string
  allergens?: Record<string, boolean>
  // allergens?: {
  //   gluten?: boolean
  //   lactose?: boolean
  //   nuts?: boolean
  //   peanuts?: boolean
  //   soy?: boolean
  //   eggs?: boolean
  //   fish?: boolean
  //   shellfish?: boolean
  // }
  barcode: string
  source?: 'custom' | 'global'
  eco_score?: {
    score: number
    grade: string
  }
  origins?: string
  manufacturing_places?: string
  packaging?: string
  labels?: string
}
