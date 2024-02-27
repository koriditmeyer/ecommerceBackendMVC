import passport from "passport";
import {
  appendJwtAsCookie,
  clearSession,
  removeJwtFromCookies,
} from "../middlewares/authentication.js";
import { IncorrectDataError } from "../models/errors/incorrectData.error.js";
import { sessionsServices } from "../services/sessions.services.js";

// Express, middleware functions need to be listed in an array or 
// passed as separate arguments to the route handler.
export const registerUser =[
  validateRegistrationData,
  authenticate("local-register"),
  async (req, res, next) => {
    res["successfullPost"](req.user)
  }
]

export const verifyUser = [
  async (req, res, next) => {
    const { email, token } = req.query
    const decodedEmail = decodeURIComponent(email);
   try {
     req.user =await sessionsServices.verify(token, decodedEmail) // Attach the user to the request object
     next()
   } catch (error) {
    next(error)
   }
  },
  appendJwtAsCookie,
  async (req, res, next) => {
    res["successfullGet"](req.user);
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

export const loginUserGitHub = [
  authenticateOAuth("github"),
  async (req, res, next) => {
    res["successfullPost"](req.user);
  },
]

export const callbackUserGitHub = [
  authenticateOAuth("github"),
  appendJwtAsCookie,
  async (req, res, next) => {
    res["successfullPost"](req.user);
  },
];

// Functions ----------------------
function validateRegistrationData(req, res, next) {
  const { email, password } = req.body;
  // Check for the presence of email and password
  if (!email || !password) {
    return next(new IncorrectDataError('Email and password are required.')) 
  }
  next(); // Proceed to Passport authentication if validation passes
}


export function authenticate(method) {
  return (req, res, next) => {
    passport.authenticate(method,{
      failWithError: true,
      session: false
    })(req, res, next);
  };
}

export function authenticateOAuth(method) {
  return (req, res, next) => {
    passport.authenticate(method,{ scope: ["user:email"] })(req, res, next);
  };
}




