/**
 * @file Defines the main application.
 * @module server
 * @author Mats Loock
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

// Must be first!
import httpContext from 'express-http-context'

// Built-in modules.
import { randomUUID } from 'node:crypto'
import http from 'node:http'

// User-land modules.
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Application modules.
import { connectToDatabase } from './config/mongoose.js'
import { morganLogger } from './config/morgan.js'
import { limiter } from './config/rateLimiter.js'
import { logger } from './config/winston.js'
import { router } from './routes/router.js'

dotenv.config()
const PORT = Number(process.env.PORT || process.env.NODEJS_EXPRESS_PORT || 8083)
const HOST = process.env.HOST || '0.0.0.0'

try {
  // Connect to MongoDB.
  await connectToDatabase(process.env.DB_CONNECTION_STRING)
  console.log(`Database Connection String: ${process.env.DB_CONNECTION_STRING}`)
  console.log(`Base URL: ${process.env.BASE_URL}`)

  // Create an Express application.
  const app = express()

  // Set various HTTP headers for app security
  app.use(helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
  )
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'https://placehold.co', 'https://secure.gravatar.com'],
        fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        connectSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"]
      }
    })
  )

  // Enable Cross Origin Resource Sharing (CORS) (https://www.npmjs.com/package/cors).
  // app.use(cors())
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://what-s-for-dinner-one.vercel.app'
    ],
    credentials: true
  }))

  // Parse requests of the content type application/json.
  app.use(express.json())

  app.set('trust proxy', 1) // Trust the first proxy.
  // Use the session middleware for managing secure sessions.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))
  console.log(`Directory: ${directoryFullName}`)

  const distPath = join(directoryFullName, '..', 'frontend', 'dist')
  app.use('/wt2', express.static(distPath))

  app.use(cookieParser())

  // Add the request-scoped context.
  // NOTE! Must be placed before any middle that needs access to the context!
  //       See https://www.npmjs.com/package/express-http-context.
  app.use(httpContext.middleware)

  // Use a morgan logger.
  app.use(morganLogger)

  // Apply the rate limiting middleware to all requests.
  app.use(limiter)

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Add a request UUID to each request and store information about
    // each request in the request-scoped context.
    req.requestUuid = randomUUID()
    httpContext.set('request', req)

    res.locals.baseURL = process.env.BASE_URL || '/'
    next()
  })

  // Register routes.
  app.use('/', router)

  // Error handler.
  app.use((err, req, res, next) => {
    logger.error(err.message, { error: err })

    if (process.env.NODE_ENV === 'production') {
      // Ensure a valid status code is set for the error.
      // If the status code is not provided, default to 500 (Internal Server Error).
      // This prevents leakage of sensitive error details to the client.
      if (!err.status) {
        err.status = 500
        err.message = http.STATUS_CODES[err.status]
      }

      // Send only the error message and status code to prevent leakage of
      // sensitive information.
      res.status(err.status).json({
        error: err.message
      })

      return
    }

    // ---------------------------------------------------
    // ⚠️ WARNING: Development Environment Only!
    //             Detailed error information is provided.
    // ---------------------------------------------------

    // Deep copies the error object and returns a new object with
    // enumerable and non-enumerable properties (cyclical structures are handled).
    const copy = JSON.decycle(err, { includeNonEnumerableProperties: true })

    return res.status(err.status || 500).json(copy)
  })

  // Health check route
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  // Starts the HTTP server listening for connections.
  app.listen(PORT, HOST, function () {
    const { port } = this.address()
    logger.info(`Server running on http://${HOST}:${port}`)
  })
} catch (err) {
  logger.error(err.message, { error: err })
  process.exitCode = 1
}
