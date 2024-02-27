import { ErrorTypes } from "./errorTypes.js"

export class IncorrectDataError extends Error {
    constructor(data) {
      super(`Incorrect Data: "${data}"`)
      this.type = ErrorTypes.INCORRECT_DATA_ERROR
    }
  }
  