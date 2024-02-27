import { MONGODB_CNX_STR } from "../config/config.js"; // import constants configuration parameters in external file
import mongoose from "mongoose"; // import Mongoose
import { logger } from "../utils/logger/index.js";

export async function connectDb() {
  await mongoose.connect(MONGODB_CNX_STR);
  logger.info(`DB connected to ${MONGODB_CNX_STR}`);
}
