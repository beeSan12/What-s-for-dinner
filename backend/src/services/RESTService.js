/**
 * @file Handles the REST API requests.
 * @module services/RESTService
 * @author Beatriz Sanssi
 */

import dotenv from 'dotenv'

dotenv.config()

/**
 * Handles REST API requests.
 */
export class RESTService {
  /**
   * Creates an instance of RESTService.
   *
   * @param {object} apiClient - The API client for making requests.
   */
  constructor (apiClient) {
    this.apiClient = apiClient
  }

  /**
   * Formats the date to a string.
   *
   * @function get
   * @param {Date} value - The date value.
   * @returns {string} The formatted date.
   */
  get (value) {
    return new Date(value).toISOString().replace('T', ' ').split('.')[0]
  }
}
