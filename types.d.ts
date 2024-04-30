declare module "express-session" {
  interface SessionData {
    spotifyStateCode?: string; // whatever property you like
    spotifyWebApiToken?: SpotifyAuthorizationToken;
    another?: string;
  }
}

declare global {
  interface SpotifyAuthorizationToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  }
}
export {};
