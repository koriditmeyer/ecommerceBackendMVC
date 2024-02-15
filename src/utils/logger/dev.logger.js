import  { createLogger, format, transports, addColors } from "winston";
const { combine, timestamp, label, printf } = format;

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
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

const devLogger = () => {
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  return createLogger({
    levels: customLevels.levels, // Use custom levels
    level: "info",
    // format: winston.format.simple(),
    format: combine(
      format.colorize(),
      label({ label: "EcommerceBackend" }),
      timestamp({ format: "HH:mm:ss" }),
      myFormat
    ),
    //defaultMeta: { service: 'user-service' },
    transports: [
      new transports.Console(),
      // new transports.File({
      //   filename: "errors.log",
      // }),
    ],
  });
};

// Optionally, apply the colors to Winston (if you're using colorize)
addColors(customLevels.colors);

export { devLogger };
