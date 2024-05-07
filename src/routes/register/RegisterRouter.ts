import express, { Router, Request, Response, NextFunction } from "express";
import UserService from "@src/services/user/UserService";
import { CREATED, INTERNAL_SERVER_ERROR } from "@src/utils/http_status_code";
export default class RegisterRouter {
  private router: Router;

  constructor() {
    this.router = express.Router();

    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.registerUserHandler = this.registerUserHandler.bind(this);
    this.router.post("/", this.registerUserHandler);
  }

  private async registerUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    /* TODO the cookie could be expired  */
    try {
      if (req.session.user) {
        const result = await UserService.createUser(req.session.user);
        req.session.cookie.expires = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        );
      } else {
        throw new Error("Only previously logged users can register");
      }
      res
        .status(CREATED)
        .send({ status: CREATED, message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  public getRouter() {
    return this.router;
  }
}
