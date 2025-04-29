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
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
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

    const result = await this.get({ perPage: 1000 }) // Hämta många embeddings
    const allDocs = result.data

    const scored = allDocs.map(doc => ({
      id: doc.productId,
      text: doc.text,
      score: cosineSimilarity(queryEmbedding, doc.embedding)
    }))

    return scored.sort((a, b) => b.score - a.score).slice(0, 5)
  }
}
