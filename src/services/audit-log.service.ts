import { Request } from 'express'
import { Prisma } from '../../generated/prisma/client'
import { prisma } from '../config/database'

type AuditLogInput = {
    req?: Request
    id_usu?: number | null
    accion: string
    entidad?: string | null
    id_entidad?: string | number | null
    detalle?: Prisma.InputJsonValue | null
}

type ListAuditLogsParams = {
    page?: number
    limit?: number
    id_usu?: number
    accion?: string
    entidad?: string
}

const getClientIp = (req?: Request) => {
    if (!req) return null

    const forwardedFor = req.headers['x-forwarded-for']
    if (Array.isArray(forwardedFor)) return forwardedFor[0] ?? null
    if (forwardedFor) return forwardedFor.split(',')[0]?.trim() ?? null

    return req.ip || req.socket.remoteAddress || null
}

export const AuditLogService = {
    create: async ({ req, id_usu, accion, entidad, id_entidad, detalle }: AuditLogInput) => {
        await prisma.logs_usuario.create({
            data: {
                id_usu: id_usu ?? req?.usuario?.id_usu ?? null,
                accion,
                entidad: entidad ?? null,
                id_entidad: id_entidad === undefined || id_entidad === null ? null : String(id_entidad),
                detalle: detalle ?? undefined,
                ip: getClientIp(req),
                user_agent: req?.headers['user-agent'] ?? null,
            },
        })
    },

    findAll: async ({ page = 1, limit = 50, id_usu, accion, entidad }: ListAuditLogsParams) => {
        const take = Math.min(Math.max(limit, 1), 100)
        const skip = (Math.max(page, 1) - 1) * take
        const where = {
            ...(id_usu ? { id_usu } : {}),
            ...(accion ? { accion: { contains: accion, mode: 'insensitive' as const } } : {}),
            ...(entidad ? { entidad: { equals: entidad, mode: 'insensitive' as const } } : {}),
        }

        const [items, total] = await Promise.all([
            prisma.logs_usuario.findMany({
                where,
                orderBy: { fecha_log: 'desc' },
                skip,
                take,
                include: {
                    usuario: {
                        select: {
                            id_usu: true,
                            nom_usu: true,
                            apell_usu: true,
                            email_usu: true,
                            rol: {
                                select: {
                                    codigo: true,
                                    nom_rol: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.logs_usuario.count({ where }),
        ])

        return {
            items,
            total,
            page: Math.max(page, 1),
            limit: take,
            totalPages: Math.ceil(total / take),
        }
    },
}
