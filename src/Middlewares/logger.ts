import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { createLogger, format, transports } from "winston";

export const logToFile = createLogger({
  transports: [
    new transports.File({
      //   json: true,
      maxFiles: 5,
      level: "info",
      //   colorize: true,
      filename: `logs/error.log`,
      maxsize: 52000000, // 52MB
    }),
  ],
});

const logFormatter = format.printf((info) => {
  const { timestamp, level, stack, message } = info;
  const errorMessage = stack || message;
  return `${timestamp} ${level}: ${errorMessage}`;
});

export const logToConsole = createLogger({
  level: "info",
  format: format.errors({ stack: true }),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.timestamp(),
        logFormatter
      ),
    }),
  ],
});

export async function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("--------- req.body logging ---------------");
  console.log(req.body);

  const requestLog: any = {
    date: new Date(),
    logType: "REQUEST_LOG",
    env: process.env.NODE_ENV,
    level: "info",
    api: req.url,
    method: req.method,
    body: req.body,
    client: req.ip,
  };
  logToFile.log(requestLog);
  console.log("(requestLog)------------------");
  console.log(chalk.redBright(JSON.stringify(requestLog)));
  next();
}
