import { estado_pago_qr, Prisma } from '../../../generated/prisma/client'

export interface CreatePagoQrDto {
    amount: number | string
    gloss: string
    expirationDate?: string
    expiresIn?: number | string
    currency?: string
}

export interface PagoQrEstadoProvider {
    estado: estado_pago_qr
    provider_status?: string | null
    provider_message?: string
    notification?: Prisma.InputJsonValue
}

export interface QrProviderResult {
    provider: string
    validation_method: string
    provider_payment_id: string
    status: estado_pago_qr
    amount_to_pay: string
    code: string
    qr_payload: string
    qr_image_base64?: string | null
    estimated_seconds: number
    message?: string
    raw?: unknown
}

export interface ConfirmPagoQrDto {
    code?: string
    amount: number | string
    provider?: string
    notification?: Prisma.InputJsonValue
}

export type QrValidationMethod = 'token_concept'
