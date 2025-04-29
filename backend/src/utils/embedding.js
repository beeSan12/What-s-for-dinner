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
 * @param {string} text - The text to create an embedding for.
 * @returns {Promise<Array<number>>} - A promise that resolves to the embedding array.
 * @throws {Error} - If the OpenAI API request fails.
 */
export async function createEmbedding (text) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text
  })
  return res.data[0].embedding
}
