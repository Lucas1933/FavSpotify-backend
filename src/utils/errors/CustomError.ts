export class CustomError extends Error {
  private statusCode: number;
  private errorCode: string;
  private requestId?: string;
  private additionalData?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    additionalData?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
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

  public getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear().toString().padStart(4, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    return formattedDateTime;
  }

  public getRequestId() {
    return this.requestId;
  }

  public setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  public getAdditionalData() {
    return this.additionalData;
  }
}
