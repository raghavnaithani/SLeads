import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config';
import { UnauthorizedError } from '../errors';
import { IUserPayload } from '../interfaces';
import { isTokenBlacklisted } from '../utils/tokenBlacklist';

export interface AuthenticatedRequest extends Request {
  user: IUserPayload;
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token as string;
  }

  if (!token) {
    throw new UnauthorizedError('No token provided');
  }

  try {
    if (isTokenBlacklisted(token)) {
      throw new UnauthorizedError('Token revoked');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as IUserPayload;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};
