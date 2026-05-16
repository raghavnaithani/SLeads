import { Router } from 'express';
import { ApiResponse } from '../utils';

const router = Router();

router.get('/health', (_req, res) => {
  ApiResponse.success(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }, 'Server is running');
});

export default router;
