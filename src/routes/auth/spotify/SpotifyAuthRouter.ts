import express, { Router, Request, Response, NextFunction } from "express";
import SpotifyProvider from "./SpotifyProvider";
import { UNAUTHORIZED } from "../../../utils/http_status_code";

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
    const { code, state, error } = req.query;
    if (error) {
      if (state != req.session.spotifyStateCode) {
        console.log("state ", state);
        console.log("req.session.state ", req.session.spotifyStateCode);
      }
      console.log("something went wrong", error);
      res.sendStatus(UNAUTHORIZED).send({ code: UNAUTHORIZED, error });
    } else {
      const token = await this.spotifyProvider.getAuthorizationToken(
        code as string
      );

      console.log("succesfull response from spotify api ", token);
      res.send(token);
    }
  }
  public getRouter(): Router {
    return this.router;
  }
}
