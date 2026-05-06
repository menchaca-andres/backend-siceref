import { prisma } from '../../config/database'
import { CreateEspecieDto, UpdateEspecieDto } from './especie.types'

export const EspecieModel = {
    findAll: async () => {
        return await prisma.especies.findMany({ orderBy: { id_esp: 'asc' } })
    },

    findById: async (id: number) => {
        return await prisma.especies.findUnique({ where: { id_esp: id } })
    },

    create: async (data: CreateEspecieDto) => {
        return await prisma.especies.create({ data })
    },

    update: async (id: number, data: UpdateEspecieDto) => {
        return await prisma.especies.update({ where: { id_esp: id }, data }).catch(() => null)
    },

    delete: async (id: number) => {
        return await prisma.especies.delete({ where: { id_esp: id } }).catch(() => null)
    },
}
