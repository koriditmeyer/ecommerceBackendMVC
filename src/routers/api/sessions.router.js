import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  authenticateOAuth,
  callbackUserGitHub,
  loginUserGitHub,
} from "../../controllers/sessions.controller.js";

export const sessionsRouter = Router();

console.log("router");

sessionsRouter.post("/register", ...registerUser);
sessionsRouter.post("/login", ...loginUser);
sessionsRouter.delete("/logout", ...logoutUser);
//github
sessionsRouter.get("/githublogin", ...loginUserGitHub);
sessionsRouter.get("/githubcallback", ...callbackUserGitHub);
