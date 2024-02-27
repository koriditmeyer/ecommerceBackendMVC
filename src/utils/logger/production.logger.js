import { createLogger, format, transports } from "winston";
const { combine, timestamp, json } = format;

// Define custom log levels
const customLevels = {
  levels: {
    fatal: 0, // Most important
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5, // Least important
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};


const productionLogger = () => {
  return createLogger({
    levels: customLevels.levels, // Use custom levels
    level: "debug",  // Set the lowest level of logs I want to see
    // format: winston.format.simple(),
    format: combine(
      timestamp(),
      json()
    ),
    defaultMeta: { service: "Ecommerce" },
    transports: [
      new transports.Console(),
      new transports.File({
        filename: "errors.log",
        level: 'warning', // if want to log only error and above to the file
      }),
    ],
  });
};
export { productionLogger };
