import cluster from "node:cluster";
import { app } from "./app/app.js";
import { PORT, NB_PROCS, ACTIVATE_CLUSTER } from "./config/config.js";
import { logger } from "./utils/logger/index.js";

logger.info(`Cluster Process is active: ${ACTIVATE_CLUSTER}`);
if (cluster.isPrimary && ACTIVATE_CLUSTER) {
  logger.info(`Working with ${NB_PROCS} processors`);
  logger.info(`Cluster Process: ${process.pid}`);
  for (let i = 0; i < NB_PROCS; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    logger.error(`${worker.process.pid} just exit`);
    cluster.fork();
  });
} else {
  logger.info(`worker process: ${process.pid}`);
  const httpServer = app.listen(PORT, () => {
    logger.info(`HTTP server listening on port: ${PORT}`);
  });
}

// const io = new Server(httpServer); // Update the server to a socket server