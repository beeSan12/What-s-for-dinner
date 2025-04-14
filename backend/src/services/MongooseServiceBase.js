/**
 * @file This file contains the MongooseServiceBase class.
 * @module MongooseServiceBase
 * @author Mats Loock
 */

// User-land modules.
import mongoose from 'mongoose'

// Application modules.
import {
  ApplicationError,
  ConcurrencyError,
  ExcessDataError,
  InsufficientDataError,
  NotFoundError,
  NotModifiedError,
  ValidationError
} from '../lib/errors/index.js'
import { hasErrorOfType } from '../lib/util.js'
import { MongooseRepositoryBase } from '../repositories/MongooseRepositoryBase.js'

/**
 * Encapsulates a task service.
 */
export class MongooseServiceBase {
  /**
   * A map of document actions to functions that ensure that the provided data
   * object contains exactly the required properties.
   *
   * @type {Map<string, Function>}
   * @type {{[key in DocumentAction]: (object) => boolean}}
   */
  #actionToEnsureExpectedProperties

  /**
   * The repository.
   *
   * @type {MongooseRepositoryBase}
   */
  #repository

  /**
   * Initializes a new instance.
   *
   * @param {MongooseRepositoryBase} repository - A repository instantiated from a class with the same capabilities as MongooseRepositoryBase.
   */
  constructor (repository) {
    this.#repository = repository
  }

  /**
   * Gets all documents.
   *
   * @param {object} params - The query parameters.
   * @param {number} [params.page=1] - The page number.
   * @param {number} [params.perPage=20] - The number of documents per page.
   * @returns {Promise<object>} Promise resolved with all documents.
   */
  async get ({ page = 1, perPage = 20 } = {}) {
    try {
      page = Math.max(page, 1)

      perPage = Math.max(perPage, 1)
      perPage = Math.min(perPage, 100)

      return await this.#repository.get(
        null,
        null,
        {
          limit: perPage,
          skip: (page - 1) * perPage
        }
      )
    } catch (error) {
      this.#handleError(error, 'Failed to get documents.')
    }
  }

  /**
   * Gets a document by ID.
   *
   * @param {string} id - The value of the id for the document to get.
   * @returns {Promise<object>} Promise resolved with the found document as a plain JavaScript object.
   */
  async getById (id) {
    try {
      return await this.#repository.getById(id)
    } catch (error) {
      // If there is a CastError, the provided id is not a valid ObjectId,
      // and we can throw a NotFoundError instead of handling the error in
      // the #handleError method.
      if (hasErrorOfType(error, mongoose.Error.CastError)) {
        throw new NotFoundError({ cause: error })
      } else {
        this.#handleError(error, 'Failed to get document.')
      }
    }
  }

  /**
   * Handles an error.
   *
   * @param {Error} error - The error to handle.
   * @param {string} message - The message to use if the error is not handled.
   */
  #handleError (error, message) {
    if (hasErrorOfType(error, mongoose.Error.ValidationError) ||
      hasErrorOfType(error, mongoose.Error.CastError)) {
      throw new ValidationError({ cause: error })
    } else if (hasErrorOfType(error, mongoose.Error.VersionError)) {
      throw new ConcurrencyError({ cause: error })
    } else if (hasErrorOfType(error, mongoose.Error.DocumentNotFoundError)) {
      throw new NotFoundError({ cause: error })
    } else if (error instanceof ApplicationError) {
      throw error
    } else {
      // Handle other errors.
      throw new ApplicationError({ message, cause: error })
    }
  }

  /**
   * Ensures that the provided data object contains exactly the required properties, no more and no less.
   * Throws an error if the data object is missing a required property or contains an excess property.
   *
   * @param {object} data - The data object to validate.
   * @param {DocumentAction} action - The document action to validate the data object for.
   * @throws {InsufficientDataError} If a required property is missing from the data object.
   * @throws {ExcessDataError} If the data object contains a property not included in the list of required properties.
   */
  // #ensureExpectedProperties (data, requireAllPropertyNames = true, includeVersion = true) {
  #ensureExpectedProperties (data, action) {
    // Ensure that the action is valid.
    const validate = this.#actionToEnsureExpectedProperties[action]

    if (!validate) {
      throw new Error(`Invalid action: ${action}`)
    }

    // Ensure that the data object contains exactly the required properties.
    if (!validate(data)) {
      throw new InsufficientDataError({ data: { ...data } })
    }

    // Ensure that the data object does not contain any excess properties.
    if (action !== DocumentAction.Delete && this.#repository.model.hasExcessProperties(data)) {
      throw new ExcessDataError({ data: { ...data } })
    } else if (action === DocumentAction.Delete) {
      // If the action is delete, ensure that the data object contains exactly one property.
      const requiredPropertyCount = this.#repository.model.checkConcurrency() ? 1 : 0
      if (Object.keys(data).length > requiredPropertyCount) {
        throw new ExcessDataError({ data: { ...data } })
      }
    }
  }
}

