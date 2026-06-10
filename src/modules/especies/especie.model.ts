import { prisma } from '../../config/database'
import { activeOnly, softDeleteNow, withActiveOnly } from '../../utils/soft-delete'
import { CreateEspecieDto, UpdateEspecieDto } from './especie.types'

export const EspecieModel = {
    findAll: async () => {
        return await prisma.especies.findMany({
            where: activeOnly,
            orderBy: { id_esp: 'asc' },
        })
    },

    findById: async (id: number) => {
        return await prisma.especies.findFirst({ where: withActiveOnly({ id_esp: id }) })
    },

    create: async (data: CreateEspecieDto) => {
        return await prisma.especies.create({ data })
    },

    update: async (id: number, data: UpdateEspecieDto) => {
        const existing = await prisma.especies.findFirst({ where: withActiveOnly({ id_esp: id }) })
        if (!existing) return null

        return await prisma.especies.update({ where: { id_esp: id }, data }).catch(() => null)
    },

    delete: async (id: number) => {
        const existing = await prisma.especies.findFirst({ where: withActiveOnly({ id_esp: id }) })
        if (!existing) return null

        return await prisma.especies.update({
            where: { id_esp: id },
            data: { deleted_at: softDeleteNow() },
        }).catch(() => null)
    },
}
