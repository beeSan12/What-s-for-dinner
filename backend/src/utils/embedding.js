/**
 * This file creates an embedding for a given text using the Hugging Face API.
 *
 * @module embedding
 * @author Beatriz Sanssi
 */

import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Creates an embedding for a given text using the OpenAI API.
 *
 * @param {string} input - The text to create an embedding for.
 * @returns {Promise<Array<number>>} - A promise that resolves to the embedding array.
 * @throws {Error} - If the OpenAI API request fails.
 */
export async function createEmbedding (input) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input
  })

  if (Array.isArray(input)) {
    // Return embeddings in the same order as the input
    return res.data.map(obj => obj.embedding)
  } else {
    // Return the first embedding
    return res.data[0].embedding
  }
}

/**
 * Ask GPT for a fallback answer if no embedding match was found.
 *
 * @param {string} query - The query string to ask GPT.
 * @returns {Promise<string>} The GPT-generated response.
 */
export async function askGptFallback (query) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const gptReply = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: query }],
    temperature: 0.7
  })

  return gptReply.choices[0].message.content
}
