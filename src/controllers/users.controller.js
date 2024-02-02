import { userServices } from "../services/user.services.js";

export async function findUser(req, res, next) {
  try {
    const populate = req.params.populate;
    const _id = req.user._id;
    let user;
    if (populate == false) {
      user = await userServices.findOne(_id);
    } else {
      user = await userServices.findOnePopulate(_id);
    }
    res["successfullGet"](user);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}

export async function findUsers(req, res, next) {
  try {
    if (req.params.id) {
      let id = req.params.id;
      const user = await userServices.findOne(id);
      res["successfullGet"](user);
    } else {
      const users = await userServices.findMany(req.query);
      res["successfullGet"](users);
    }
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}

export async function resetPwdUser(req, res, next) {
  try {
    const _id = req.user._id;
    const { password } = req.body;
    const userUpdated = await userServices.resetPassword(_id, password);
    res["successfullPut"](userUpdated);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
}
