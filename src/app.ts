import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import SpotifyAuthRouter from "./routes/auth/spotify/SpotifyAuthRouter";
import {} from "../types";
import { CustomError } from "./utils/errors/SpotifyAuthRouterError";
import { INTERNAL_SERVER_ERROR } from "./utils/http_status_code";
import UserRouter from "./routes/user/UserRouter";
import authMiddleware from "./utils/middleware/auth";
import MongoStore from "connect-mongo";
import SearchRouter from "./routes/search/SearchRouter";

dotenv.config();
const app = express();
const port = process.env.PORT;
const spotifyAuthRouter = new SpotifyAuthRouter();
const userRouter = new UserRouter();
const searchRouter = new SearchRouter();

app.use(
  session({
    secret: process.env.COOKIE_SESSION_SECRET as string,
    name: "session",
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 3600 * 1000,
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL as string }),
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  "/favspotify/api/auth",
  authMiddleware("NO_AUTHENTICATED"),
  spotifyAuthRouter.getRouter()
);
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
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
