import { prisma } from '../../config/database'
import { CreateRefugioDto, UpdateRefugioDto } from './refugio.types'

export const RefugioModel = {
    findAll: async () => {
        return await prisma.refugios.findMany({ orderBy: { id_ref: 'asc' } })
    },

    findById: async (id: number) => {
        return await prisma.refugios.findUnique({ where: { id_ref: id } })
    },

    findByEmail: async (email: string) => {
        return await prisma.refugios.findUnique({ where: { email_ref: email } })
    },

    create: async (data: CreateRefugioDto) => {
        return await prisma.refugios.create({ data })
    },

    update: async (id: number, data: UpdateRefugioDto) => {
        return await prisma.refugios.update({ where: { id_ref: id }, data }).catch(() => null)
    },

    delete: async (id: number) => {
        return await prisma.refugios.delete({ where: { id_ref: id } }).catch(() => null)
    },
}
