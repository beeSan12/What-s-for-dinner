/**
 * UserService handles user registration and login.
 * It uses a user repository to interact with the database.
 *
 * @module UserService
 * @author Beatriz Sanssi
 */

import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'
// import { UnauthorizedError } from '../lib/errors/index.js'

dotenv.config()

/**
 * Encapsulates the user service.
 */
export class UserService extends MongooseServiceBase {
  /**
   * Registers a new user.
   *
   * @param {object} user - The user object containing email and password.
   * @param {string} user.email - The user's email.
   * @param {string} user.password - The user's password.
   * @returns {Promise<object>} The registered user object.
   */
  async register ({ email, password }) {
    // Check if the user already exists
    const existingUsers = await this.search({ email })
    if (existingUsers.length > 0) {
      throw new Error('User already exists')
    }

    // Hash and salt the password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const insertedUser = await this.insert({
      email,
      password: hashedPassword
    })
    return insertedUser
  }
}
