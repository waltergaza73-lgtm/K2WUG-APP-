import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './src/backend/db';
import { authRouter } from './src/backend/routes/auth';
import { servicesRouter } from './src/backend/routes/services';
import { jobsRouter } from './src/backend/routes/jobs';
import { marketplaceRouter } from './src/backend/routes/marketplace';
import { walletRouter } from './src/backend/routes/wallet';
import { contactRouter } from './src/backend/routes/contact';
import { statsRouter } from './src/backend/routes/stats';
import { machinesRouter } from './src/backend/routes/machines';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize MongoDB / Local JSON Database
  await initDatabase();

  app.use(cors());
  app.use(express.json());

  // Mount API Endpoints
  app.use('/api/auth', authRouter);
  app.use('/api/services', servicesRouter);
  app.use('/api/jobs', jobsRouter);
  app.use('/api/marketplace', marketplaceRouter);
  app.use('/api/wallet', walletRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/stats', statsRouter);
  app.use('/api/machines', machinesRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 K2WUG Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
