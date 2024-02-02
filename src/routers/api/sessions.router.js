import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../../controllers/sessions.controller.js";

export const sessionsRouter = Router();

console.log("router");

sessionsRouter.post("/register", ...registerUser);
sessionsRouter.post("/login", ...loginUser);
sessionsRouter.delete("/logout", ...logoutUser);

