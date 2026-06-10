import { prisma } from '../../config/database'
import { activeOnly, softDeleteNow, withActiveOnly } from '../../utils/soft-delete'
import { CreatePublicacionDto, UpdatePublicacionDto } from './publicacion.types'

const parseBoolean = (value: boolean | string | undefined) => {
    if (value === undefined) return undefined
    return value === true || value === 'true'
}

const includePublicacion = {
    mascota: { include: { raza: { include: { especie: true } }, tamano: true } },
    refugio: true,
}

const activePublicacionWhere = {
    ...activeOnly,
    mascota: activeOnly,
    refugio: activeOnly,
}

export const PublicacionModel = {
    findAll: async (id_ref?: number | null, id_ani?: number) => {
        return await prisma.publicaciones.findMany({
            where: {
                ...activePublicacionWhere,
                ...(id_ref != null ? { id_ref } : {}),
                ...(id_ani !== undefined ? { id_ani } : {}),
            },
            include: includePublicacion,
            orderBy: { id_publi: 'asc' },
        })
    },

    findById: async (id: number) => {
        return await prisma.publicaciones.findFirst({
            where: withActiveOnly({ id_publi: id }),
            include: includePublicacion,
        })
    },

    findMascotaById: async (id: number) => {
        return await prisma.mascotas.findFirst({ where: withActiveOnly({ id_ani: id }) })
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
        const existing = await prisma.publicaciones.findFirst({ where: withActiveOnly({ id_publi: id }) })
        if (!existing) return null

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
        const existing = await prisma.publicaciones.findFirst({ where: withActiveOnly({ id_publi: id }) })
        if (!existing) return null

        return await prisma.publicaciones.update({
            where: { id_publi: id },
            data: { deleted_at: softDeleteNow(), estad_publ: false },
        }).catch(() => null)
    },
}
