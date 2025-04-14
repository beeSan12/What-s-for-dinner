/**
 * @file Defines the AuthController class.
 * @module AuthController
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import { UserModel } from '../../models/UserModel.js'
import { userController } from './UserController.js'
import jwt from 'jsonwebtoken'
import { UnauthorizedError, NotFoundError } from '../lib/errors/index.js'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Encapsulates a controller.
 */
export class AuthController {
  /**
   * Logs in a user and returns tokens and user data.
   *
   * @param {object} param0 - Object with email and password.
   * @param {string} param0.email - The email of the user.
   * @param {string} param0.password - The password of the user.
   * @returns {Promise<object>} An object with the token, refresh token, and user data.
   * @throws {UnauthorizedError} If the user is not found or the password is incorrect.
   * @throws {NotFoundError} If the user is not found after login.
   */
  async loginUser ({ email, password }) {
    try {
      // Check if the user and password are valid
      const { token, refreshToken } = await userController.loginUser({ email, password })

      // Now retrieve the full user data (if needed) and return all fields
      const user = await UserModel.findOne({ email })
      if (!user) {
        throw new NotFoundError('User not found after login', { email })
      }

      return { token, refreshToken, user: { id: user._id.toString(), email: user.email } }
    } catch (err) {
      throw new UnauthorizedError(err.message || 'Authentication failed')
    }
  }

  /**
   * Refreshes the access token given a refresh token.
   *
   * @param {string} token - The refresh token.
   * @returns {Promise<object>} An object with the new access token, the old refresh token, and the user.
   * @throws {ApolloError} If the refresh token is invalid or expired.
   */
  async refreshToken (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await UserModel.findById(decoded.id)
      if (!user) {
        throw new ApolloError('User not found', 'USER_NOT_FOUND', { id: decoded.id })
      }
      // if (!user) throw new UnauthorizedError('User not found')
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '30m' })
      return { token: newAccessToken, refreshToken: token, user: { id: user._id.toString(), email: user.email } }
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token')
    }
  }

  /**
   * Refreshes the access token using a refresh token.
   *
   * @param {string} refreshToken - The refresh token.
   * @returns {Promise<object>} An object with the new access token.
   * @throws {ApolloError} If the refresh token is invalid or expired.
   */
  async refreshAccessToken (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET)
      const user = await UserModel.findById(payload.id)

      if (!user) {
        throw new NotFoundError('User not found', { id: payload.id })
      }

      const newToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
      return { token: newToken }
    } catch (err) {
      throw new AuthenticationError('Invalid or expired refresh token')
    }
  }
}

export const authController = new AuthController()
