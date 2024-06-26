import { createLogger, format, transports } from "winston";
import path from "path";

const logFormat = format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: (${message}) ${stack || message}`;
});

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.splat(),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join("logs", "error.log"), level: "error" }),
        new transports.File({ filename: path.join("logs", "combined.log") }),
    ],
    exceptionHandlers: [new transports.File({ filename: path.join("logs", "exceptions.log") })],
});

export default logger;
