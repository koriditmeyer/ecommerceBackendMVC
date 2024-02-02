import { ErrorTypes } from './errorTypes.js'

export class AuthorizationError extends Error {
  constructor() {
    super("Authorization Error - You don't have the required authorization")
    this.type = ErrorTypes.AUTHORIZATION_ERROR
  }
}