import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import handleInitialAuthorization from "./middleware/handle_initial_authorization";
import SpotifyAuthRouter from "./routes/auth/spotify/SpotifyAuthRouter";
import {} from "../types";
import { CustomError } from "./utils/errors/SpotifyAuthRouterError";
import { INTERNAL_SERVER_ERROR } from "./utils/http_status_code";

dotenv.config();
const app = express();
const port = process.env.PORT;
const spotifyAuthRouter = new SpotifyAuthRouter();

app.use(handleInitialAuthorization);
app.use(
  session({
    secret: process.env.COOKIE_SESSION_SECRET as string,
    name: "session",
    cookie: {
      /* path: "/favspotify/api/auth", */
      path: "/",
      httpOnly: true,
      secure: false,
    },
    saveUninitialized: false,
    resave: false,
  })
);
app.use("/favspotify/api/auth", spotifyAuthRouter.getRouter());
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
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
