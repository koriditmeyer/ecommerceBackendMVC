import { ErrorTypes } from "./errorTypes.js"

export class IncorrectDataError extends Error {
    constructor(data) {
      if (data) {
        super(`Incorrect Data: "${data}"`)
      } else {
        super("Incorrect Data");
      }
      this.type = ErrorTypes.INCORRECT_DATA_ERROR
    }
  }
  