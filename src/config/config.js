// @ts-nocheck

// SERVER
export const PORT = parseInt(process.env.PORT);

// CORS
export const CLIENT_ORIGIN = "*"; //http://127.0.0.1:5500";

// PERSITANCE
export const PERSISTENCE = process.env.PERSISTENCE;

// MONGOOSE
export const MONGODB_CNX_STR = process.env.CNX_STR;

// PASSWORD HASH
export const ROUNDS = parseInt(process.env.ROUNDS, 10);

//JWT CONFIGURATION
export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

//JWT COOKIE
export const JWT_COOKIE_SECRET = process.env.JWT_COOKIE_SECRET;
export const JWT_COOKIE_OPTS = {
  signed: true,
  httpOnly: true,
  maxAge: 2 * 24 * 60 * 60 * 1000,
  sameSite: "none", //"strict" | "lax" | "none",
  secure: true, // Important when SameSite=None
};
export const JWT_COOKIE_NAME = "auth";

//SESSION CONFIG
export const SESSION_SECRET = process.env.SESSION_SECRET;

//SESSION COOKIE
export const SESSION_COOKIE_OPTS = {
  secure: true, // Important when SameSite=None
  httpOnly: true,
  sameSite: "none", //"strict" | "lax" | "none"
};

//GITHUB AUTHENTICATION
export const githubAppId = parseInt(process.env.GITHUBAPPID);
export const githubClienteId = process.env.GITHUBCLIENTEID;
export const githubClientSecret = process.env.GITHUBCLIENTSECRET;
export const githubCallbackUrl = process.env.GITHUBCALLBACKURL;

//MULTER MAX PIC UPLOAD
export const maxPicUpload = 10;
