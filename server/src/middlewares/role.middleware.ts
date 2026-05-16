import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors';
import { UserRole } from '../interfaces';
import { AuthenticatedRequest } from './auth.middleware';

export const roleMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      throw new ForbiddenError('Access denied');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }

    next();
  };
};
