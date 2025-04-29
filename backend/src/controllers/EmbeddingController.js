/**
 * @file Defines the Embedding controller class.
 * @module EmbeddingController
 * @author Beatriz Sanssi
 */

import { createEmbedding } from '../utils/embedding.js'
import { convertToHttpError } from '../lib/util.js'
import { EmbeddingService } from '../services/EmbeddingService.js'

/**
 * Calculates the cosine similarity between two vectors.
 *
 * @param {Array<number>} a - The first vector.
 * @param {Array<number>} b - The second vector.
 * @returns {number} - The cosine similarity between the two vectors.
 */

/**
 * Encapsulates a controller for handling embeddings.
 */
export class EmbeddingController {
  /**
   * The service.
   *
   * @type {EmbeddingService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {EmbeddingService} service - A service instantiated from a class with the same capabilities as EmbeddingService.
   */
  constructor (service) {
    this.#service = service
  }

  /**
   * Saves an embedding for a given product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async saveEmbedding (req, res, next) {
    try {
      const { productId, text } = req.body
      const embedding = await createEmbedding(text)

      await this.#service.insert({ productId, text, embedding })
      res.json({ message: 'Embedding saved successfully' })
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
  async searchEmbedding (req, res, next) {
    try {
      const { query } = req.body
      const topMatches = await this.#service.findTopMatches(query)
      res.json(topMatches)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }
}
