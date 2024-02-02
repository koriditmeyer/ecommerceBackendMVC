import { app } from "./app/app.js";
import { PORT } from "./config/config.js";

const httpServer = app.listen(PORT, () => {
  console.log(`HTTP server listening on port: ${PORT}`);
});
// const io = new Server(httpServer); // Update the server to a socket server