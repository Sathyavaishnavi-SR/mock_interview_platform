/**
 * Custom ApiError Class
 * Extends the native Error class to represent operational HTTP errors.
 * 
 * Educational Notes for Students:
 * - statusCode: HTTP status code (e.g., 400 for Bad Request, 401 for Unauthorized, 404 for Not Found).
 * - isOperational: Distinguishes programmer bugs (e.g. syntax errors, null pointers)
 *   from expected operational errors (e.g. invalid user input, expired tokens).
 * - Error.captureStackTrace: Omits this constructor call from the stack trace
 *   so the log points directly to where the error was thrown.
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.success = false;
    this.name = 'ApiError';

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
