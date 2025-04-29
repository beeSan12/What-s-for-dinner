/**
 * @file This file contains the RecipeService class
 * @module RecipeService
 * @author Beatriz Sanssi
 */

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { askGptFallback } from '../utils/embedding.js'

/**
 * Encapsulates a task service.
 */
export class RecipeService extends MongooseServiceBase {
   /**
   * Generate a recipe from a given context and prompt.
   * @param {object} options
   * @param {string} options.context
   * @param {string} options.prompt
   * @returns {Promise<{recipe: string}>}
   */
   async generateRecipeFromService({ context, prompt }) {
    const fullPrompt = `
      I have the following ingredients:
      ${context}
      Give me a recipe. ${prompt || ''}
    `
    const recipeText = await askGptFallback(fullPrompt)
    return { recipe: recipeText }
  }
}
