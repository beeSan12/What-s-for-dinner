/**
 * @file This file contains the EmbeddingService class
 * @module EmbeddingService
 * @author Beatriz Sanssi
 */

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { createEmbedding } from '../utils/embedding.js'

/**
 * Calculates the cosine similarity between two vectors.
 *
 * @param {Array<number>} a - The first vector.
 * @param {Array<number>} b - The second vector.
 * @returns {number} - The cosine similarity between the two vectors.
 */
function cosineSimilarity (a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    console.error('cosineSimilarity: One or both inputs are not arrays', a, b)
    return null
  }
  if (a.length === 0 || b.length === 0) {
    console.error('cosineSimilarity: One or both arrays are empty', a, b)
    return null
  }
  if (a.length !== b.length) {
    console.error('cosineSimilarity: Arrays have different lengths', a.length, b.length)
    return null
  }

  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))

  if (normA === 0 || normB === 0) {
    console.error('cosineSimilarity: Zero norm detected', normA, normB)
    return null
  }

  return dot / (normA * normB)
}

/**
 * Encapsulates a task service.
 */
export class EmbeddingService extends MongooseServiceBase {
  /**
   * Searches for top matching embeddings given a query string.
   *
   * @param {string} query - The query text.
   * @returns {Promise<Array>} The top 5 matching documents with score.
   */
  async findTopMatches (query) {
    const queryEmbedding = await createEmbedding(query)

    const result = await this.get({ perPage: 1000 })
    const allDocs = result.data
    const scored = allDocs.map(doc => {
      console.log('→ doc.embedding =', doc.embedding)
      return {
        id: doc.productId,
        text: doc.text,
        score: cosineSimilarity(queryEmbedding, doc.embedding),
        metadata: doc.metadata || {}
      }
    })

    return scored.sort((a, b) => b.score - a.score).slice(0, 5)
  }

  /**
   * Finds embeddings by a list of productIds and computes their score based on a query.
   *
   * @param {Array<string>} productIds - List of product IDs.
   * @param {string} query - User's additional prompt (optional).
   * @returns {Promise<Array>} - List of matched embeddings with a similarity score.
   */
  async findEmbeddingsByProductIds (productIds, query) {
    const queryEmbedding = await createEmbedding(query || '')

    const result = await this.search({
      filter: { productId: { $in: productIds } },
      perPage: 1000
    })
    const allDocs = result.data

    const scored = allDocs.map(doc => ({
      id: doc.productId,
      text: doc.text,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
      metadata: doc.metadata || {}
    }))

    return scored
  }
}
