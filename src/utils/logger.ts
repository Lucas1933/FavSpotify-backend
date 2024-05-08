import winston from "winston";
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
  if (config.app.ENV == "developements") {
    const logger = winston.createLogger({
      level: "info",
    });
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
    return logger;
  } else {
    const logger = winston.createLogger();
    logger.add(
      new winston.transports.MongoDB({
        db: mongoClient,
        collection: "logs",
        format: winston.format.json(),
        level: "error",
      })
    );
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
        level: "info",
      })
    );
    return logger;
  }
}
