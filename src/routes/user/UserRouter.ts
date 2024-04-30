import express, { Router, Request, Response, NextFunction } from "express";

export default class UserRouter {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get("/", this.userHandler);
  }

  private userHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    res.send({});
  }
}
