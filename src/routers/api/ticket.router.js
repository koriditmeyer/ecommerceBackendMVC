import { Router } from "express";

import { allowedRoles } from "../../middlewares/authorization.js";
import { authenticate } from "../../controllers/sessions.controller.js";
import {
  getTicket,
  getUserTickets,
} from "../../controllers/ticket.controller.js";

export const ticketRouter = Router();

ticketRouter.get(
  "/user/:id",
  authenticate("jwt"),
  allowedRoles(["user", "admin"]),
  getUserTickets
);

ticketRouter.get(
  "/:tid",
  authenticate("jwt"),
  allowedRoles(["user", "admin"]),
  getTicket
);
