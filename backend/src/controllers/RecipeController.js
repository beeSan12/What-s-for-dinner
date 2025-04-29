/**
 * This module exports the RecipeController class, which handles generating recipes
 * based on product IDs and a prompt using the OpenAI API.
 *
 * @module RecipeController
 * @author Beatriz Sanssi
 */

import OpenAI from 'openai'
import { RecipeService } from '../services/RecipeService.js'
import { EmbeddingService } from '../services/EmbeddingService.js'
import { logger } from '../config/winston.js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Encapsulates a controller.
 */
export class RecipeController {
  /**
   * The service.
   *
   * @type {RecipeService}
   * @type {EmbeddingService}
   */
  #service
  #embeddingService

  /**
   * Initializes a new instance.
   *
   * @param {RecipeService} service - A service instantiated from a class with the same capabilities as RecipeService.
   * @param {EmbeddingService} embeddingService - A service instantiated from a class with the same capabilities as EmbeddingService.
   */
  constructor (service, embeddingService) {
    logger.silly('RecipeController constructor')
    this.#service = service
    this.#embeddingService = embeddingService
  }

  /**
   * Generates a recipe based on the provided product IDs and prompt.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @throws {Error} - If an error occurs during the operation.
   */
  async generateRecipe (req, res, next) {
    try {
      const { hitIds, prompt } = req.body
      // Get metadata for the products
      const result = await this.#embeddingService.search({
        filter: { productId: { $in: hitIds } },
        perPage: 1000
      })
      // Check if any products were found
      const context = result.data.map(d =>
        `• ${d.metadata.product_name}: ${d.text}`
      ).join('\n')

      // Create a promt for the OpenAI API
      const systemPrompt = 'Du är en duktig kock som ger recept baserat på ingredienser.'
      const userPrompt = `
        I have the following ingredients:
        ${context}
        Give me recipe with these ingredients. ${prompt || ''}
      `

      const chat = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500
      })

      res.json({ recipe: chat.choices[0].message.content })
    } catch (err) {
      next(err)
    }
  }
}
