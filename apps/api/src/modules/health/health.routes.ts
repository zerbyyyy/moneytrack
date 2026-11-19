import type { HealthResponse } from '@moneytrack/shared';
import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';

export const healthRouter = Router();

/** Sonde de vie, interrogée chaque minute par la sonde de disponibilité externe. */
healthRouter.get('/', (_req, res) => {
  const body: HealthResponse = { status: 'ok' };
  res.json(body);
});

/** Sonde de disponibilité : vérifie aussi l'accès à la base de données. */
healthRouter.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
  }
});
