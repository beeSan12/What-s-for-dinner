/**
 * @file This file defines the RepositoryError class.
 * @module SessionError
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { ApplicationError } from './ApplicationError.js'

/**
 * Represents a repository error.
 *
 * @class ApplicationError
 */
export class SessionError extends ApplicationError {
  /**
   * Creates an instance of ApplicationError.
   *
   * @param {object} options - An object that has the following properties:
   * @param {string} options.message - A human-readable description of the error.
   * @param {Error} options.cause - A value indicating the specific cause of the error.
   * @param {object} options.data - Custom debugging information.
   */
  constructor ({ message = 'An error occurred while accessing the session from MongoStore.', ...options } = {}) {
    super({ message, ...options })
  }
}
