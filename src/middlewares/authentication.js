import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { encrypt } from "../utils/crypto.js";
import {
  JWT_COOKIE_NAME,
  JWT_COOKIE_OPTS,
  JWT_PRIVATE_KEY,
} from "../config/config.js";
import { AuthenticationServerError } from "../models/errors/authentication.error.js";

/**
 *
 * REQUIRED CONFIG
 *
 */
//create cookie
export async function appendJwtAsCookie(req, res, next) {
  try {
    const cookieData = new UserResponseDTO(req.user).toCookie()
    req.logger.debug(
      `[Authentication] Try to set cookie with ${objectToString(cookieData)}`
    );
    let accessToken;
    try {
      accessToken = await encrypt(cookieData);
    } catch (error) {
      throw new AuthenticationServerError();
    }
    req.logger.info(`[Authentication] Setting JWT in cookie: ${accessToken}`); // Log the JWT being set
    res.cookie(JWT_COOKIE_NAME, accessToken, JWT_COOKIE_OPTS);
    next();
  } catch (error) {
    next(error);
  }
}

//delete cookie
export async function removeJwtFromCookies(req, res, next) {
  req.logger.debug("[Authentication] Attempting to clear JWT cookie"); // Log the action of clearing the cookie
  // res.clearCookie("authorization", COOKIE_OPTS); // remove only the JWT from cookie
  if (req.cookies[JWT_COOKIE_NAME]) {
    req.logger.info("[Authentication] JWT cookie found, clearing it.");
    res.clearCookie(JWT_COOKIE_NAME); // Clear the cookie if it exists
  } else {
    req.logger.warning(
      "[Authentication] No JWT cookie found, nothing to clear."
    );
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
      passwordField: "password", // Explicitly specify 'password' field
    },
    async (req, _u, _p, done) => {
      // Asynchronous callback function for the strategy
      try {
        req.logger.debug("[Passport] local-register strategy");
        const user = req.body;
        const userData = await sessionsServices.registerLocal(user); // Calls User model's register method with the request body
        req.logger.info(
          "[Passport] local-register strategy returns User:",
          userData
        );
        done(null, userData); // method of passport done(null, userData)= (no error, return userData)
      } catch (error) {
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
    async (email, password, done) => {
      try {
        logger.debug("[Passport] local-login strategy");
        const userData = await sessionsServices.login({ email, password });
        logger.info(
          "[Passport] local-login strategy returns, logged-in User Data:",
          userData
        );
        done(null, userData);
      } catch (error) {
        done(error);
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
        req.logger.error("[Authentication] Session destruction error:", err);
        next(err); // Pass the error to error handling middleware
      } else {
        req.logger.info("[Authentication] clearing cookie connect.sid");
        res.clearCookie("connect.sid"); // Clear the session cookie
        next(); // Proceed to the next middleware
      }
    });
  } else {
    req.logger.error("[Authentication] no session to destroy");
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
              req.logger.info(
                `[Passport] Enter Passport JWT, Extracted Token:${token}`
              ); // Log the extracted token
            }
            return token;
          },
        ]),
        // @ts-ignore
        secretOrKey: JWT_PRIVATE_KEY,
      },
      function loginUser(user, done) {
        return done(null, user);
      }
    )
  );


// Passport Github Strategy for Registering Users
import { Strategy as GithubStrategy } from "passport-github2";
import {
  githubCallbackUrl,
  githubClientSecret,
  githubClienteId,
} from "../config/config.js";
import { userServices } from "../services/user.services.js";
import { objectToString } from "../utils/objectToString.js";
import { logger } from "../utils/logger/index.js";
import { UserResponseDTO } from "../daos/dtos/user.dto.js";

passport.use(
  "github",
  // @ts-ignore
  new GithubStrategy(
    {
      clientID: githubClienteId,
      clientSecret: githubClientSecret,
      callbackURL: githubCallbackUrl,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        logger.debug(`[Passport] Github strategy`);
        // search first if user exist in DB
        let user = await userServices.findOneEmail(profile.emails[0].value);
        if (!user) {
          logger.debug(
            `[Passport] Github user doesn't exist , creating profile`
          );
          let userEmail = profile.username; // Default to username
          if (profile.emails && profile.emails.length > 0) {
            userEmail = profile.emails[0].value; // Use email if available
          }
          const userDB = {
            email: userEmail,
            password: "NA",
            name: profile.displayName || profile.username || "NA",
            last_name: "NA",
            provider: profile.provider,
            providerId: profile.id, // Storing GitHub ID
            profilePhoto: profile.photos[0].value || "",
          };
          // Create a new user if not exists
          user = await sessionsServices.registerAuth(userDB);
        }
        logger.debug(`[Passport] Github strategy return ${user}`);
        return done(null, user);
      } catch (error) {
        done(error);
      }
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
    req.logger.debug("[Passport] Initialised with session");
    // next()
  });
}
