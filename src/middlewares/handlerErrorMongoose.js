import mongoose from "mongoose";
import {
  dBDuplicateKeyError,
  dBIncorrectFieldError,
  dBInternalError,
  dBValidationError,
} from "../models/errors/dB.error.js";

export function handlerErrorMongoose(err, req, res, next) {
  // ValidationError handling
  if (err instanceof mongoose.Error.ValidationError) {
    const status= "Validation failed"
    const errors = Object.keys(err.errors).map((key) => {
      const message = err.errors[key].message;
      return { field: key, message };
    });

    req.logger.debug({ status: `[Mongoose] - ${status}`  , errors });
    next(new dBValidationError(errors.map((e)=>e.field))) 
  }

  // CastError handling
  else if (err instanceof mongoose.Error.CastError) {
    const status= "CastError"
    const message = `Invalid ${err.kind} value for path '${err.path}': '${err.value}'`;
    req.logger.debug({ status: `[Mongoose] - ${status}`  , message });
    next( new dBInternalError())
  }
  // Field not present
  if (err.message.includes("is not in schema and strict mode is set to throw")) {
    // Handle the strict mode schema error
    const status = "IncorrectField";
    const message = err.message;
    req.logger.debug({ status: `[Mongoose] - ${status}`, message });
    next(new dBIncorrectFieldError());
}

    // VersionError handling
  else if (err instanceof mongoose.Error.VersionError) {
    const status= "VersionError"
    const message= "Document version conflict"
    req.logger.debug({ status: `[Mongoose] - ${status}` , message });
    next( new dBInternalError())
  }

  // Duplicate key error handling (MongoError with code 11000 or 11001)
  else if (err.code === 11000) {
    let key= Object.keys(err.keyValue)
    let value =err.keyValue;
    for (const prop in value){
      value=value[prop]
    }
    const status= "NotFoundError"
    const message = `Duplicate field value: ${key}. Please use another value than ${value}!`;
    req.logger.debug({status: `[Mongoose] - ${status}`  ,statusCode: err.code, message });
    next( new dBDuplicateKeyError(key))
  }

  // DocumentNotFoundError handling (custom or logic-based handling)
  else if (err.message === "DocumentNotFoundError") {
    const status= "NotFoundError"
    const message= "Document version conflict"
    req.logger.debug({ status: `[Mongoose] - ${status}`   ,statusCode: err.code, message });
    next( new dBInternalError())
  }
  // Generic error handling for unexpected or unclassified errors
  else {
    next( err)
  }
}
