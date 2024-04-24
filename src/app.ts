import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongo_connection";
import SpotifyAuthRouter from "./routes/auth/spotify/SpotifyAuthRouter";
import {} from "../types";
dotenv.config();
const app = express();
const port = process.env.PORT;
const spotifyAuthRouter = new SpotifyAuthRouter();

app.use(
  session({
    secret: process.env.COOKIE_SESSION_SECRET as string,
    cookie: {
      path: "/favspotify/api/auth",
      httpOnly: true,
      secure: false,
    },
    saveUninitialized: false,
    resave: false,
  })
);
app.use("/favspotify/api/auth", spotifyAuthRouter.getRouter());

app.listen(port, async () => {
  await connectToDatabase();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
