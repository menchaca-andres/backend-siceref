import { prisma } from '../../config/database'
import { UpdateNotificacionDto } from './notificacion.types'

const parseBoolean = (value: boolean | string | undefined) => {
    if (value === undefined) return undefined
    return value === true || value === 'true'
}

export const NotificacionModel = {
    findByUsuario: async (id_destinatario: number) => {
        return await prisma.notificaciones.findMany({
            where: { id_destinatario },
            include: {
                publicacion: { include: { mascota: true, refugio: true } },
            },
            orderBy: { fecha_noti: 'desc' },
        })
    },

    findById: async (id_noti: number) => {
        return await prisma.notificaciones.findUnique({ where: { id_noti } })
    },

    update: async (id_noti: number, data: UpdateNotificacionDto) => {
        const leida = parseBoolean(data.leida)
        return await prisma.notificaciones.update({
            where: { id_noti },
            data: {
                leida,
                fecha_leida: leida === undefined ? undefined : leida ? new Date() : null,
            },
        })
    },
}
