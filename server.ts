import express from 'express';
import dotenv from 'dotenv';
import healthHandler from './api/health.ts';
import exchangeRatesHandler from './api/exchangerates.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Serverless API routes mapped to /api endpoints
app.all('/api/health', (req, res) => {
  return healthHandler(req, res);
});

app.all('/api/exchangerates', (req, res) => {
  return exchangeRatesHandler(req, res);
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  } else {
    // In dev, mount Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
