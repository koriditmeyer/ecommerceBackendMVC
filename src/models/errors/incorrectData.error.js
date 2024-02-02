import { ErrorTypes } from "./errorTypes.js"

export class IncorrectDataError extends Error {
    constructor() {
      super('Incorrect Data')
      this.type = ErrorTypes.INCORRECT_DATA_ERROR
    }
  }
  