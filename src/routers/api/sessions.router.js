import { Router } from "express";
import {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  authenticateOAuth,
  callbackUserGitHub,
  loginUserGitHub,
} from "../../controllers/sessions.controller.js";
import tryCatch from "../../middlewares/trycatch.js";

export const sessionsRouter = Router();

sessionsRouter.post("/register", ...registerUser);
sessionsRouter.get("/verify", ...verifyUser);
sessionsRouter.post("/login", ...loginUser);
sessionsRouter.delete("/logout", ...logoutUser);
//github
sessionsRouter.get("/githublogin", ...loginUserGitHub);
sessionsRouter.get("/githubcallback", ...callbackUserGitHub);
