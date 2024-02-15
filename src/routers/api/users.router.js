import { Router } from "express";
import { authenticate } from "../../controllers/sessions.controller.js";
import { allowedRolesCookie } from "../../middlewares/authorization.js";
import {
  findUser,
  findUsers,
  resetPwdUser,
} from "../../controllers/users.controller.js";
import tryCatch from "../../middlewares/trycatch.js";

export const usersRouter = Router();

usersRouter.get(
  "/current:populate",
  authenticate("jwt"),
  allowedRolesCookie(["user", "admin"]),
  tryCatch(findUser)
);
usersRouter.put(
  "/current",
  authenticate("jwt"),
  allowedRolesCookie(["user", "admin"]),
  tryCatch(resetPwdUser)
);
usersRouter.get(
  "/:id",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  tryCatch(findUsers)
);
