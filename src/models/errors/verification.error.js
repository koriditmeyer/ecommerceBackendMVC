import { ErrorTypes } from './errorTypes.js'

export class VerificationError extends Error {
  constructor() {
    super("Verification Error - You are not a Verid User")
    this.type = ErrorTypes.VERIFICATION_ERROR
  }
}