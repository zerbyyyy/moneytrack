import { createApp } from './app.js';
import { getEnv } from './config/env.js';
import { prisma } from './lib/prisma.js';

const env = getEnv();
const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`API MoneyTrack démarrée sur le port ${env.PORT} (${env.NODE_ENV})`);
});

function shutdown(signal: string) {
  console.log(`${signal} reçu, arrêt de l'API…`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
