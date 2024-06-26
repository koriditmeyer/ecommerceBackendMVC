/*
 *
 * IMPORT
 *
 */
import express from "express"; // import express server
import { apiRouter } from "../routers/api/api.router.js"; // import endpoints
import { PassportAutenticacion } from "../middlewares/authentication.js";
import { cookies } from "../middlewares/cookies.js";
import { sessions } from "../middlewares/sessions.js"; // import sessions midelware config
import cors from "cors";
import { CLIENT_ORIGIN } from "../config/config.js";
import { loggerInRequest } from "../middlewares/logger.js";
/*
 *
 * INITIALISE
 *
 */
export const app = express();

/*
 *
 * MIDDLEWARES
 *
 */
const allowedOrigins = [
  process.env.ORIGIN_1,
  process.env.ORIGIN_2
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, //The credentials option tells the browser whether to include cookies and HTTP authentication headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerInRequest)

app.use(cookies); //use cookieParser to create cookies with secret key - placed before the Passport middleware, as Passport might depend on cookies for authentication.
app.use(sessions); // Session - External middleware to handle sessions (need to be before other middleware) or OAuth
app.use(PassportAutenticacion); // External middleware to Initialize Passport and restore authentication state, if any, from the session



app.use("/api", apiRouter);
app.use("/static", express.static("./static")); // Incorporated middleware - images
// app.use("/", webRouter); // External middleware
// Middleware to manage errors
app.use(function (err, req, res, next) {
  res.json({
    status: "error",
    description: "[END] "+err.message,
  });
});
