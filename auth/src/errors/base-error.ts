type SerializedError = {
  message: string;
  field?: string;
};

export default abstract class BaseError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  public statusCode = 500;
  abstract serializeError(): SerializedError[];
}
