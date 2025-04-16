/**
 * @file Defines the shopping list schema.
 * @module shoppingListSchema
 * @author Beatriz Sanssi
 */

import mongoose from 'mongoose'

const shoppingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    customName: String, // If user adds a custom product
    quantity: { type: String, default: '1' }
  }]
}, { timestamps: true })

export const ShoppingListModel = mongoose.model('ShoppingList', shoppingListSchema)