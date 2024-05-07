import "module-alias/register";

import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import config from "./config";

import SpotifyAuthRouter from "@routes/auth/spotify/SpotifyAuthRouter";
import UserRouter from "@routes/user/UserRouter";
import SearchRouter from "@routes/search/SearchRouter";
import RegisterRouter from "@routes/register/RegisterRouter";
import authMiddleware from "@utils/middleware/auth";
import connectToDatabase from "@repository/mongo_connection";

import { CustomError } from "./utils/errors/SpotifyAuthRouterError";
import { INTERNAL_SERVER_ERROR } from "./utils/http_status_code";
import {} from "../types";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow only GET and POST requests
    allowedHeaders: ["Content-Type", "Authorization"], // Allow only specific headers
    credentials: true,
  })
);
const port = config.app.PORT;
const spotifyAuthRouter = new SpotifyAuthRouter();
const userRouter = new UserRouter();
const searchRouter = new SearchRouter();
const registerRouter = new RegisterRouter();

app.use(
  session({
    secret: config.secret.COOKIE_SESSION_SECRET as string,
    name: "session",
    cookie: {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      secure: false,
      maxAge: 3600 * 1000,
    },
    store: MongoStore.create({ mongoUrl: config.mongo.URL as string }),
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
  console.log(err);
  if (err instanceof CustomError) {
    /* TODO logger implementation */
    res
      .status(err.getStatusCode())
      .send({ message: err.message, status: err.getStatusCode() });
  } else {
    /* TODO logger implementation */
    res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "Something went wrong", status: INTERNAL_SERVER_ERROR });
  }
});
app.listen(port, async () => {
  await connectToDatabase();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
