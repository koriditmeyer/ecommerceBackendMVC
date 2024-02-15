import { handlerErrorCustom } from "./handlerErrorCustom.js";
import { handlerErrorMongoose } from "./handlerErrorMongoose.js";

export const handlerError =
  // handlerErrorCustom
  [handlerErrorMongoose, handlerErrorCustom];
