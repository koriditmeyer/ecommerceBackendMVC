import { Router } from "express";
import { handlerError } from "../../middlewares/handlerError.js";
import { handlerSuccess } from "../../middlewares/handlerSuccess.js";
import { usersRouter } from "./users.router.js";
import { sessionsRouter } from "./sessions.router.js";
import { productsRouter } from "./products.router.js";
import { categoryRouter } from "./category.router.js";
import { cartRouter } from "./cart.router.js";
import { chatRouter } from "./chat.router.js";
import { ticketRouter } from "./ticket.router.js";
import { messageRouter } from "./messages.router.js";
import { logger } from "../../utils/logger/index.js";
import { testRouter } from "./test.router.js";
import swaggerUiExpress from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { NODE_ENV } from "../../config/config.js";

const specs = swaggerJSDoc({
  definition: {
    openapi: "3.0.1",
    info: {
      title: "E-commerce API",
      description: "E-commerce API with MVC",
      version: "1.0",
    },
  },
  apis: ["./docs/**/*.yaml"],
});

export const apiRouter = Router();

// middleware of success for all the sucess in API
apiRouter.use(handlerSuccess);

// * MIDDLEWARE AT ROUTER LEVEL
if(NODE_ENV === "production"){
  apiRouter.use('/docs', (req, res, next) => {
    res.status(404).send("Not Found");
  });
} else{
  apiRouter.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
}
apiRouter.use("/products", productsRouter);
apiRouter.use("/category", categoryRouter);
apiRouter.use("/carts", cartRouter);
apiRouter.use("/sessions", sessionsRouter); // External middleware for sessions
apiRouter.use("/users", usersRouter); // External middleware for users
apiRouter.use("/tickets", ticketRouter);
apiRouter.use("/chat", chatRouter);
apiRouter.use("/messages", messageRouter);
// test router
apiRouter.use("/test", testRouter);
// middleware of error for all the errors in API
apiRouter.use(handlerError);

logger.info("Api router loaded");
