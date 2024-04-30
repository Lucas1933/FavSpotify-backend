import { NextFunction, Request, Response } from "express";
import { FORBIDDEN, UNAUTHORIZED } from "../http_status_code";

export default function authMiddleware(privacyType: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { spotifyWebApiToken } = req.session;
    switch (privacyType) {
      case "PRIVATE":
        if (spotifyWebApiToken) next();
        else
          res.status(UNAUTHORIZED).send({
            status: UNAUTHORIZED,
            message: "You need to be authenticated to access this resource",
          });
        break;
      case "NO_AUTHENTICATED":
        if (!spotifyWebApiToken) next();
        else
          res.status(FORBIDDEN).send({
            status: FORBIDDEN,
            message: "You are already logged in",
          });
        break;
    }
  };
}
