import { estado_pago_qr } from '../../../../generated/prisma/client'
import { QrProviderResult, QrValidationMethod } from '../pago.types'
import { AdbController } from './adb.controller'

type QrStep =
    | { action: 'launch'; package?: string; activity?: string; waitMs?: number }
    | { action: 'tap'; x: number; y: number; waitMs?: number }
    | { action: 'text'; value: string; waitMs?: number }
    | { action: 'keyevent'; code: string; waitMs?: number }
    | { action: 'wait'; waitMs: number }
    | { action: 'screencap'; crop?: { x: number; y: number; width: number; height: number }; waitMs?: number }

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const parseSteps = (envName: string) => {
    const raw = process.env[envName]
    if (!raw) return []

    const steps = JSON.parse(raw)
    if (!Array.isArray(steps)) throw new Error(`${envName} debe ser un array JSON`)
    return steps as QrStep[]
}

const interpolate = (value: string, data: { amount: string; code: string; gloss: string; validationMethod: QrValidationMethod; password?: string }) => {
    const concept = data.code

    return value
        .replace(/{{amount}}/g, data.amount)
        .replace(/{{code}}/g, data.code)
        .replace(/{{gloss}}/g, data.gloss)
        .replace(/{{concept}}/g, concept)
        .replace(/{{password}}/g, data.password || '')
}

const defaultLoginSteps = () => {
    if (process.env.QR_ADB_LOGIN_ENABLED !== 'true' || !process.env.QR_BANK_PASSWORD) return []

    return [
        { action: 'tap', x: 200, y: 1750, waitMs: 500 },
        { action: 'text', value: '{{password}}', waitMs: 500 },
        { action: 'tap', x: 545, y: 1936, waitMs: 3000 },
    ] as QrStep[]
}

const runSteps = async (adb: AdbController, steps: QrStep[], data: {
    amount: string
    code: string
    gloss: string
    validationMethod: QrValidationMethod
    password?: string
}, packageName: string) => {
    let qrImageBase64: string | null = null

    for (const step of steps) {
        if (step.action === 'launch') await adb.launchApp(step.package || packageName, step.activity)
        if (step.action === 'tap') await adb.tap(step.x, step.y)
        if (step.action === 'text') await adb.text(interpolate(step.value, data))
        if (step.action === 'keyevent') await adb.keyevent(step.code)
        if (step.action === 'screencap') qrImageBase64 = await adb.screencapBase64(step.crop)
        await sleep(step.waitMs ?? 500)
    }

    return qrImageBase64
}

export const AdbQrProviderService = {
    enabled: () => process.env.QR_ADB_GENERATION_ENABLED === 'true',

    createQr: async (data: {
        paymentId: string
        amount: string
        currency: string
        gloss: string
        code: string
        expiresAt: Date
        receiverUserId?: number | null
        validationMethod: QrValidationMethod
    }): Promise<QrProviderResult | null> => {
        if (!AdbQrProviderService.enabled()) return null

        const packageName = process.env.QR_ADB_BANK_PACKAGE
        if (!packageName) throw new Error('QR_ADB_BANK_PACKAGE no configurado')

        const adb = new AdbController(process.env.QR_ADB_PATH || 'adb', process.env.QR_ADB_DEVICE_SERIAL || undefined)
        const online = await adb.deviceOnline()
        if (!online) throw new Error('No hay dispositivo ADB online/autorizado')

        const loginSteps = parseSteps('QR_ADB_LOGIN_STEPS')
        const generateSteps = parseSteps('QR_ADB_GENERATE_STEPS')
        if (generateSteps.length === 0) throw new Error('QR_ADB_GENERATE_STEPS no configurado')

        const resolvedLoginSteps = loginSteps.length > 0 ? loginSteps : defaultLoginSteps()
        if (resolvedLoginSteps.length > 0) {
            await adb.launchApp(packageName)
            await sleep(Number(process.env.QR_ADB_AFTER_LAUNCH_LOGIN_MS || 3000))
        }

        await runSteps(adb, resolvedLoginSteps, {
            ...data,
            password: process.env.QR_BANK_PASSWORD,
        }, packageName)

        const qrImageBase64 = await runSteps(adb, generateSteps, {
            ...data,
            password: process.env.QR_BANK_PASSWORD,
        }, packageName)

        if (!qrImageBase64) throw new Error('El flujo ADB no capturo imagen QR; agrega un paso screencap')

        return {
            provider: process.env.QR_ADB_PROVIDER || 'adb-bank',
            validation_method: data.validationMethod,
            provider_payment_id: data.paymentId,
            status: estado_pago_qr.PENDIENTE,
            amount_to_pay: data.amount,
            code: data.code,
            qr_payload: JSON.stringify({
                type: 'SICEREF_ADB_BANK_QR',
                payment_id: data.paymentId,
                amount: data.amount,
                currency: data.currency,
                gloss: data.gloss,
                code: data.code,
                validation_method: data.validationMethod,
                receiver_user_id: data.receiverUserId ?? null,
                expires_at: data.expiresAt.toISOString(),
            }),
            qr_image_base64: qrImageBase64,
            estimated_seconds: Number(process.env.QR_ADB_ESTIMATED_SECONDS || 30),
            message: 'QR bancario generado por ADB',
            raw: { packageName },
        }
    },
}
