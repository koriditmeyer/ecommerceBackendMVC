import { objectToString } from "../utils/objectToString.js";

export function handlerSuccess(req, res, next) {
  res["successfullGet"] = (payload) => {
    req.logger.info(`[Success] - successfullGet ${objectToString(payload)}`);
    // setTimeout(() => {
      res.json({
        status: "success",
        payload,
      });
    // }, 3000);
  };
  res["successfullPost"] = (payload) => {
    req.logger.info(`[Success] - successfullPost ${objectToString(payload)}`);
    res.status(201).json({
      status: "success",
      payload,
    });
  };
  res["successfullPut"] = (payload) => {
    req.logger.info(`[Success] - successfullPut ${objectToString(payload)}`);
    res.json({
      status: "success",
      payload,
    });
  };
  res["successfullDelete"] = (payload) => {
    req.logger.info(`[Success] - successfullDelete ${objectToString(payload)}`);
    res.json({
      status: "success",
      payload,
    });
  };
  next();
}
