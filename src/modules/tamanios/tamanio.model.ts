import { prisma } from '../../config/database'
import { CreateTamanioDto, UpdateTamanioDto } from './tamanio.types'

export const TamanioModel = {
    findAll: async (includeInactive = false) => {
        return await prisma.tamanios.findMany({
            where: includeInactive ? undefined : { estado_tam: true },
            orderBy: { id_tam: 'asc' },
        })
    },

    findById: async (id: number) => {
        return await prisma.tamanios.findUnique({ where: { id_tam: id } })
    },

    create: async (data: CreateTamanioDto) => {
        return await prisma.tamanios.create({ data })
    },

    update: async (id: number, data: UpdateTamanioDto) => {
        return await prisma.tamanios.update({ where: { id_tam: id }, data }).catch(() => null)
    },

    deactivate: async (id: number) => {
        return await prisma.tamanios.update({ where: { id_tam: id }, data: { estado_tam: false } }).catch(() => null)
    },

    activate: async (id: number) => {
        return await prisma.tamanios.update({ where: { id_tam: id }, data: { estado_tam: true } }).catch(() => null)
    },
}
