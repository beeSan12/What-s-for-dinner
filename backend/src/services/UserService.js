/**
 * UserService handles user registration and login.
 * It uses a user repository to interact with the database.
 * @module UserService
 * @author Beatriz Sanssi
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { UnauthorizedError } from '../lib/errors/index.js'

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
  async register({ email, password }) {
    // Check if the user already exists
    const existingUsers = await this.search({ email })
    if (existingUsers.length > 0) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    return await this.insert({ email, password: hashedPassword })
  }

  /**
   * Logs in a user.
   *
   * @param {object} user - The user object containing email and password.
   * @param {string} user.email - The user's email.
   * @param {string} user.password - The user's password.
   * @returns {Promise<object>} The logged-in user object.
   */
  async login({ email, password }) {
    // Check if the user exists 
    const users = await this.search({ email })
    const user = users[0]

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Wrong credentials')
    }

    // Generate JWT tokens
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    return { token, refreshToken, user: { id: user._id.toString(), email: user.email } }
  }

  /**
   * Verifies a token.
   *
   * @param {string} token - The token to verify.
   * @returns {Promise<object>} The decoded token object.
   */
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}