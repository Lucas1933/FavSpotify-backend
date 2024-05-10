import express, { Router, Request, Response, NextFunction } from "express";
import SpotifyProvider from "@services/spotify/SpotifyProvider";
import config from "@src/config";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  UNAUTHORIZED,
} from "@utils/http_status_code";
import { SpotifyAuthRouterError } from "@utils/errors/SpotifyAuthRouterError";
import SpotifyWebApi from "@src/services/spotify/SpotifyWebApi";
import UserService from "@src/services/user/UserService";

export default class SpotifyAuthRouter {
  private router: Router;
  private spotifyProvider: SpotifyProvider;
  private spotifyWebApi: SpotifyWebApi;
  constructor() {
    this.router = express.Router();
    this.spotifyProvider = new SpotifyProvider();
    this.spotifyWebApi = new SpotifyWebApi();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.spotifyAuthUrlHandler = this.spotifyAuthUrlHandler.bind(this);
    this.spotifyCallbackHandler = this.spotifyCallbackHandler.bind(this);

    this.router.get("/spotify", this.spotifyAuthUrlHandler);
    this.router.get("/callback/spotify", this.spotifyCallbackHandler);
  }

  private async spotifyAuthUrlHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const authUrl = await this.spotifyProvider.getAuthorizationUrl();
    res.redirect(authUrl);
  }

  private async spotifyCallbackHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code, state, error } = req.query;
      if (error) {
        if (state != config.secret.SPOTIFY_STATE_CODE) {
          throw new SpotifyAuthRouterError(
            "The status code provided is not the same as the one received",
            UNAUTHORIZED,
            "INVALID_STATE_CODE",
            {
              spotifyStateCode: config.secret.SPOTIFY_STATE_CODE,
              query: { error, code, state },
              request: req,
            }
          );
        } else {
          throw new SpotifyAuthRouterError(
            "Unexpected error",
            INTERNAL_SERVER_ERROR,
            "SPOTIFY_WEB_API_ERROR",
            {
              spotifyStateCode: config.secret.SPOTIFY_STATE_CODE,
              query: { error, code, state },
              endpoint: "/callback/spotify",
            }
          );
        }
      } else {
        throw new Error("errorsito");
        const token = await this.spotifyProvider.getAuthorizationToken(
          code as string
        );
        const userInformation = await this.spotifyWebApi.getUserInformation(
          token
        );
        const userFromDb = await UserService.findUserByEmail(
          userInformation.email
        );

        if (!userFromDb) {
          req.session.user = {
            email: userInformation.email,
            username: userInformation.display_name,
            profileImage: userInformation.images,
            isRegistered: false,
            favorites: [{}],
            tokens: {
              ...token,
              expiration_date: new Date().getTime() + token.expires_in * 1000,
            },
          };
        } else {
          req.session.user = {
            email: userFromDb.email,
            username: userFromDb.username,
            profileImage: userFromDb.profileImage,
            isRegistered: true,
            favorites: userFromDb.favorites,
            tokens: {
              ...token,
              expiration_date: new Date().getTime() + token.expires_in * 1000,
            },
          };
          req.session.cookie.expires = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          );
        }
        res.status(OK).send({ status: OK, message: "User authenticated" });
      }
    } catch (error) {
      next(error);
    }
  }
  public getRouter(): Router {
    return this.router;
  }
}
