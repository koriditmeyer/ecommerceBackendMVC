import multer from "multer";
import { uploadFile } from "../middlewares/multer.js";
import { multerErrorHandler } from "../middlewares/multerErrorHandler.js";
import { userServices } from "../services/user.services.js";
import { appendJwtAsCookie } from "../middlewares/authentication.js";

export async function findCurrentUser(req, res, next) {
  const populate = req.params.populate;
  const id = req.user._id;
  req.logger.debug(
    "[Controller] got current user to search with " +
      id +
      " populate =" +
      populate
  );
  let user;
  if (populate) {
    user = await userServices.findOnePopulate(id);
  } else {
    user = await userServices.findOne(id);
  }
  res["successfullGet"](user);
}

export async function findAllUsers(req, res, next) {
    req.logger.debug("[Controller] got all users to search");
    const users = await userServices.findMany(req.query);
    res["successfullGet"](users);
}

export async function findUser(req, res, next) {
    let id = req.params.id;
    req.logger.debug("[Controller] got user to search with " + id);
    const user = await userServices.findOne(id);
    res["successfullGet"](user);
}

export async function resetPwdUser(req, res, next) {
  const _id = req.user._id;
  const { password } = req.body;
  //console.log(req.body);
  req.logger.debug("[Controller] got to reset password for user id:" + _id);
  const userUpdated = await userServices.resetPassword(_id, password);
  res["successfullPut"](userUpdated);
}

export async function updateUser(req, res, next) {
  const userData = req.body;
  const id = req.user._id;
  req.logger.debug(
    "[Controller] got to updateUser for user id:" +
      id +
      "and new data" +
      userData
  );
  const userUpdated = await userServices.updateUser(id, userData);
  res["successfullPut"](userUpdated);
}

export const addPictureImages = [
  uploadFile(
    "img/profiles",
    ["image/jpeg", "image/png", "image/webp"],
    5, //in Mb
    "thumbnail",
    1
  ),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const newImages = req.files;
      req.logger.debug("[Controller] got id: " + id);
      req.logger.debug("[Controller] got new files");
      const updatedUser = await userServices.updateImage(id, newImages);
      res["successfullPut"](updatedUser);
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  },
];

export const addDocuments = [
  uploadFile(
    "documents",
    ["application/pdf"],
    25, //in Mb
    "documents",
    3
  ),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const newDocuments = req.files;
      req.logger.debug("[Controller] got id: " + id);
      req.logger.debug("[Controller] got new files");
      const updatedUser = await userServices.updateDocuments(id, newDocuments);
      res["successfullPut"](updatedUser);
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  },
];

export const userPremium = [
  async (req, res, next) => {
    try {
      const id = req.params.id
      req.logger.debug(
        "[Controller] got to userPremium for user id:" +
          id
      );
      req.user = await userServices.userPremium(id);
      next()
    } catch (error) {
      next(error);
    }
  },
  appendJwtAsCookie,
  async (req, res, next) => {
    res["successfullPost"](req.user);
  },
];

export async function deleteUser(req, res, next) {
  const id = req.params.id;
  req.logger.debug(
    "[Controller] got to deleteUser "+id);
  const userDeleted = await userServices.deleteUser(id);
  res["successfullDelete"](userDeleted);
}


export async function deleteUsersByTime(req, res, next) {
  req.logger.debug(
    "[Controller] got to deleteUsersByTime");
  const userDeleted = await userServices.deleteUsersByTime();
  res["successfullDelete"](userDeleted);
}



export async function updateUsersRoles(req, res, next) {
  const userData = req.body;
  const id = req.params.id;
  req.logger.debug(
    "[Controller] got to updateUsersRoles for user id:" +
      id +
      "and new data" +
      userData
  );
  const userUpdated = await userServices.updateUsersRoles(id, userData);
  res["successfullPut"](userUpdated);
}