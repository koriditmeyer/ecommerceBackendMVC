// @ts-nocheck
import { cpus } from "node:os"

// CLUSTER
export const NB_PROCS = cpus().length
export const ACTIVATE_CLUSTER = process.env.ACTIVATE_CLUSTER === 'true'

// SERVER
export const PORT = parseInt(process.env.PORT)

//MODE
export const NODE_ENV = process.env.NODE_ENV

// CORS
export const CLIENT_ORIGIN = "http://192.168.1.37:5173";

// PERSITANCE
export const PERSISTENCE = process.env.PERSISTENCE;

// MONGOOSE
export const MONGODB_CNX_STR = process.env.CNX_STR;

// LINK TOKEN EXPRIRATION
export const TOKEN_EXP = 3600000; // 1 hour from now

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

//NODE MAILER CONFIG
export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_PASS = process.env.EMAIL_PASS

//TWILIO CONFIG
export const TWILIO_SID = process.env.TWILIO_SID
export const TWILIO_TOKEN = process.env.TWILIO_TOKEN
export const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER

//USER DEL TIME LIMIT
export const USER_DEL_TIME_LIMIT= 2*24*60*60*1000 //ms