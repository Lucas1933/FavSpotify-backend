declare module "express-session" {
  interface SessionData {
    spotifyStateCode?: string; // whatever property you like
    spotifyWebApiToken?: string;
  }
}

export {};
