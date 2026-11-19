import { PrismaClient } from '@prisma/client';

/** Client Prisma unique : il gère un pool de connexions vers PostgreSQL. */
export const prisma = new PrismaClient();
