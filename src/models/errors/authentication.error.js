import { ErrorTypes } from './errorTypes.js'

export class AuthenticationError extends Error {
  constructor() {
    super('Authentication Error - Please Check your credentials')
    this.type = ErrorTypes.AUTH_ERROR
  }
}

export class AuthenticationServerError extends Error {
    constructor() {
      super('Authentication Error - We are working to Fix it')
      this.type = ErrorTypes.AUTH_ERROR
    }
  }