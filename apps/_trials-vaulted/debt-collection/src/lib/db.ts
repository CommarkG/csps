// CSPS TEMPLATE — replace [App Name] with your app name
// Platform Prisma client — shared via @prisma/client + schema at libs/policies/schema.zmodel
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
