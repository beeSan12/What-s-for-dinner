/**
 * UserService handles user registration and login.
 * It uses a user repository to interact with the database.
 * @module UserService
 * @author Beatriz Sanssi
 */


/**
 * Encapsulates the user service.
 */
export class UserService {
  /**
   * Creates an instance of UserService.
   */
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  /**
   * Registers a new user.
   *
   * @param {object} user - The user object containing email and password.
   * @param {string} user.email - The user's email.
   * @param {string} user.password - The user's password.
   * @returns {Promise<object>} The registered user object.
   */
  async register({ email, password }) {
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