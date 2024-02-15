import { ErrorTypes } from './errorTypes.js'

export class dBValidationError extends Error {
  constructor(field) {
    super(`Validation failed : ${field} required`)
    this.type = ErrorTypes.DB.VALIDATION_ERROR
  }
}

export class dBDuplicateKeyError extends Error {
    constructor(element) {
      super(`Duplicated element: ${element}`)
      this.type = ErrorTypes.DB.DUPLICATE_ERROR
    }
  }

  export class dBInternalError extends Error {
    constructor() {
      super("Internal Server Error")
      this.type = ErrorTypes.DB.INTERNAL_ERROR
    }
  }