import { estado_pago_qr } from '../../../generated/prisma/client'
import { QrProviderResult, QrValidationMethod } from './pago.types'

const CODE_ALPHABET = 'BCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LEN = 6
const DEFAULT_EXPIRES_IN = 900

const randomCode = () => {
    let code = ''
    for (let i = 0; i < CODE_LEN; i++) {
        code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
    }
    return code
}

const buildQrPayload = (data: {
    paymentId: string
    amount: string
    currency: string
    gloss: string
    code: string
    expiresAt: Date
    receiverUserId?: number | null
    validationMethod: QrValidationMethod
}) => {
    return JSON.stringify({
        type: 'SICEREF_QR_PAYMENT',
        payment_id: data.paymentId,
        amount: data.amount,
        currency: data.currency,
        gloss: data.gloss,
        code: data.code,
        validation_method: data.validationMethod,
        receiver_user_id: data.receiverUserId ?? null,
        expires_at: data.expiresAt.toISOString(),
    })
}

export const QrOrchestratorService = {
    defaultExpiresIn: () => Number(process.env.QR_DEFAULT_EXPIRES_IN || DEFAULT_EXPIRES_IN),

    generateCode: randomCode,

    createLocalQr: (data: {
        paymentId: string
        amount: string
        currency: string
        gloss: string
        code: string
        expiresAt: Date
        receiverUserId?: number | null
        validationMethod: QrValidationMethod
    }): QrProviderResult => {
        const estimatedSeconds = Number(process.env.QR_LOCAL_ESTIMATED_SECONDS || 1)

        return {
            provider: 'local',
            validation_method: data.validationMethod,
            provider_payment_id: data.paymentId,
            status: estado_pago_qr.PENDIENTE,
            amount_to_pay: data.amount,
            code: data.code,
            qr_payload: buildQrPayload(data),
            qr_image_base64: null,
            estimated_seconds: estimatedSeconds,
            message: 'QR local generado correctamente',
            raw: { provider: 'local' },
        }
    },
}
