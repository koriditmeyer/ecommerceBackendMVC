import { ErrorTypes } from './errorTypes.js'

export class NotFoundError extends Error {
  constructor(entityName = 'element') {
    super('Could not Find: ' + entityName)
    this.type = ErrorTypes.NOT_FOUND_ERROR
  }
}