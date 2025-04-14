/**
 * @file Middleware to check the authorization header for a JWT token and authenticate the user.
 * @module authenticate
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../lib/errors/index.js'

const JWT_SECRET = process.env.JWT_SECRET

/**
 * Verifies the JWT token from the request headers.
 *
 * @param {object} req - Express request object.
 * @returns {object|null} The decoded token if valid, otherwise null.
 * @throws {AuthenticationError} If the token is invalid or expired.
 */
export function verifyToken (req) {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]

    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired token')
    }
  }
  return null // No token provided
}

/**
 * Middleware to authenticate the user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} Calls the next middleware function.
 * @throws {AuthenticationError} If the token is invalid or expired.
 */
export function authenticate (req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1] // Expecting a Bearer token
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
    } catch (err) {
      console.error('Invalid token', err)
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
  }
  next()
}
