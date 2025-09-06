import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// Keep a global cached instance to avoid re-creating PrismaClient in dev
const globalForPrisma = globalThis as unknown as { prisma: any }

export const db: any =
  globalForPrisma.prisma ??
  (new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL, // Accelerate URL
    log: ['warn', 'error'],
  }).$extends(withAccelerate()) as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
