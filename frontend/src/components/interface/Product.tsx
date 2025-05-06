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
  barcode: string
  source?: 'custom' | 'global'
}