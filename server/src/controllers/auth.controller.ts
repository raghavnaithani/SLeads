import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils';
import { asyncHandler } from '../utils';
import { addTokenToBlacklist } from '../utils/tokenBlacklist';

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  ApiResponse.created(res, result, 'User registered successfully');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  ApiResponse.success(res, result, 'Login successful');
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { userId: string } }).user.userId;
  const user = await authService.getMe(userId);
  ApiResponse.success(res, user, 'User fetched successfully');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token as string;
  }

  if (!token) {
    ApiResponse.error(res, 'No token provided', 400);
    return;
  }

  addTokenToBlacklist(token);
  ApiResponse.success(res, null, 'Logged out successfully');
});
