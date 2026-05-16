import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env, connectDatabase } from './config';
import { errorMiddleware } from './middlewares';
import { API_PREFIX } from './constants';
import routes from './routes';

// ── Express App ────────────────────────────────────────────
const app = express();

// ── Security Middleware ────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// ── Rate Limiting ──────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use(limiter);

// ── Body Parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// ── Logging ────────────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Routes ─────────────────────────────────────────────────
app.use(API_PREFIX, routes);

// ── 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ── Error Handler ──────────────────────────────────────────
app.use(errorMiddleware);

// ── Start Server ───────────────────────────────────────────
const startServer = async () => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
};

startServer();

export default app;
