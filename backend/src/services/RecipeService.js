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
   * @param {object} options - The options object.
   * @param {string} options.context - The context string containing the ingredients.
   * @param {string} options.prompt - The prompt string for the recipe.
   * @returns {Promise<{recipe: string}>}
   */
  async generateRecipeFromService ({ context, prompt }) {
    const fullPrompt = `
    I have the following ingredients:
    ${context}
    Suggest three different simple recipes I can make. Be clear and separate each recipe clearly with a heading like "Recipe 1", "Recipe 2", "Recipe 3". ${prompt || ''}
    `
    const recipeText = await askGptFallback(fullPrompt)

    // Divide the text into separate recipes
    const recipes = recipeText
      .split(/Recipe \d+/i)
      .map(r => r.trim())
      .filter(r => r.length > 0)

    return { recipe: recipes }
  }
}
