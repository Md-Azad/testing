class AppError extends Error {
  public statusCode: number;
  public success: boolean;

  constructor(
    statusCode: number,
    message: string,
    success: boolean,
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
