// src/config/prisma.js
// Singleton PrismaClient — shared across all services.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['warn', 'error']
    : ['error'],
});

export default prisma;
