import { AuthorizationError } from "../models/errors/authorization.error.js";
import { VerificationError } from "../models/errors/verification.error.js";
import { usersRepository } from "../repository/user.repository.js";
import { userServices } from "../services/user.services.js";
import { logger } from "../utils/logger/index.js";

// In Express, middleware functions should follow the (req, res, next) signature

//middleware to check the user role contained in the cookie and authorise the user accordingly
export function allowedRolesCookie(requiredRoles) {
  return async (req, res, next) => {
    logger.debug(`[allowedRolesCookie] user verified: ${req.user.verified}`)
    if (!req.user.verified) {
      return next(new VerificationError());
    }
    logger.debug(`[allowedRolesCookie] user authorised: ${req.user.roles.some(role => requiredRoles.includes(role))}`)
    if (!req.user.roles.some(role => requiredRoles.includes(role))) {
      // if (!requiredRoles.includes(req.user.roles)) {
      return next(new AuthorizationError());
    }
    next();
  };
}
//middleware to check the user role from a query to the DB with the id contained in the cookie and authorise the user accordingly //more secured
export function allowedRolesDB(requiredRoles) {
  return async (req, res, next) => {
    try {
      //  user's ID
      const user = await usersRepository.findOne({_id:req.user._id});
      // console.log(user)
      if (!req.user.roles.some(role => requiredRoles.includes(role))) {
        return next(new AuthorizationError());
      }
      next();
    } catch (error) {
      next(new AuthorizationError());
    }
  };
}
// middleware to authorise the cart midification only by the user himself
export async function allowCartmodification(req, res, next) {
    try {
      const cid = req.params.cid;
      const id = req.user._id;
      // console.log(cid,id)
      const cart = await userServices.verifyUserCart(cid, id);
      next();
    } catch (error) {
      next(new AuthorizationError()); // Pass any errors to the error handling middleware
    }
}
