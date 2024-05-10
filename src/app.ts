import "module-alias/register";
import {} from "../types";

import express, { NextFunction, Request, Response } from "express";
import session from "express-session";

import cors from "cors";
import config from "./config";

import SpotifyAuthRouter from "@routes/auth/spotify/SpotifyAuthRouter";
import UserRouter from "@routes/user/UserRouter";
import SearchRouter from "@routes/search/SearchRouter";
import RegisterRouter from "@routes/register/RegisterRouter";

import authMiddleware from "@utils/middleware/auth";
import createLogger from "@utils/logger";
import getDate from "@utils/getDate";
import { CustomError } from "@utils/errors/CustomError";
import { INTERNAL_SERVER_ERROR } from "@utils/http_status_code";

import connectToDatabase from "@repository/mongo_connection";
import MongoStore from "connect-mongo";
import { MongoClient } from "mongodb";

const app = express();
const mongoClient = connectToDatabase() as Promise<MongoClient>;
const logger = createLogger(mongoClient);
const spotifyAuthRouter = new SpotifyAuthRouter();
const userRouter = new UserRouter();
const searchRouter = new SearchRouter();
const registerRouter = new RegisterRouter();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  session({
    secret: config.secret.COOKIE_SESSION_SECRET as string,
    name: "session",
    cookie: {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      secure: config.app.ENV != "developement",
      maxAge: 3600 * 1000,
    },
    store: MongoStore.create({
      clientPromise: mongoClient,
    }),
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  "/favspotify/api/auth",
  authMiddleware("NO_AUTHENTICATED"),
  spotifyAuthRouter.getRouter()
);
app.use("/favspotify/api/register", registerRouter.getRouter());
app.use(
  "/favspotify/api/user",
  authMiddleware("PRIVATE"),
  userRouter.getRouter()
);
app.use(
  "/favspotify/api/search",
  authMiddleware("PRIVATE"),
  searchRouter.getRouter()
);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    logger.error(err.message, {
      meta: {
        errorName: err.name,
        errorCode: err.getErrorCode(),
        statusCode: err.getStatusCode(),
        timestamp: err.getTimestamp(),
        additionalData: err.getAdditionalData(),
        errorStackTrace: err.stack,
      },
    });
    res
      .status(err.getStatusCode())
      .send({ message: err.message, status: err.getStatusCode() });
  } else {
    const unknownError = err as Error;
    logger.error(unknownError.message, {
      meta: {
        errorName: unknownError.name || "UnknownError",
        timestamp: getDate(),
        errorStackTrace: unknownError.stack,
        additionalData: { url: req.url },
      },
    });
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "Something went wrong", status: INTERNAL_SERVER_ERROR });
  }
});

app.listen(config.app.PORT, async () => {
  logger.info(
    `[server]: Server is running at http://localhost:${config.app.PORT}`
  );
});
