import cluster from "node:cluster";
import { app } from "./app/app.js";
import { PORT, NB_PROCS } from "./config/config.js";
import { logger } from "./utils/logger/index.js";


if (cluster.isPrimary) {
  console.log(`Cluster Process: ${process.pid}`);
  console.log(`Working with ${NB_PROCS} processors`);
  for (let i = 0; i < NB_PROCS; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`${worker.process.pid} just exit`);
    cluster.fork();
  });
} else {
  console.log(`worker process: ${process.pid}`);
  const httpServer = app.listen(PORT, () => {
    logger.info(`HTTP server listening on port: ${PORT}`);
  });
}

// const io = new Server(httpServer); // Update the server to a socket server