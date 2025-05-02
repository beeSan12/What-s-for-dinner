/**
 * AuthService handles user registration and login.
 * It uses a user repository to interact with the database.
 *
 * @module AuthService
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
export class AuthService extends MongooseServiceBase {
  /**
   * Logs in a user.
   *
   * @param {object} user - The user object containing email and password.
   * @param {string} user.email - The user's email.
   * @param {string} user.password - The user's password.
   * @returns {Promise<object>} The logged-in user object.
   */
  async login ({ email, password }) {
    const user = await this.findOne({ email })
    console.log('Found user:', user)
    console.log('Plain password:', password)
    console.log('Hashed password:', user?.password)

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Wrong credentials')
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    return { token, refreshToken, user: { id: user._id.toString(), email: user.email } }
  }

  // /**
  //  * Refreshes the access token given a refresh token.
  //  *
  //  * @param {string} token - The refresh token.
  //  * @returns {Promise<object>} An object with the new access token, the old refresh token, and the user.
  //  * @throws {Error} If the refresh token is invalid or expired.
  //  */
  // async refreshToken (token) {
  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET)
  //     const user = await this.findById(decoded.id)
  //     if (!user) {
  //       throw new UnauthorizedError('User not found', 'USER_NOT_FOUND', { id: decoded.id })
  //     }
  //     // if (!user) throw new UnauthorizedError('User not found')
  //     const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  //     return { token: newAccessToken, refreshToken: token, user: { id: user._id.toString(), email: user.email } }
  //   } catch (err) {
  //     console.error('Error refreshing token:', err)
  //     throw new UnauthorizedError('Invalid or expired refresh token')
  //   }
  // }

  /**
   * Refreshes the access token using a refresh token.
   *
   * @param {string} refreshToken - The refresh token.
   * @returns {Promise<object>} An object with the new access token.
   * @throws {Error} If the refresh token is invalid or expired.
   */
  async refreshToken ({ refreshToken }) {
    let payload
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_SECRET)
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token')
    }
    const newToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    return { token: newToken, refreshToken }
  }
  // async refreshAccessToken (refreshToken) {
  //   try {
  //     const payload = jwt.verify(refreshToken, process.env.JWT_SECRET)
  //     const user = await this.userService.getOne({ _id: payload.id })
  //     if (!user) throw new NotFoundError('User not found')

  //     const newToken = jwt.sign(
  //       { id: user._id.toString(), email: user.email },
  //       process.env.JWT_SECRET,
  //       { expiresIn: '1h' }
  //     )
  //     return { token: newToken }
  //   } catch (err) {
  //     throw new UnauthorizedError('Invalid or expired refresh token')
  //   }
  // }
}
