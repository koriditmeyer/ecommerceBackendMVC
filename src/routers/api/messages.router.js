import { Router } from "express";
import { allowedRolesCookie } from "../../middlewares/authorization.js";
import { authenticate } from "../../controllers/sessions.controller.js";
import { sendMail, sendSMS } from "../../controllers/messages.controller.js";

export const messageRouter = Router();

messageRouter.post(
  "/email",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  sendMail
);

messageRouter.post(
  "/sms",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  sendSMS
);