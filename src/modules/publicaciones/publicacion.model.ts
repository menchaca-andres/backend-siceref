import { prisma } from '../../config/database'
import { CreatePublicacionDto, UpdatePublicacionDto } from './publicacion.types'

const parseBoolean = (value: boolean | string | undefined) => {
    if (value === undefined) return undefined
    return value === true || value === 'true'
}

export const PublicacionModel = {
    findAll: async (id_ref?: number | null, id_ani?: number) => {
        return await prisma.publicaciones.findMany({
            where: {
                ...(id_ref != null ? { id_ref } : {}),
                ...(id_ani !== undefined ? { id_ani } : {}),
            },
            include: { mascota: { include: { raza: { include: { especie: true } } } }, refugio: true },
            orderBy: { id_publi: 'asc' },
        })
    },

    findById: async (id: number) => {
        return await prisma.publicaciones.findUnique({
            where: { id_publi: id },
            include: { mascota: { include: { raza: { include: { especie: true } } } }, refugio: true },
        })
    },

    findMascotaById: async (id: number) => {
        return await prisma.mascotas.findUnique({ where: { id_ani: id } })
    },

    create: async (data: CreatePublicacionDto & { id_ref: number }) => {
        return await prisma.publicaciones.create({
            data: {
                id_ani: Number(data.id_ani),
                id_ref: Number(data.id_ref),
                estad_publ: parseBoolean(data.estad_publ),
            },
        })
    },

    update: async (id: number, data: UpdatePublicacionDto) => {
        return await prisma.publicaciones.update({
            where: { id_publi: id },
            data: {
                id_ani: data.id_ani === undefined ? undefined : Number(data.id_ani),
                id_ref: data.id_ref === undefined ? undefined : Number(data.id_ref),
                estad_publ: parseBoolean(data.estad_publ),
            },
        }).catch(() => null)
    },

    delete: async (id: number) => {
        return await prisma.publicaciones.delete({ where: { id_publi: id } }).catch(() => null)
    },
}
