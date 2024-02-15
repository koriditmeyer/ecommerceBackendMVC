import { Router } from "express";
import {
  createErrorLog,
  getProducts,
  getUser,
} from "../../controllers/test.controller.js";

export const testRouter = Router();

testRouter.get("/products", getProducts);

testRouter.get("/user", getUser);

testRouter.post("/ErrorLog", createErrorLog);

testRouter.get("/health", (req, res) => {
  res.send(`Process #${process.pid}`);
});
