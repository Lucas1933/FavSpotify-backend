export class CustomError extends Error {
  private statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  public getStatusCode() {
    return this.statusCode;
  }
}

// Custom error class for specific error type
export class SpotifyAuthRouterError extends CustomError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
