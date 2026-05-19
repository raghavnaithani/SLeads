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
    origin: (origin, callback) => {
      // Allow server-to-server or same-origin requests with no Origin header
      if (!origin) return callback(null, true);
      // Allow configured origin
      if (origin === env.CORS_ORIGIN) return callback(null, true);
      // In development, allow any localhost origin (useful when Vite picks a different port)
      if (env.NODE_ENV === 'development' && origin.startsWith('http://localhost')) return callback(null, true);
      // Explicitly disallow other origins
      return callback(new Error('Not allowed by CORS'));
    },
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
if (!process.env.VERCEL) {
  const startServer = async () => {
    await connectDatabase();
    app.listen(env.PORT, () => {
      console.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
  };
  startServer();
} else {
  // On Vercel, connect database globally
  connectDatabase();
}

export default app;
