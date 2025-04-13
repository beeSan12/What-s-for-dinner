/**
 * @file Defines APIClientFactory for creating API clients.
 * @module APIClientFactory
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Factory for creating API clients.
 */
export class APIClientFactory {
  /**
   * Creates a client for GitLab GraphQL API.
   *
   * @returns {object} - A configured axios instance.
   */
  static createOpenFoodAPIClient () {
    return axios.create({
      baseURL: process.env.OPENFOOD_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
