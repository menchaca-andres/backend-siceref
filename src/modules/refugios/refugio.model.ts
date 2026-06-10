import { prisma } from '../../config/database'
import { activeOnly, softDeleteNow, withActiveOnly } from '../../utils/soft-delete'
import { CreateRefugioDto, UpdateRefugioDto } from './refugio.types'

export const RefugioModel = {
    findAll: async () => {
        return await prisma.refugios.findMany({
            where: activeOnly,
            orderBy: { id_ref: 'asc' },
        })
    },

    findById: async (id: number) => {
        return await prisma.refugios.findFirst({ where: withActiveOnly({ id_ref: id }) })
    },

    findByEmail: async (email: string) => {
        return await prisma.refugios.findFirst({ where: withActiveOnly({ email_ref: email }) })
    },

    create: async (data: CreateRefugioDto) => {
        return await prisma.refugios.create({
            data: {
                img_ref: data.img_ref,
                nom_ref: data.nom_ref,
                direc_ref: data.direc_ref,
                telef_ref: data.telef_ref,
                email_ref: data.email_ref,
                estado_ref: data.estado_ref === undefined ? undefined : data.estado_ref === true || data.estado_ref === 'true',
            },
        })
    },

    update: async (id: number, data: UpdateRefugioDto) => {
        const existing = await prisma.refugios.findFirst({ where: withActiveOnly({ id_ref: id }) })
        if (!existing) return null

        return await prisma.refugios.update({
            where: { id_ref: id },
            data: {
                ...data,
                estado_ref: data.estado_ref === undefined ? undefined : data.estado_ref === true || data.estado_ref === 'true',
            },
        }).catch(() => null)
    },

    delete: async (id: number) => {
        const existing = await prisma.refugios.findFirst({ where: withActiveOnly({ id_ref: id }) })
        if (!existing) return null

        const deletedAt = softDeleteNow()

        await prisma.$transaction([
            prisma.publicaciones.updateMany({
                where: withActiveOnly({ id_ref: id }),
                data: { deleted_at: deletedAt, estad_publ: false },
            }),
            prisma.mascotas.updateMany({
                where: withActiveOnly({ id_ref: id }),
                data: { deleted_at: deletedAt },
            }),
            prisma.refugios.update({
                where: { id_ref: id },
                data: { deleted_at: deletedAt, estado_ref: false },
            }),
        ])

        return await prisma.refugios.findUnique({ where: { id_ref: id } })
    },
}
