export class UnauthorizedError extends Error {
  constructor(message = "Please log in to access this resource.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
