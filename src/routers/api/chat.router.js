import { Router } from "express";

import { allowedRoles } from "../../middlewares/authorization.js";
import { authenticate } from "../../controllers/sessions.controller.js";
import {sendMessages} from "../../controllers/chat.controller.js"

export const chatRouter = Router();

chatRouter.post(
    "/",
    authenticate("jwt"),
    allowedRoles(["user"]),
    sendMessages
  );