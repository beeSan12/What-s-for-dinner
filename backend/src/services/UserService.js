/**
 * UserService handles user registration and login.
 * It uses a user repository to interact with the database.
 * @module UserService
 * @author Beatriz Sanssi
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// Application modules.
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { UnauthorizedError } from '../lib/errors/index.js'

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
  async register({ email, password }) {
    // Check if the user already exists
    const existingUsers = await this.search({ email })
    if (existingUsers.length > 0) {
      throw new Error('User already exists')
    }

    const insertedUser = await this.insert({ email, password })
    return insertedUser
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
    const result = await this.search({ email })
    const user = result.data[0]
    console.log('Found user:', user)
    console.log('Plain password:', password)
    console.log('Hashed password:', user?.password)
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