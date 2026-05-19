import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors';
import { env } from '../config';

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Default to 500
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: Record<string, string[]> | undefined;

  if (err instanceof ValidationError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID';
  } else if (
    err.name === 'MongoServerError' &&
    (err as unknown as Record<string, unknown>).code === 11000
  ) {
    statusCode = 409;
    message = 'Duplicate field value — resource already exists';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log in development
  if (env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  const response: {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
    stack?: string;
  } = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  // Never include stack traces in HTTP responses to avoid leaking internals.

  res.status(statusCode).json(response);
};
