/**
 * @file Defines the user model.
 * @module models/UserModel
 * @author Beatriz Sanssi
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      /**
       * Validates the email address.
       *
       * @param {string} v - The email address to validate.
       * @returns {boolean} - True if the email address is valid, false otherwise.
       */
      validator: function (v) {
        // This regex ensures that the email contains an "@" and ends with .com, .se, .nu, .net, or .org
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|se|nu|net|org)$/i.test(v)
      },
      /**
       * Error message for invalid email address.
       *
       * @param {object} props - The properties of the validation error.
       * @param {string} props.value - The invalid email address.
       * @returns {string} - The error message.
       */
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minLength: [10, 'The password must be of minimum length 10 characters.'],
    maxLength: [256, 'The password must be of maximum length 256 characters.']
  }
})

// Create a model using the schema.
export const UserModel = mongoose.model('User', schema)
