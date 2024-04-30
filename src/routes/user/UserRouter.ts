import express, { Router, Request, Response, NextFunction } from "express";
import SpotifyWebApi from "../../services/SpotifyWebApi";

export default class UserRouter {
  private router: Router;
  private spotifyApi: SpotifyWebApi;
  constructor() {
    this.router = express.Router();
    this.spotifyApi = new SpotifyWebApi();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.getUserHandler = this.getUserHandler.bind(this);
    this.addItemToUserFavList = this.addItemToUserFavList.bind(this);
    this.router.get("/", this.getUserHandler);
    this.router.post("/", this.addItemToUserFavList);
  }

  private async getUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userInfo = await this.spotifyApi.getUserInformation(
        req.session.spotifyWebApiToken!
      );
      res.send(userInfo);
    } catch (error) {
      next(error);
    }
  }

  private async addItemToUserFavList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const items: string[] = req.body.items;
  }

  public getRouter() {
    return this.router;
  }
}
