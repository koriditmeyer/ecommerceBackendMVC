
import { ErrorTypes } from './errorTypes.js'

export class NotModifiedError extends Error {
  constructor() {
    super("Found but no changes were made")
    this.type = ErrorTypes.NOT_MODIFIED
  }
}


