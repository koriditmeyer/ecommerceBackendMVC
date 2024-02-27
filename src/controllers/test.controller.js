import { testServices } from "../services/test.services.js";

export async function getProducts(req, res, next) {
    req.logger.debug("[Controller] getting fake products ");
    const products = await testServices.generateProducts();
    res["successfullGet"](products);
  }

  export async function getUser(req, res, next) {
    req.logger.debug("[Controller] getting fake user ");
    const user = await testServices.generateUser();
    res["successfullGet"](user);
  }


  export async function createErrorLog(req, res, next) {
    req.logger.debug("[Controller] creating Error Log ");
    const log = await testServices.createErrorLog();
    res["successfullPost"](log);
  }
  