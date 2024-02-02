import { Router} from "express";
import { handlerError } from "../../middlewares/handlerError.js";
import { handlerSuccess } from "../../middlewares/handlerSuccess.js";
import { usersRouter } from "./users.router.js";
import { sessionsRouter } from "./sessions.router.js";
import { productsRouter } from "./products.router.js";
import { cartRouter } from "./cart.router.js";

export const apiRouter = Router();

// middleware of success for all the sucess in API
apiRouter.use(handlerSuccess);

// * MIDDLEWARE AT ROUTER LEVEL
apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartRouter);
apiRouter.use("/sessions", sessionsRouter); // External middleware for sessions
apiRouter.use("/users", usersRouter); // External middleware for users

// middleware of error for all the errors in API
apiRouter.use(handlerError);