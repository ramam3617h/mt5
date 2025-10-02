import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './routes/auth';
import customersRoutes from './routes/customers';
import usersRoutes from './routes/users';
import activitiesRoutes from './routes/activities';
import analyticsRoutes from './routes/analytics';
import { authMiddleware } from './middleware/auth';
import { tenantMiddleware } from './middleware/tenant';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

app.use('/api/auth', authRoutes);
app.use('/api/customers', authMiddleware, tenantMiddleware, customersRoutes);
app.use('/api/users', authMiddleware, tenantMiddleware, usersRoutes);
app.use('/api/activities', authMiddleware, tenantMiddleware, activitiesRoutes);
app.use('/api/analytics', authMiddleware, tenantMiddleware, analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
