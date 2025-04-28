/**
 * This file creates an embedding for a given text using OpenAI's API.
 * It uses the OpenAI API client to send a request to the `text-embedding-ada-002` model.
 *
 * @module embedding
 * @author Beatriz Sanssi 
 */

import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'

dotenv.config()

// Load environment variables from .env file
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

/**
 * Creates an embedding for the given text using OpenAI's API.
 *
 * @param {string} text - The text to create an embedding for.
 * @returns {Promise<Array<number>>} - The embedding vector.
 * @throws {Error} - If the API request fails.
 */
export async function createEmbedding(text) {
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: text,
  })

  return response.data.data[0].embedding
}
