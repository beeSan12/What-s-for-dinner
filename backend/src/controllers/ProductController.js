/**
 * This files is used to load the Open Food Facts CSV file and
 * provide a function to search for products.
 *
 * @module ProductController
 * @author Beatriz Sanssi
 */

import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'

const filePath = path.join(__dirname, '../data/en.openfoodfacts.org.products.csv')

let allProducts = [];

fs.createReadStream(filePath)
  .pipe(csv({ separator: '\t' }))
  .on('data', (data) => {
    allProducts.push(data)
  })
  .on('end', () => {
    console.log('CSV loaded:', allProducts.length, 'rows')
  })

exports.getProducts = (req, res) => {
  const { search } = req.query;
  const results = allProducts.filter((p) =>
    p.product_name && p.product_name.toLowerCase().includes(search.toLowerCase())
  )
  res.json(results.slice(0, 20)) // Limit to 20 results
}