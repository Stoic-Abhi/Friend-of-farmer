// src/index.js
// Server boot — loads env, connects DB, starts listening.

import 'dotenv/config';
import app    from './app.js';
import prisma from './config/prisma.js';

const PORT = Number(process.env.PORT ?? 4000);

async function main() {
  // Verify DB connection
  await prisma.$connect();
  console.info('✅ PostgreSQL connected via Prisma');

  app.listen(PORT, () => {
    console.info(`🚀 FarmDirect API running on http://localhost:${PORT}`);
    console.info(`   ENV: ${process.env.NODE_ENV ?? 'development'}`);
  });
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
