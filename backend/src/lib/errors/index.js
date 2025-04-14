/**
 * @file This file exports all error modules, allowing them to be imported all at once.
 * @module index
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Beatriz Sanssi <bs222eh@student.lnu.se>
 */

export { ApplicationError } from './ApplicationError.js'
export { ConcurrencyError } from './ConcurrencyError.js'
export { ExcessDataError } from './ExcessDataError.js'
export { HttpError } from './HttpError.js'
export { InsufficientDataError } from './InsufficientDataError.js'
export { NotFoundError } from './NotFoundError.js'
export { NotModifiedError } from './NotModifiedError.js'
export { RepositoryError } from './RepositoryError.js'
export { ValidationError } from './ValidationError.js'
export { UnauthorizedError } from './UnauthorizedError.js'
export { SessionError } from './SessionError.js'
