import { ErrorTypes } from './errorTypes.js'

export class RegistrationError extends Error {
  constructor() {
    super('Registration Error')
    this.type = ErrorTypes.REGISTRATION_ERROR
  }
}
