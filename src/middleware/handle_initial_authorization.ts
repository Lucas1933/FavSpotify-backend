import { Request, Response, NextFunction } from "express";
export default function handleInitialAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.sessionID!) {
      res.redirect("http://localhost:3000/login");
    }
    if (req.url.includes("login")) {
      res.redirect("http://localhost:3000/app");
    }
    next();
  } catch (error) {
    console.log("error in handle_initial_auth");
    next(error);
  }
}
