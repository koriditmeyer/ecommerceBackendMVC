import { ErrorTypes } from "./errorTypes.js";

export class NotFoundError extends Error {
  constructor(entityName) {
    if (entityName) {
      super("Could not Find: " + entityName);
    } else {
      super("Not Found");
    }
    this.type = ErrorTypes.NOT_FOUND_ERROR;
  }
}
