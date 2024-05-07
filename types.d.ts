declare module "express-session" {
  interface SessionData {
    spotifyStateCode?: string;
    user?: User;
    another?: string;
  }
}

declare global {
  interface SpotifyAuthorizationTokens {
    access_token: string;
    token_type: string;
    expires_in: number;
    expiration_date: number;
    refresh_token: string;
    scope: string;
  }
  interface Album {
    spotifyUrl: string;
    name: string;
    image: string;
    id: string;
  }
  interface Song {
    name: string;
    isPlayable: boolean;
    previewUrl: string;
    id: string;
  }
  interface User /* extends Document */ {
    username: string;
    email: string;
    profileImage: { url: string }[];
    isRegistered: boolean;
    favorites: { album?: Album; song?: Song }[];
    tokens: SpotifyAuthorizationTokens;
  }

  interface UserInformation {
    display_name: string;
    email: string;
    images: { url: string }[];
  }
}
export {};
