import { prisma } from '../../config/database'
import { activeOnly, softDeleteNow, withActiveOnly } from '../../utils/soft-delete'
import { CreateRazaDto, UpdateRazaDto } from './raza.types'

export const RazaModel = {
    findAll: async () => {
        return await prisma.razas.findMany({
            where: {
                ...activeOnly,
                especie: activeOnly,
            },
            include: { especie: true },
            orderBy: { id_raza: 'asc' },
        })
    },

    findById: async (id: number) => {
        return await prisma.razas.findFirst({
            where: withActiveOnly({ id_raza: id }),
            include: { especie: true },
        })
    },

    create: async (data: CreateRazaDto) => {
        return await prisma.razas.create({ data })
    },

    update: async (id: number, data: UpdateRazaDto) => {
        const existing = await prisma.razas.findFirst({ where: withActiveOnly({ id_raza: id }) })
        if (!existing) return null

        return await prisma.razas.update({ where: { id_raza: id }, data }).catch(() => null)
    },

    delete: async (id: number) => {
        const existing = await prisma.razas.findFirst({ where: withActiveOnly({ id_raza: id }) })
        if (!existing) return null

        return await prisma.razas.update({
            where: { id_raza: id },
            data: { deleted_at: softDeleteNow() },
        }).catch(() => null)
    },
}
