import dotenv from "dotenv";

dotenv.config();

export default {
  app: {
    PORT: process.env.PORT || 3000,
  },
  mongo: {
    URL: process.env.MONGO_URL,
  },
  secret: {
    COOKIE_SESSION_SECRET: process.env.COOKIE_SESSION_SECRET,
    SPOTIFY_STATE_CODE: process.env.SPOTIFY_STATE_CODE,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  },
};
