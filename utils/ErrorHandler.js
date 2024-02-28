// it will handle syncronous Errors

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this.constructor);
  }
}

module.exports = ErrorHandler;
