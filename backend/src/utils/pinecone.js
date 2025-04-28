/**
 * This file connects to Pinecone, a vector database, using the Pinecone client.
 * It initializes the client with the API key and environment variables.
 *
 * @module pinecone
 * @author Beatriz Sanssi
 */

import { PineconeClient } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Pinecone client instance.
 *
 * @type {PineconeClient}
 */
export const pinecone = new PineconeClient()

/**
 * Initializes the Pinecone client with the API key and environment.
 *
 * @returns {Promise<void>} - A promise that resolves when the client is initialized.
 * @throws {Error} - If the API key or environment is not set.
 */
export async function initPinecone() {
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  })
}

/**
 * Returns the Pinecone index instance.
 *
 * @returns {Pinecone.Index} - The Pinecone index instance.
 * @throws {Error} - If the index name is not set.
 */
export function pineconeIndex() {
  return pinecone.Index('your-index-name') // Byt 'your-index-name' till ditt riktiga indexnamn
}