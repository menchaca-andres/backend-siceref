import { estado_pago_qr, Prisma } from '../../../../generated/prisma/client'
import { PagoModel } from '../pago.model'
import { AdbController } from './adb.controller'
import { AndroidNotification, NotificationParserService } from './notification-parser.service'

let timer: NodeJS.Timeout | null = null
let running = false
const seen = new Set<string>()

const config = () => {
    const packages = (process.env.QR_ADB_PACKAGES || '')
        .split(',')
        .map((pkg) => pkg.trim())
        .filter(Boolean)

    return {
        enabled: process.env.QR_ADB_ENABLED === 'true',
        adbPath: process.env.QR_ADB_PATH || 'adb',
        serial: process.env.QR_ADB_DEVICE_SERIAL || undefined,
        pollMs: Number(process.env.QR_ADB_POLL_MS || 2000),
        packages: new Set(packages),
        provider: process.env.QR_ADB_PROVIDER || undefined,
    }
}

const notificationKey = (notification: AndroidNotification) => {
    return notification.key || `${notification.pkg}:${notification.when || ''}:${NotificationParserService.blob(notification)}`
}

const snapshotInitial = async (adb: AdbController, packages: Set<string>) => {
    const dump = await adb.dumpNotifications()
    const notifications = NotificationParserService.parse(dump, packages)
    notifications.forEach((notification) => seen.add(notificationKey(notification)))
    console.log(`QR ADB: ${notifications.length} notificaciones iniciales ignoradas`)
}

const tryMatchPayment = async (notification: AndroidNotification, provider?: string) => {
    const blob = NotificationParserService.blob(notification)
    if (!blob) return

    const amounts = new Set(NotificationParserService.extractAmounts(blob))
    if (amounts.size === 0) return

    const payments = await PagoModel.findPendingActive(provider)
    const upperBlob = blob.toUpperCase()

    for (const payment of payments) {
        const codeMatches = payment.codigo && upperBlob.includes(payment.codigo.toUpperCase())
        const expectedAmount = Number(payment.monto_a_pagar ?? payment.monto).toFixed(2)
        const amountMatches = amounts.has(expectedAmount)
        const matched = codeMatches && amountMatches

        if (!matched) continue

        await PagoModel.updateStatus(payment.id_pago, {
            estado: estado_pago_qr.PAGADO,
            provider_status: 'paid',
            provider_message: 'Pago confirmado por notificacion ADB',
            notification: notification as Prisma.InputJsonValue,
        })

        console.log(`QR ADB: pago ${payment.id_pago} marcado como PAGADO`)
        return
    }
}

const pollOnce = async (adb: AdbController, packages: Set<string>, provider?: string) => {
    if (running) return
    running = true

    try {
        const dump = await adb.dumpNotifications()
        const notifications = NotificationParserService.parse(dump, packages)

        for (const notification of notifications) {
            const key = notificationKey(notification)
            if (seen.has(key)) continue
            seen.add(key)
            await tryMatchPayment(notification, provider)
        }
    } catch (error: any) {
        console.warn(`QR ADB: error leyendo notificaciones: ${error.message}`)
    } finally {
        running = false
    }
}

export const PaymentNotificationWorkerService = {
    start: async () => {
        const cfg = config()
        if (!cfg.enabled) return

        if (cfg.packages.size === 0) {
            console.warn('QR ADB: QR_ADB_PACKAGES no configurado; worker desactivado')
            return
        }

        const adb = new AdbController(cfg.adbPath, cfg.serial)
        const online = await adb.deviceOnline()
        if (!online) {
            console.warn('QR ADB: no hay dispositivo ADB online/autorizado; worker desactivado')
            return
        }

        await snapshotInitial(adb, cfg.packages)
        timer = setInterval(() => {
            pollOnce(adb, cfg.packages, cfg.provider)
        }, cfg.pollMs)
        console.log(`QR ADB: worker iniciado cada ${cfg.pollMs}ms`)
    },

    stop: () => {
        if (!timer) return
        clearInterval(timer)
        timer = null
    },
}
