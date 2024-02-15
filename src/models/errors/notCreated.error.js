import { ErrorTypes } from "./errorTypes.js";

export class NotCreatedError extends Error {
  constructor() {
    super("Nothing Created");
    this.type = ErrorTypes.NOT_CREATED;
  }
}
