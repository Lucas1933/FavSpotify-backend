import express, { Router, Request, Response, NextFunction } from "express";
import SpotifyProvider from "./SpotifyProvider";
import { UNAUTHORIZED } from "../../../utils/http_status_code";
import { SpotifyAuthRouterError } from "../../../utils/errors/SpotifyAuthRouterError";

export default class SpotifyAuthRouter {
  private router: Router;
  private spotifyProvider: SpotifyProvider;
  constructor() {
    this.router = express.Router();
    this.spotifyProvider = new SpotifyProvider();
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
    req.session.spotifyStateCode = this.spotifyProvider.getState();
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
        console.log(error);
        if (state != req.session.spotifyStateCode) {
          throw new SpotifyAuthRouterError(
            "The status code provided is not the same as the one received",
            UNAUTHORIZED
          );
        }
      } else {
        const token = await this.spotifyProvider.getAuthorizationToken(
          code as string
        );
        req.session.spotifyWebApiToken = token;
        res.redirect("/app");
      }
    } catch (error) {
      next(error);
    }
  }
  public getRouter(): Router {
    return this.router;
  }
}
