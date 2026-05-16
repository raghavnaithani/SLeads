import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

export default router;
