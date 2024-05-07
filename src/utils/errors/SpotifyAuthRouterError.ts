import { CustomError } from "./CustomError";

export class SpotifyAuthRouterError extends CustomError {
  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    userId?: string,
    additionalData?: Record<string, any>
  ) {
    super(message, statusCode, errorCode, userId, additionalData);
  }
}
