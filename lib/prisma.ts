import { PrismaClient } from '@prisma/client';

// Next.js hot-reload sırasında birden çok PrismaClient örneği oluşmasını önlemek
// için global singleton kullanılır.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
