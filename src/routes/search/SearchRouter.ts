import express, { Router, Request, Response, NextFunction } from "express";
import { OK } from "../../utils/http_status_code";
import SpotifyWebApi from "../../services/SpotifyWebApi";
export default class SearchRouter {
  private router: Router;
  private spotifyApi: SpotifyWebApi;
  constructor() {
    this.router = express.Router();
    this.spotifyApi = new SpotifyWebApi();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.searchHandler = this.searchHandler.bind(this);

    this.router.get("/", this.searchHandler);
  }
  private async searchHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const searchResult = await this.spotifyApi.getItem(
      req.session.spotifyWebApiToken!
    );
    res.status(OK).send(searchResult);
  }

  public getRouter() {
    return this.router;
  }
}
