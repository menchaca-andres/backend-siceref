import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

const adapter = new PrismaPg({
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
})

export const prisma = new PrismaClient({ adapter })
