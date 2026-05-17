// src/app.js

import express      from 'express';
import cors         from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes    from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes   from './routes/order.routes.js';
import farmerRoutes       from './routes/farmer.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import profileRoutes      from './routes/profile.routes.js';

const app = express();

app.use(cors({
  origin:      process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth',     authRoutes);
app.use('/products', productRoutes);
app.use('/orders',   orderRoutes);
app.use('/farmers',        farmerRoutes);
app.use('/notifications',  notificationRoutes);
app.use('/profile',        profileRoutes);

app.get('/health', (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

app.use((_req, res) =>
  res.status(404).json({ ok: false, message: 'Route not found.' })
);

app.use((err, _req, res, _next) => {
  console.error('[Unhandled]', err);
  res.status(500).json({ ok: false, message: 'Internal server error.' });
});

export default app;
