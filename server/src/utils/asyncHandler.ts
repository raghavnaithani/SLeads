import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async route handler to automatically catch rejected promises
 * and forward them to the Express error middleware.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
