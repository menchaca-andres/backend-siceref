import { estado_pago_qr, Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../config/database'
import { activeOnly } from '../../utils/soft-delete'
import { EstadoProcesoAdopcion, ListReporteParams, ReporteScope } from './reporte.types'

const buildRefugioFilter = (scope?: ReporteScope): Prisma.refugiosWhereInput => {
    if (scope?.id_ref == null) return activeOnly
    return { ...activeOnly, id_ref: scope.id_ref }
}

const buildPublicacionScope = (scope?: ReporteScope): Prisma.publicacionesWhereInput => {
    if (scope?.id_ref == null) return activeOnly
    return { ...activeOnly, id_ref: scope.id_ref }
}

const buildMascotaScope = (scope?: ReporteScope): Prisma.mascotasWhereInput => {
    if (scope?.id_ref == null) return activeOnly
    return { ...activeOnly, id_ref: scope.id_ref }
}

const buildPagoScope = (scope?: ReporteScope): Prisma.pagos_qrWhereInput => {
    if (scope?.id_ref == null) return {}
    return { id_ref: scope.id_ref }
}

const resolveEstadoProceso = (estad_publ: boolean, totalConversaciones: number): EstadoProcesoAdopcion => {
    if (!estad_publ) return 'FINALIZADA'
    if (totalConversaciones > 0) return 'EN_REVISION'
    return 'PENDIENTE'
}

const parseDateStart = (value?: string) => {
    if (!value) return undefined
    const date = new Date(`${value}T00:00:00.000Z`)
    return Number.isNaN(date.getTime()) ? undefined : date
}

const parseDateEnd = (value?: string) => {
    if (!value) return undefined
    const date = new Date(`${value}T23:59:59.999Z`)
    return Number.isNaN(date.getTime()) ? undefined : date
}

export const ReporteModel = {
    getEstadisticas: async (scope?: ReporteScope) => {
        const refugioFilter = buildRefugioFilter(scope)
        const publicacionScope = buildPublicacionScope(scope)
        const mascotaScope = buildMascotaScope(scope)
        const pagoScope = buildPagoScope(scope)

        const usuarioWhere: Prisma.usuariosWhereInput = scope?.id_ref != null
            ? { ...activeOnly, id_ref: scope.id_ref }
            : activeOnly
        const conversacionWhere: Prisma.conversacionesWhereInput = scope?.id_ref != null
            ? { publicacion: { ...activeOnly, id_ref: scope.id_ref } }
            : { publicacion: activeOnly }

        const [
            usuarios_registrados,
            usuariosPorRol,
            refugios_activos,
            refugios_inactivos,
            mascotas_registradas,
            publicaciones_activas,
            publicaciones_inactivas,
            conversaciones_registradas,
            donaciones_registradas,
            donaciones_pagadas,
            totalDonado,
            transacciones_registradas,
        ] = await Promise.all([
            prisma.usuarios.count({ where: usuarioWhere }),
            prisma.usuarios.groupBy({
                by: ['id_rol'],
                where: usuarioWhere,
                _count: { _all: true },
            }),
            prisma.refugios.count({ where: { ...refugioFilter, estado_ref: true, ...activeOnly } }),
            prisma.refugios.count({ where: { ...refugioFilter, estado_ref: false, ...activeOnly } }),
            prisma.mascotas.count({ where: mascotaScope }),
            prisma.publicaciones.count({ where: { ...publicacionScope, estad_publ: true } }),
            prisma.publicaciones.count({ where: { ...publicacionScope, estad_publ: false } }),
            prisma.conversaciones.count({ where: conversacionWhere }),
            prisma.pagos_qr.count({ where: pagoScope }),
            prisma.pagos_qr.count({ where: { ...pagoScope, estado: estado_pago_qr.PAGADO } }),
            prisma.pagos_qr.aggregate({
                where: { ...pagoScope, estado: estado_pago_qr.PAGADO },
                _sum: { monto_a_pagar: true },
            }),
            scope?.id_ref != null
                ? prisma.logs_usuario.count({ where: { usuario: { id_ref: scope.id_ref } } })
                : prisma.logs_usuario.count(),
        ])

        const roles = await prisma.roles.findMany({
            where: activeOnly,
            select: { id_rol: true, codigo: true, nom_rol: true },
        })
        const rolesMap = new Map(roles.map((rol) => [rol.id_rol, rol]))

        return {
            usuarios_registrados,
            usuarios_por_rol: usuariosPorRol
                .map((item) => {
                    const rol = rolesMap.get(item.id_rol)
                    return {
                        codigo: rol?.codigo ?? 'desconocido',
                        nom_rol: rol?.nom_rol ?? 'Desconocido',
                        total: item._count._all,
                    }
                })
                .sort((a, b) => b.total - a.total),
            refugios_activos,
            refugios_inactivos,
            mascotas_registradas,
            publicaciones_activas,
            publicaciones_inactivas,
            conversaciones_registradas,
            donaciones_registradas,
            donaciones_pagadas,
            total_donado: totalDonado._sum.monto_a_pagar?.toFixed(2) ?? '0.00',
            moneda: 'BOB',
            transacciones_registradas,
        }
    },

    findUsuarios: async ({ page = 1, limit = 20, id_rol, id_ref }: ListReporteParams) => {
        const take = Math.min(Math.max(limit, 1), 100)
        const skip = (Math.max(page, 1) - 1) * take
        const where: Prisma.usuariosWhereInput = {
            ...activeOnly,
            ...(id_rol ? { id_rol } : {}),
            ...(id_ref ? { id_ref } : {}),
        }

        const [items, total] = await Promise.all([
            prisma.usuarios.findMany({
                where,
                skip,
                take,
                orderBy: { id_usu: 'asc' },
                select: {
                    id_usu: true,
                    nom_usu: true,
                    apell_usu: true,
                    email_usu: true,
                    numcel_usu: true,
                    fecnac_usu: true,
                    id_ref: true,
                    rol: { select: { nom_rol: true, codigo: true } },
                    refugio: { select: { nom_ref: true } },
                },
            }),
            prisma.usuarios.count({ where }),
        ])

        return {
            items: items.map((usuario) => ({
                id_usu: usuario.id_usu,
                nom_usu: usuario.nom_usu,
                apell_usu: usuario.apell_usu,
                email_usu: usuario.email_usu,
                numcel_usu: usuario.numcel_usu,
                fecnac_usu: usuario.fecnac_usu,
                nom_rol: usuario.rol.nom_rol,
                codigo_rol: usuario.rol.codigo,
                nom_ref: usuario.refugio?.nom_ref ?? null,
                id_ref: usuario.id_ref,
            })),
            total,
            page: Math.max(page, 1),
            limit: take,
            totalPages: Math.ceil(total / take),
        }
    },

    findProcesos: async ({ page = 1, limit = 20, estado_proceso, id_ref }: ListReporteParams, scope?: ReporteScope) => {
        const take = Math.min(Math.max(limit, 1), 100)
        const skip = (Math.max(page, 1) - 1) * take
        const scopeRef = scope?.id_ref ?? id_ref

        const publicaciones = await prisma.publicaciones.findMany({
            where: buildPublicacionScope(scopeRef != null ? { id_ref: scopeRef } : undefined),
            orderBy: { fechapubli: 'desc' },
            include: {
                mascota: { select: { id_ani: true, nom_mascot: true } },
                refugio: { select: { id_ref: true, nom_ref: true } },
                conversaciones: {
                    select: {
                        id_conv: true,
                        id_responsable: true,
                        _count: { select: { mensajes: true } },
                    },
                },
            },
        })

        const mapped = publicaciones.map((publicacion) => {
            const total_conversaciones = publicacion.conversaciones.length
            const mensajes_totales = publicacion.conversaciones.reduce((sum, conv) => sum + conv._count.mensajes, 0)
            const tiene_responsable = publicacion.conversaciones.some((conv) => conv.id_responsable !== null)
            const estado = resolveEstadoProceso(publicacion.estad_publ, total_conversaciones)

            return {
                id_publi: publicacion.id_publi,
                fechapubli: publicacion.fechapubli,
                estad_publ: publicacion.estad_publ,
                estado_proceso: estado,
                id_ref: publicacion.refugio.id_ref,
                nom_ref: publicacion.refugio.nom_ref,
                id_ani: publicacion.mascota.id_ani,
                nom_mascot: publicacion.mascota.nom_mascot,
                total_conversaciones,
                mensajes_totales,
                tiene_responsable,
            }
        })

        const filtered = estado_proceso
            ? mapped.filter((item) => item.estado_proceso === estado_proceso)
            : mapped

        const items = filtered.slice(skip, skip + take)

        return {
            items,
            total: filtered.length,
            page: Math.max(page, 1),
            limit: take,
            totalPages: Math.ceil(filtered.length / take),
        }
    },

    findTransacciones: async ({ page = 1, limit = 20, id_usu, accion, entidad, fecha_desde, fecha_hasta }: ListReporteParams) => {
        const take = Math.min(Math.max(limit, 1), 100)
        const skip = (Math.max(page, 1) - 1) * take
        const inicio = parseDateStart(fecha_desde)
        const fin = parseDateEnd(fecha_hasta)

        const where: Prisma.logs_usuarioWhereInput = {
            ...(id_usu ? { id_usu } : {}),
            ...(accion ? { accion: { contains: accion, mode: 'insensitive' } } : {}),
            ...(entidad ? { entidad: { equals: entidad, mode: 'insensitive' } } : {}),
            ...(inicio || fin ? {
                fecha_log: {
                    ...(inicio ? { gte: inicio } : {}),
                    ...(fin ? { lte: fin } : {}),
                },
            } : {}),
        }

        const [rows, total] = await Promise.all([
            prisma.logs_usuario.findMany({
                where,
                skip,
                take,
                orderBy: { fecha_log: 'desc' },
                include: {
                    usuario: {
                        select: {
                            id_usu: true,
                            nom_usu: true,
                            apell_usu: true,
                            email_usu: true,
                            rol: { select: { nom_rol: true } },
                        },
                    },
                },
            }),
            prisma.logs_usuario.count({ where }),
        ])

        return {
            items: rows.map((log) => ({
                id_log: log.id_log,
                fecha_log: log.fecha_log,
                accion: log.accion,
                entidad: log.entidad,
                id_entidad: log.id_entidad,
                id_usu: log.id_usu,
                nom_usu: log.usuario?.nom_usu ?? null,
                apell_usu: log.usuario?.apell_usu ?? null,
                email_usu: log.usuario?.email_usu ?? null,
                nom_rol: log.usuario?.rol.nom_rol ?? null,
                ip: log.ip,
            })),
            total,
            page: Math.max(page, 1),
            limit: take,
            totalPages: Math.ceil(total / take),
        }
    },

    findDonaciones: async ({ page = 1, limit = 20, estado_pago, id_ref }: ListReporteParams, scope?: ReporteScope) => {
        const take = Math.min(Math.max(limit, 1), 100)
        const skip = (Math.max(page, 1) - 1) * take
        const scopeRef = scope?.id_ref ?? id_ref

        const where: Prisma.pagos_qrWhereInput = {
            ...buildPagoScope(scopeRef != null ? { id_ref: scopeRef } : undefined),
            ...(estado_pago ? { estado: estado_pago as estado_pago_qr } : {}),
        }

        const [rows, total] = await Promise.all([
            prisma.pagos_qr.findMany({
                where,
                skip,
                take,
                orderBy: { fecha_creado: 'desc' },
                include: {
                    usuario: { select: { nom_usu: true, apell_usu: true, email_usu: true } },
                    receptor: { select: { nom_usu: true, apell_usu: true } },
                    refugio: { select: { nom_ref: true } },
                },
            }),
            prisma.pagos_qr.count({ where }),
        ])

        return {
            items: rows.map((pago) => ({
                id_pago: pago.id_pago,
                fecha_creado: pago.fecha_creado,
                fecha_pagado: pago.fecha_pagado,
                estado: pago.estado,
                monto: pago.monto.toString(),
                monto_a_pagar: pago.monto_a_pagar?.toString() ?? null,
                moneda: pago.moneda,
                glosa: pago.glosa,
                codigo: pago.codigo,
                nom_usu: pago.usuario?.nom_usu ?? null,
                apell_usu: pago.usuario?.apell_usu ?? null,
                email_usu: pago.usuario?.email_usu ?? null,
                nom_receptor: pago.receptor ? [pago.receptor.nom_usu, pago.receptor.apell_usu].filter(Boolean).join(' ') : null,
                nom_ref: pago.refugio?.nom_ref ?? null,
            })),
            total,
            page: Math.max(page, 1),
            limit: take,
            totalPages: Math.ceil(total / take),
        }
    },
}
