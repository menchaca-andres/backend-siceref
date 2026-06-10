import { prisma } from '../../config/database'
import { activeOnly, softDeleteNow, withActiveOnly } from '../../utils/soft-delete'
import { CreateTamanioDto, UpdateTamanioDto } from './tamanio.types'

export const TamanioModel = {
    findAll: async (includeInactive = false) => {
        return await prisma.tamanios.findMany({
            where: includeInactive ? activeOnly : { ...activeOnly, estado_tam: true },
            orderBy: { id_tam: 'asc' },
        })
    },

    findById: async (id: number) => {
        return await prisma.tamanios.findFirst({ where: withActiveOnly({ id_tam: id }) })
    },

    create: async (data: CreateTamanioDto) => {
        return await prisma.tamanios.create({ data })
    },

    update: async (id: number, data: UpdateTamanioDto) => {
        const existing = await prisma.tamanios.findFirst({ where: withActiveOnly({ id_tam: id }) })
        if (!existing) return null

        return await prisma.tamanios.update({ where: { id_tam: id }, data }).catch(() => null)
    },

    deactivate: async (id: number) => {
        const existing = await prisma.tamanios.findFirst({ where: withActiveOnly({ id_tam: id }) })
        if (!existing) return null

        return await prisma.tamanios.update({
            where: { id_tam: id },
            data: { estado_tam: false, deleted_at: softDeleteNow() },
        }).catch(() => null)
    },

    activate: async (id: number) => {
        const existing = await prisma.tamanios.findFirst({ where: withActiveOnly({ id_tam: id }) })
        if (!existing) return null

        return await prisma.tamanios.update({
            where: { id_tam: id },
            data: { estado_tam: true },
        }).catch(() => null)
    },
}
