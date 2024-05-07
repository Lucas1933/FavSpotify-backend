export class CustomError extends Error {
  private statusCode: number;
  private errorCode: string;
  private timestamp: Date;
  private requestId?: string;
  private userId?: string;
  private additionalData?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    userId?: string,
    additionalData?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date();
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    if (userId) {
      this.userId = userId;
    }
    if (additionalData) {
      this.additionalData = additionalData;
    }
  }

  public getStatusCode() {
    return this.statusCode;
  }

  public getErrorCode() {
    return this.errorCode;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getRequestId() {
    return this.requestId;
  }

  public setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  public getUserId() {
    return this.userId;
  }

  public getAdditionalData() {
    return this.additionalData;
  }
}
