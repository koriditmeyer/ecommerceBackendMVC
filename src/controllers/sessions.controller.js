import passport from "passport";
import {
  appendJwtAsCookie,
  clearSession,
  removeJwtFromCookies,
} from "../middlewares/authentication.js";

// Express, middleware functions need to be listed in an array or 
// passed as separate arguments to the route handler.
export const registerUser = [
  authenticate("local-register"),
  appendJwtAsCookie,
  async (req, res, next) => {
    res["successfullPost"](req.user);
  },
];

export const loginUser = [
  authenticate("local-login"),
  appendJwtAsCookie,
  async (req, res, next) => {
    res["successfullPost"](req.user);
  },
];

export const logoutUser = [
  removeJwtFromCookies,
  clearSession,
  async (req, res, next) => {
    res["successfullDelete"]();
  },
];

export function authenticate(method) {
  return (req, res, next) => {
    passport.authenticate(method, {
      failWithError: true,
      session: false,
    })(req, res, next);
  };
}



