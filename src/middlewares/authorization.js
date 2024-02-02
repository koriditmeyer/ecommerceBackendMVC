import { AuthorizationError } from "../models/errors/authorization.error.js";

// In Express, middleware functions should follow the (req, res, next) signature
export function allowedRoles(requiredRoles) {
  return async (req, res, next) => {
    // console.log(req.user)
    if (!requiredRoles.includes(req.user.role)) {
      return next(new AuthorizationError());
    }
    next();
  };
}
