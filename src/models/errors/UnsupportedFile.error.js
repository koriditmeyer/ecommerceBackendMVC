import { ErrorTypes } from "./errorTypes.js"

export class UnsupportedFileError extends Error {
    constructor(data) {
      if (data) {
        super(`Unsupported file: ${data}`)
      } else {
        super("Unsupported file type");
      }
      this.type = ErrorTypes.UNSUPORTED_FILE_ERROR
    }
  }
  