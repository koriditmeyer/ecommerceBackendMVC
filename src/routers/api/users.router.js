import { Router } from "express";
import { authenticate } from "../../controllers/sessions.controller.js";
import { allowedRoles } from "../../middlewares/authorization.js";
import {
  findUser,
  findUsers,
  resetPwdUser,
} from "../../controllers/users.controller.js";

export const usersRouter = Router();

usersRouter.get(
  "/current:populate",
  authenticate("jwt"),
  allowedRoles(["user", "admin"]),
  findUser
);
usersRouter.put(
  "/current",
  authenticate("jwt"),
  allowedRoles(["user", "admin"]),
  resetPwdUser
);
usersRouter.get(
  "/:id",
  authenticate("jwt"),
  allowedRoles(["admin"]),
  findUsers
);
