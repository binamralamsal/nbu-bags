export class InternalServerError extends Error {
  constructor(message: string = "Internal server error occured") {
    super(message);
    this.name = "HTTPError";
    Error.captureStackTrace(this, this.constructor);
  }
}
