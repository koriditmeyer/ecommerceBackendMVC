import { Router } from "express";
import { authenticate } from "../../controllers/sessions.controller.js";
import { allowedRolesCookie } from "../../middlewares/authorization.js";
import {
  findUser,
  findUsers,
  resetPwdUser,
  updateUser,
  addDocuments,
  addPictureImages,
  userPremium
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
  "/currentPwd",
  authenticate("jwt"),
  allowedRolesCookie(["user", "admin"]),
  tryCatch(resetPwdUser)
);

usersRouter.put(
  "/current",
  authenticate("jwt"),
  allowedRolesCookie(["user", "admin"]),
  tryCatch(updateUser)
);

usersRouter.put(
  "/:id/thumbnailUrl",
  authenticate("jwt"),
  allowedRolesCookie(["user","admin"]),
  addPictureImages
);

usersRouter.get(
  "/:id",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  tryCatch(findUsers)
);

usersRouter.put(
  "/:id/documents",
  authenticate("jwt"),
  allowedRolesCookie(["user","admin"]),
  addDocuments
);

usersRouter.put(
  "/premium/:id",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  userPremium
);