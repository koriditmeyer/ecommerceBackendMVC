import { AuthorizationError } from "../models/errors/authorization.error.js";
import { usersRepository } from "../repository/user.repository.js";
import { userServices } from "../services/user.services.js";

// In Express, middleware functions should follow the (req, res, next) signature

//middleware to check the user role contained in the cookie and authorise the user accordingly
export function allowedRolesCookie(requiredRoles) {
  return async (req, res, next) => {
    // console.log(req.user)
    if (!requiredRoles.includes(req.user.role)) {
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
      console.log(user)
      if (!requiredRoles.includes(user.role)) {
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
      const cart = await userServices.verifyUserCart(cid, id);
      next();
    } catch (error) {
      next(new AuthorizationError()); // Pass any errors to the error handling middleware
    }
}
