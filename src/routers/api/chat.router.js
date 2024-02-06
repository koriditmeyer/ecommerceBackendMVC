import { Router } from "express";

import { allowedRolesCookie } from "../../middlewares/authorization.js";
import { authenticate } from "../../controllers/sessions.controller.js";
import {sendMessages} from "../../controllers/chat.controller.js"

export const chatRouter = Router();

chatRouter.post(
    "/",
    authenticate("jwt"),
    allowedRolesCookie(["user"]),
    sendMessages
  );