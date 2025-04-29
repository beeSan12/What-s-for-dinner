/**
 * @file Defines the Embedding controller class.
 * @module EmbeddingController
 * @author Beatriz Sanssi
 */

import { createEmbedding } from '../utils/embedding.js'
import { convertToHttpError } from '../lib/util.js'
import { EmbeddingModel } from '../models/EmbeddingModel.js'

/**
 * Calculates the cosine similarity between two vectors.
 *
 * @param {Array<number>} a - The first vector.
 * @param {Array<number>} b - The second vector.
 * @returns {number} - The cosine similarity between the two vectors.
 */
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dot / (normA * normB)
}

/**
 * Encapsulates a controller for handling embeddings.
 */
export class EmbeddingController {
  /**
   * Saves an embedding for a given product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async saveEmbedding(req, res, next) {
    try {
      const { productId, text } = req.body
      const embedding = await createEmbedding(text)

      await EmbeddingModel.create({ productId, text, embedding })
      res.json({ message: "Embedding saved successfully" })
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Searches for the top 5 most similar embeddings to a given query.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async searchEmbedding(req, res, next) {
    try {
      const { query } = req.body;
      const queryEmbedding = await createEmbedding(query)

      const allDocs = await EmbeddingModel.find()
      const scored = allDocs.map(doc => ({
        id: doc.productId,
        text: doc.text,
        score: cosineSimilarity(queryEmbedding, doc.embedding)
      }))

      // Return the top 5 most similar embeddings
      const top5 = scored.sort((a, b) => b.score - a.score).slice(0, 5)
      res.json(top5)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }
}