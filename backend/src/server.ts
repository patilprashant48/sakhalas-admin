import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import companyRoutes from './routes/company.routes';
import userRoutes from './routes/user.routes';
import roleRoutes from './routes/role.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: err.errors || null,
  });
});

app.listen(PORT, () => {
  // Prefer a public URL provided by the hosting platform if available
  const publicUrl = process.env.RENDER_EXTERNAL_URL || process.env.PUBLIC_URL || process.env.APP_URL;

  console.log(`🚀 Server listening on port ${PORT}`);
  if (publicUrl) {
    const base = publicUrl.replace(/\/$/, '');
    console.log(`📡 Public URL: ${base}`);
    console.log(`📊 API available at ${base}/api`);
  } else {
    console.log(`📊 API available at http://localhost:${PORT}/api`);
  }
});

export default app;
