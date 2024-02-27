import { ErrorTypes } from "../models/errors/errorTypes.js";

export function handlerErrorCustom(error, req, res, next) {
  let statusCode; //= 500; // Default to internal server error
  if (error.type === ErrorTypes.AUTH_ERROR) {
    statusCode = 401; // Unauthorized
  } else if (error.type === ErrorTypes.NOT_FOUND_ERROR) {
    statusCode = 404; // Not found
  } else if (error.type === ErrorTypes.AUTHORIZATION_ERROR) {
    statusCode = 403; // Forbidden -  insufficient rights to a resource
  } else if (error.type === ErrorTypes.INCORRECT_DATA_ERROR) {
    statusCode = 400; // Bad request
  } else if (error.type === ErrorTypes.REGISTRATION_ERROR) {
    statusCode = 400; // Bad request
  } else if (error.type === ErrorTypes.DB.VALIDATION_ERROR) {
    statusCode = 400; // Bad request
  } else if (error.type === ErrorTypes.DB.INCORRECT_FIELD) {
    statusCode = 400; // Bad request
  } else if (error.type === ErrorTypes.DB.DUPLICATE_ERROR) {
    statusCode = 409; // Confilct
  } else if (error.type === ErrorTypes.DB.INTERNAL_ERROR) {
    statusCode = 500; // internal server error
  } else {
    statusCode = 500;
  }
  req.logger.error({
    status: "[Custom]",
    statusCode: statusCode,
    message: error.message,
  });
  res.status(statusCode);
  res.json({ status: "error", message: error.message });
}
