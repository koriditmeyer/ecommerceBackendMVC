import { Router } from "express";

import { allowedRolesCookie } from "../../middlewares/authorization.js";
import { authenticate } from "../../controllers/sessions.controller.js";
import {
  getTicket,
  getUserTickets,
} from "../../controllers/ticket.controller.js";
import tryCatch from "../../middlewares/trycatch.js";

export const ticketRouter = Router();

ticketRouter.get(
  "/user/:id",
  authenticate("jwt"),
  allowedRolesCookie(["user", "admin"]),
   tryCatch(getUserTickets)
);

ticketRouter.get(
  "/:tid",
  authenticate("jwt"),
  allowedRolesCookie(["user", "admin"]),
   tryCatch(getTicket)
);
