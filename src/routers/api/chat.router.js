import { Router } from "express";

import { allowedRolesCookie } from "../../middlewares/authorization.js";
import { authenticate } from "../../controllers/sessions.controller.js";
import {sendMessages} from "../../controllers/chat.controller.js"
import tryCatch from "../../middlewares/trycatch.js";

export const chatRouter = Router();

chatRouter.post(
    "/",
    authenticate("jwt"),
    allowedRolesCookie(["user"]),
    tryCatch(sendMessages)
  );