import { userServices } from "../services/user.services.js";

export async function findUser(req, res, next) {
    const populate = req.params.populate;
    const id = req.user._id;
    req.logger.debug("[Controller] got current user to search with " + id+ " populate ="+populate);
    let user;
    if (!populate) {
      user = await userServices.findOne(id);
    } else {
      user = await userServices.findOnePopulate(id);
    }
    res["successfullGet"](user);
}

export async function findUsers(req, res, next) {
    if (req.params.id) {
      let id = req.params.id;
      req.logger.debug("[Controller] got user to search with " + id);
      const user = await userServices.findOne(id);
      res["successfullGet"](user);
    } else {
      req.logger.debug("[Controller] got all users to search");
      const users = await userServices.findMany(req.query);
      res["successfullGet"](users);
    }
}

export async function resetPwdUser(req, res, next) {
    const _id = req.user._id;
    const { password } = req.body;
    req.logger.debug("[Controller] got to reset password for user id:"+_id);
    const userUpdated = await userServices.resetPassword(_id, password);
    res["successfullPut"](userUpdated);
}

export async function updateUser(req, res, next) {
  const userData = req.body
  const id = req.user._id;
  req.logger.debug("[Controller] got to updateUser for user id:"+id+"and new data"+userData);
  const userUpdated = await userServices.updateUser(id,userData);
  res["successfullPut"](userUpdated);
}