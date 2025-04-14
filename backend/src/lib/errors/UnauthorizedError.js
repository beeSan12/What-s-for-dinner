/**
 * @file This file defines the UnauthorizedError class.
 * @module UnauthorizedError
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */
import { ApplicationError } from './ApplicationError.js'

/**
 * Represents an unauthorized error.
 *
 * @class UnauthorizedError
 */
export class UnauthorizedError extends ApplicationError {
  /**
   * Creates an instance of UnauthorizedError.
   *
   * @param {object} options - An object that has the following properties:
   * @param {string} options.message - A human-readable description of the error.
   */
  constructor ({ message = 'Unauthorized access.', ...options } = {}) {
    super({ message, ...options })
  }
}
