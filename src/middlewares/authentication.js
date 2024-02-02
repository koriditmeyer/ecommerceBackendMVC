import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { encrypt } from "../utils/crypto.js";
import { JWT_COOKIE_NAME, JWT_COOKIE_OPTS, JWT_PRIVATE_KEY } from "../config/config.js";
import {  AuthenticationServerError } from "../models/errors/authentication.error.js";

/**
 *
 * REQUIRED CONFIG
 *
 */
//create cookie
export async function appendJwtAsCookie(req, res, next) {
  try {
    console.log(`Try to set cookie with ${req.user}`)
    console.log(req.user)
    let accessToken
    try {
      accessToken = await encrypt(req.user);
    } catch (error) {
      throw new AuthenticationServerError();
    }
    console.log("Setting JWT in cookie:", accessToken); // Log the JWT being set
    res.cookie(JWT_COOKIE_NAME, accessToken, JWT_COOKIE_OPTS);
    next();
  } catch (error) {
    next(error);
  }
}

//delete cookie
export async function removeJwtFromCookies(req, res, next) {
  console.log("Attempting to clear JWT cookie"); // Log the action of clearing the cookie
  // res.clearCookie("authorization", COOKIE_OPTS); // remove only the JWT from cookie
  if (req.cookies[JWT_COOKIE_NAME]) {
    console.log("JWT cookie found, clearing it.");
    res.clearCookie(JWT_COOKIE_NAME); // Clear the cookie if it exists
  } else {
    console.log("No JWT cookie found, nothing to clear.");
  }
  next();
}


/**
 *
 * MY PASSPORT STRATEGIES
 *
 */
import { Strategy as LocalStrategy } from "passport-local";
import { sessionsServices } from "../services/sessions.services.js";

//register user
passport.use(
  "local-register",
  new LocalStrategy(
    {
      passReqToCallback: true, // Tells Passport to pass the entire request to the callback
      usernameField: "email", // Specifies that the email field will be used as the username
    },
    async (req, _u, _p, done) => {
      // Asynchronous callback function for the strategy
      console.log("authentication");
      try {
        // const createUserDto = new CreateUserDTO(req.body)
        // console.log(createUserDto)
        const userData = await sessionsServices.register(req.body, true); // Calls User model's register method with the request body
        console.log("Registered User Data:", userData);
        done(null, userData); // method of passport done(null, userData)= (no error, return userData)
      } catch (error) {
          console.error("Registration Error:", error.message);
          done(error); // method of passport done(null, false, error.message)= (error, don't return userData, return error)
      }
    }
  )
);

// login user
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password,done) => {
      try {
        const userData = await sessionsServices.login({email, password});
        done(null, userData);
      } catch (error) {
        done(error)
      }
    }
  )
);

// logout user
export function clearSession(req, res, next) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        // Handle error case
        console.error("Session destruction error:", err);
        next(err); // Pass the error to error handling middleware
      } else {
        console.log("clearing cookie connect.sid");
        res.clearCookie("connect.sid"); // Clear the session cookie
        next(); // Proceed to the next middleware
      }
    });
  } else {
    console.log("no session to destroy")
    next(); // No session to destroy, proceed to next middleware
  }
}

//use passport jwt strategy to confirm logged in User
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        function (req) {
          let token = null;
          if (req?.signedCookies) {
            token = req.signedCookies[`${JWT_COOKIE_NAME}`];
            console.log("Extracted Token:", token); // Log the extracted token
          }
          return token;
        },
      ]),
      secretOrKey: JWT_PRIVATE_KEY,
    },
    function loginUser(user, done) {
      console.log("User loaded in JWT Strategy:", user); // Log the user object
      done(null, user);
    }
  )
);

/**
 *
 * Serialization and Deserialization - use with session or with OAuth
 *
 */

passport.serializeUser((user, next) => {
  next(null, user); // Serializes the user object to the session
});
passport.deserializeUser((user, next) => {
  next(null, user); // Deserializes the user object from the session
});

/**
 *
 * Passport Initialization Middleware
 *
 */

const passportInitialize = passport.initialize(); // Initializes Passport
const passportSession = passport.session(); // Connects Passport to the session

export function PassportAutenticacion(req, res, next) {
  passportInitialize(req, res, () => {
    // Middleware to initialize Passport
    passportSession(req, res, next); // Middleware to handle Passport sessions session or with OAuth
    // console.log("Passport Initialised with session");
    // next()
  });
}
