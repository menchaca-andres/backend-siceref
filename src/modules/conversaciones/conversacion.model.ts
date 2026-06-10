import { prisma } from '../../config/database'
import { withActiveOnly } from '../../utils/soft-delete'

const mensajeInclude = {
    remitente: {
        select: {
            id_usu: true,
            nom_usu: true,
            apell_usu: true,
            email_usu: true,
        },
    },
}

const conversacionInclude = {
    usuario: {
        select: {
            id_usu: true,
            nom_usu: true,
            apell_usu: true,
            email_usu: true,
            numcel_usu: true,
        },
    },
    responsable: {
        select: {
            id_usu: true,
            nom_usu: true,
            apell_usu: true,
            email_usu: true,
        },
    },
    publicacion: { include: { mascota: true, refugio: true } },
    mensajes: { include: mensajeInclude, orderBy: { fecha_msj: 'asc' as const } },
}

export const ConversacionModel = {
    findPublicacionById: async (id_publi: number) => {
        return await prisma.publicaciones.findFirst({
            where: withActiveOnly({ id_publi }),
            include: { mascota: true, refugio: true },
        })
    },

    findById: async (id_conv: number) => {
        return await prisma.conversaciones.findUnique({
            where: { id_conv },
            include: conversacionInclude,
        })
    },

    findByUsuario: async (id_usu: number, id_ref: number | null) => {
        return await prisma.conversaciones.findMany({
            where: id_ref === null ? { id_usu } : {
                publicacion: { id_ref },
                OR: [
                    { id_responsable: id_usu },
                    { id_responsable: null },
                ],
            },
            include: conversacionInclude,
            orderBy: { fecha_creacion: 'desc' },
        })
    },

    findOrCreateByUsuarioAndPublicacion: async (id_usu: number, id_publi: number) => {
        return await prisma.conversaciones.upsert({
            where: { id_usu_id_publi: { id_usu, id_publi } },
            update: {},
            create: { id_usu, id_publi },
            include: conversacionInclude,
        })
    },

    createMensaje: async (id_conv: number, id_remitente: number, contenido: string) => {
        return await prisma.mensajes_chat.create({
            data: { id_conv, id_remitente, contenido },
            include: mensajeInclude,
        })
    },

    assignResponsable: async (id_conv: number, id_responsable: number) => {
        await prisma.conversaciones.updateMany({
            where: { id_conv, id_responsable: null },
            data: { id_responsable },
        })

        return await prisma.conversaciones.findUnique({
            where: { id_conv },
            include: conversacionInclude,
        })
    },

    findUsuariosDelRefugio: async (id_ref: number, id_remitente: number) => {
        return await prisma.usuarios.findMany({
            where: {
                id_ref,
                id_usu: { not: id_remitente },
                rol: { codigo: { in: ['admin-refugio', 'trabajador-refugio'] } },
            },
            select: { id_usu: true },
        })
    },

    createNotificaciones: async (notificaciones: Array<{
        id_destinatario: number
        id_publi: number
        tipo: 'MENSAJE_CHAT'
        titulo: string
        mensaje: string
    }>) => {
        if (notificaciones.length === 0) return []

        return await Promise.all(notificaciones.map((notificacion) => prisma.notificaciones.create({
            data: notificacion,
            include: {
                publicacion: { include: { mascota: true, refugio: true } },
            },
        })))
    },
}
