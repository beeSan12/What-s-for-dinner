/**
 * @file Defines the Embedding controller class.
 * @module EmbeddingController
 * @author Beatriz Sanssi
 */

import { createEmbedding, askGptFallback } from '../utils/embedding.js'
import { convertToHttpError } from '../lib/util.js'
import { EmbeddingService } from '../services/EmbeddingService.js'
import { RecipeService } from '../services/RecipeService.js'

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
   * @type {RecipeService}
   */
  #service
  #recipeService

  /**
   * Initializes a new instance.
   *
   * @param {EmbeddingService} service - A service instantiated from a class with the same capabilities as EmbeddingService.
   * @param {RecipeService} recipeService - A service instantiated from a class with the same capabilities as RecipeService.
   */
  constructor (service, recipeService) {
    this.#service = service
    this.#recipeService = recipeService
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

      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error('Generated embedding is invalid.')
      }

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

  /**
   * Searches for the top 5 most similar embeddings to a given query and generates a recipe if applicable.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async askEmbedding (req, res, next) {
    try {
      const { query } = req.body
      const products = await this.#service.findTopMatches(query)

      if (products.length === 0) {
        const fallback = await askGptFallback(query)
        return res.json({ fallback })
      }

      const isRecipePrompt = query.toLowerCase().includes('recipe') || query.toLowerCase().includes('cook') || query.toLowerCase().includes('make')
      let generatedRecipe = null

      if (isRecipePrompt) {
        const topIds = products.slice(0, 3).map(p => p.id)
        const productEmbeddings = await this.#service.findEmbeddingsByProductIds(topIds, query)

        const context = productEmbeddings.map(d => `• ${d.metadata.product_name}: ${d.text}`).join('\n')

        const { recipe } = await this.#recipeService.generateRecipeFromService({ context, prompt: query })
        generatedRecipe = recipe
      }

      res.json({
        products,
        recipe: generatedRecipe
      })
    } catch (error) {
      next(error)
    }
  }
}
