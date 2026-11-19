import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { healthRouter } from './modules/health/health.routes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  // L'API est derrière Nginx : on fait confiance au premier proxy pour l'IP du client
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));

  app.use('/api/health', healthRouter);
  // Prochains modules : auth, accounts, transactions, imports, categories, budgets

  app.use('/api', notFound);
  app.use(errorHandler);

  return app;
}
