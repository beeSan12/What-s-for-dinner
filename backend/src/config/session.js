/**
 * @file This module contains the options object for the session middleware.
 * @module session
 * @author Mats Loock & Beatriz Sanssi <bs222eh@student.lnu.se>
 * @see {@link https://github.com/expressjs/session}
 */

import crypto from 'crypto'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Generate a cryptographically secure opaque session ID.
 * This prevents session fixation attacks.
 *
 * @returns {string} A session ID.
 */
const generateSessionId = () => crypto.randomBytes(32).toString('hex')

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Only save a session if a property has been added to req.session
  store: MongoStore.create({
    mongoUrl: process.env.DB_CONNECTION_STRING, // Save sessions in MongoDB
    collectionName: 'sessions',
    ttl: 2 * 60 * 60 // Sessions timeout (2 hours)
  }),
  /**
   * Generate a cryptographically secure opaque session ID.
   * This prevents session fixation attacks.
   *
   * @returns {string} A session ID.
   */
  genid: () => generateSessionId(), // Opaque session ID
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    // sameSite: 'strict', // Avoid CSRF attacks
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
})
console.log('Session middleware loaded')

export { sessionMiddleware }
