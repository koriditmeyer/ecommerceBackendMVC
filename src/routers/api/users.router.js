import { Router } from "express";
import { authenticate } from "../../controllers/sessions.controller.js";
import { allowedRolesCookie } from "../../middlewares/authorization.js";
import {
  findCurrentUser,
  findAllUsers,
  findUser,
  resetPwdUser,
  updateUser,
  addDocuments,
  addPictureImages,
  userPremium,
  deleteUser,
  deleteUsersByTime,
  updateUsersRoles
} from "../../controllers/users.controller.js";
import tryCatch from "../../middlewares/trycatch.js";

export const usersRouter = Router();

usersRouter.get(
  "/current:populate",
  authenticate("jwt"),
  allowedRolesCookie(["user", "admin"]),
  tryCatch(findCurrentUser)
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
  "/",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  tryCatch(findAllUsers)
);

usersRouter.get(
  "/:id",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  tryCatch(findUser)
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

usersRouter.delete(
  "/delete/:id",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  tryCatch(deleteUser)
);

usersRouter.delete(
  "/delete",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  tryCatch(deleteUsersByTime)
);

usersRouter.put(
  "/roles/:id",
  authenticate("jwt"),
  allowedRolesCookie(["admin"]),
  tryCatch(updateUsersRoles)
);
