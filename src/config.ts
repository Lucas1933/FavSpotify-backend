import dotenv from "dotenv";
interface Config {
  app: {
    PORT: string;
    ENV: string;
  };
  mongo: {
    URL: string;
  };
  secret: {
    COOKIE_SESSION_SECRET: string;
    SPOTIFY_STATE_CODE: string;
    SPOTIFY_CLIENT_SECRET: string;
    SPOTIFY_CLIENT_ID: string;
  };
}
dotenv.config();
const enviroment = process.argv[2];
let config: Config;
if (enviroment != "developement") {
  config = {
    app: {
      PORT: process.env.PORT as string,
      ENV: enviroment,
    },
    mongo: {
      URL: process.env.MONGO_URL as string,
    },
    secret: {
      COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET as string,
      SPOTIFY_STATE_CODE: process.env.SPOTIFY_STATE_CODE as string,
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET as string,
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID as string,
    },
  };
} else {
  config = {
    app: {
      PORT: "3000",
      ENV: enviroment,
    },
    mongo: {
      URL: "mongodb://localhost:27017/FavSpotifyLOCAL?",
    },
    secret: {
      COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET as string,
      SPOTIFY_STATE_CODE: process.env.SPOTIFY_STATE_CODE as string,
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET as string,
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID as string,
    },
  };
}
export default config;
