/**
 * @file Defines the Embedding controller class.
 * @module EmbeddingController
 * @author Beatriz Sanssi
 */

import { createEmbedding } from '../utils/embedding.js'
import { pineconeIndex } from '../utils/pinecone.js'
import { convertToHttpError } from '../lib/util.js'

/**
 * Encapsulates a controller.
 */
export class EmbeddingController {
  /**
   * Initializes a new instance.
   */
  constructor() {}

  /**
   * Saves an embedding for a product.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async saveEmbedding(req, res, next) {
    try {
      const { productId, text } = req.body
      const embedding = await createEmbedding(text)

      await pineconeIndex().upsert({
        upsertRequest: {
          vectors: [
            {
              id: productId,
              values: embedding,
              metadata: { text },
            },
          ],
        },
      })

      res.json({ message: 'Saved embedding!' })
    } catch (error) {
      next(convertToHttpError(error))
    }
  }

  /**
   * Searches for similar embeddings.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async searchEmbedding(req, res, next) {
    try {
      const { query } = req.body
      const embedding = await createEmbedding(query)

      const result = await pineconeIndex().query({
        queryRequest: {
          vector: embedding,
          topK: 5,
          includeMetadata: true,
        },
      })

      res.json(result.matches)
    } catch (error) {
      next(convertToHttpError(error))
    }
  }
}