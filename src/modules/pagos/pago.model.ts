import { estado_pago_qr, Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../config/database'

export const PagoModel = {
    createQr: async (data: {
        id_usu?: number
        id_receptor?: number
        id_ref?: number | null
        provider_payment_id?: string | null
        provider: string
        validation_method: string
        monto: string
        monto_a_pagar?: string | null
        moneda: string
        glosa: string
        codigo: string
        qr_payload?: string | null
        qr_image_base64?: string | null
        estado: estado_pago_qr
        provider_status?: string | null
        provider_message?: string | null
        estimated_seconds?: number
        attempts?: Prisma.InputJsonValue
        fecha_expira: Date
    }) => {
        return await prisma.pagos_qr.create({
            data: {
                id_usu: data.id_usu,
                id_receptor: data.id_receptor,
                id_ref: data.id_ref,
                provider_payment_id: data.provider_payment_id,
                provider: data.provider,
                validation_method: data.validation_method,
                monto: data.monto,
                monto_a_pagar: data.monto_a_pagar,
                moneda: data.moneda,
                glosa: data.glosa,
                codigo: data.codigo,
                qr_payload: data.qr_payload,
                qr_image_base64: data.qr_image_base64,
                estado: data.estado,
                provider_status: data.provider_status,
                provider_message: data.provider_message,
                estimated_seconds: data.estimated_seconds,
                attempts: data.attempts,
                fecha_expira: data.fecha_expira,
            },
        })
    },

    findById: async (id: number) => {
        return await prisma.pagos_qr.findUnique({ where: { id_pago: id } })
    },

    findPendingByCodeAndAmount: async (code: string, amount: string, provider?: string) => {
        return await prisma.pagos_qr.findFirst({
            where: {
                codigo: code,
                monto_a_pagar: amount,
                estado: estado_pago_qr.PENDIENTE,
                ...(provider ? { provider } : {}),
            },
            orderBy: { fecha_creado: 'desc' },
        })
    },

    findPendingActive: async (provider?: string) => {
        return await prisma.pagos_qr.findMany({
            where: {
                estado: estado_pago_qr.PENDIENTE,
                fecha_expira: { gte: new Date() },
                ...(provider ? { provider } : {}),
            },
            orderBy: { fecha_creado: 'desc' },
        })
    },

    getAdminSummary: async () => {
        const [pagados, pendientes, expirados] = await Promise.all([
            prisma.pagos_qr.aggregate({
                where: { estado: estado_pago_qr.PAGADO },
                _sum: { monto_a_pagar: true },
                _count: { _all: true },
            }),
            prisma.pagos_qr.count({ where: { estado: estado_pago_qr.PENDIENTE } }),
            prisma.pagos_qr.count({ where: { estado: estado_pago_qr.EXPIRADO } }),
        ])

        return {
            total_depositado: pagados._sum.monto_a_pagar?.toFixed(2) ?? '0.00',
            pagos_pagados: pagados._count._all,
            pagos_pendientes: pendientes,
            pagos_expirados: expirados,
            moneda: 'BOB',
        }
    },

    findAdminMovements: async () => {
        return await prisma.pagos_qr.findMany({
            orderBy: { fecha_creado: 'desc' },
            take: 100,
            include: {
                usuario: {
                    select: {
                        id_usu: true,
                        nom_usu: true,
                        apell_usu: true,
                        email_usu: true,
                    },
                },
                receptor: {
                    select: {
                        id_usu: true,
                        nom_usu: true,
                        apell_usu: true,
                        email_usu: true,
                    },
                },
            },
        })
    },

    findDonationReceiver: async () => {
        const configuredId = Number(process.env.SUPERADMIN_USER_ID || 0)
        if (configuredId > 0) {
            const usuario = await prisma.usuarios.findUnique({ where: { id_usu: configuredId }, include: { rol: true } })
            if (usuario) return usuario
        }

        return await prisma.usuarios.findFirst({
            where: { rol: { codigo: 'admin-sistema' } },
            include: { rol: true },
            orderBy: { id_usu: 'asc' },
        })
    },

    updateGeneratedQr: async (id: number, data: {
        provider_payment_id: string
        provider: string
        validation_method: string
        monto_a_pagar: string
        codigo: string
        qr_payload: string
        qr_image_base64?: string | null
        estado: estado_pago_qr
        provider_status?: string | null
        provider_message?: string
        estimated_seconds?: number
        attempts?: Prisma.InputJsonValue
    }) => {
        return await prisma.pagos_qr.update({
            where: { id_pago: id },
            data: {
                provider_payment_id: data.provider_payment_id,
                provider: data.provider,
                validation_method: data.validation_method,
                monto_a_pagar: data.monto_a_pagar,
                codigo: data.codigo,
                qr_payload: data.qr_payload,
                qr_image_base64: data.qr_image_base64,
                estado: data.estado,
                provider_status: data.provider_status,
                provider_message: data.provider_message,
                estimated_seconds: data.estimated_seconds,
                attempts: data.attempts,
            },
        })
    },

    updateStatus: async (id: number, data: { estado: estado_pago_qr; provider_status?: string | null; provider_message?: string; notification?: Prisma.InputJsonValue }) => {
        return await prisma.pagos_qr.update({
            where: { id_pago: id },
            data: {
                estado: data.estado,
                provider_status: data.provider_status,
                provider_message: data.provider_message,
                notification: data.notification,
                fecha_pagado: data.estado === estado_pago_qr.PAGADO ? new Date() : undefined,
            },
        })
    },
}
