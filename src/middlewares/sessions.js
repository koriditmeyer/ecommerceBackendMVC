import {
  SESSION_COOKIE_OPTS,
  SESSION_SECRET,
} from "../config/config.js"; // import constants configuration parameters in external file
import session from "express-session"; // import session (enable sessions creation with cookies)

/*
 *
 * MIDDLEWARES
 *
 */

export const sessions = session({
  // use session midelware
  // store, // with OAuth don't need connexion to DB
  secret: SESSION_SECRET,
  resave: true, // Allow to maintain session alive
  saveUninitialized: true,
  cookie: SESSION_COOKIE_OPTS,
});
