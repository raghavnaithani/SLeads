import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { validate, authMiddleware } from '../middlewares';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, getMe);

export default router;
