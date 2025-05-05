import { PrismaClient } from 'generated/prisma-client'

// eslint-disable-next-line
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const db =
    globalForPrisma.prisma ?? new PrismaClient({ errorFormat: 'pretty' })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
