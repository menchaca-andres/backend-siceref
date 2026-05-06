import { prisma } from '../../config/database'
import { CreateRazaDto, UpdateRazaDto } from './raza.types'

export const RazaModel = {
    findAll: async () => {
        return await prisma.razas.findMany({
            include: { especie: true },
            orderBy: { id_raza: 'asc' },
        })
    },

    findById: async (id: number) => {
        return await prisma.razas.findUnique({
            where: { id_raza: id },
            include: { especie: true },
        })
    },

    create: async (data: CreateRazaDto) => {
        return await prisma.razas.create({ data })
    },

    update: async (id: number, data: UpdateRazaDto) => {
        return await prisma.razas.update({ where: { id_raza: id }, data }).catch(() => null)
    },

    delete: async (id: number) => {
        return await prisma.razas.delete({ where: { id_raza: id } }).catch(() => null)
    },
}
