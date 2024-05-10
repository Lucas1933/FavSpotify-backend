import {
  createLogger as createWinstonLogger,
  format,
  transports,
} from "winston";

import {
  MongoDBTransportInstance,
  MongoDBConnectionOptions,
} from "winston-mongodb";
import config from "@src/config";
import { MongoClient } from "mongodb";
const {
  MongoDB,
}: { MongoDB: MongoDBTransportInstance } = require("winston-mongodb");
export default function createLogger(mongoClient: Promise<MongoClient>) {
  const baseFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format((info) => {
      info.level = info.level.toUpperCase();
      return info;
    })()
  );
  const prettyFormat = format.combine(baseFormat, format.prettyPrint());

  const logger = createWinstonLogger();
  logger.add(
    new transports.Console({
      format: prettyFormat,
      level: "info",
    })
  );
  if (config.app.ENV != "developement") {
    logger.add(
      new transports.MongoDB({
        db: mongoClient,
        collection: "logs",
        metaKey: "meta",
        level: "error",
      })
    );
  }
  return logger;
}
