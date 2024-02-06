import { Router } from "express";
import { authenticate } from "../../controllers/sessions.controller.js";
import { allowedRolesCookie } from "../../middlewares/authorization.js";
import {
  findUser,
  findUsers,
  resetPwdUser,
} from "../../controllers/users.controller.js";

export const usersRouter = Router();

usersRouter.get(
  "/current:populate",
  authenticate("jwt"),
  allowedRolesCookie(["user", "admin"]),
  findUser
);
usersRouter.put(
  "/current",
  authenticate("jwt"),
  allowedRolesCookie(["user", "admin"]),
  resetPwdUser
);
usersRouter.get(
  "/:id",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  findUsers
);
