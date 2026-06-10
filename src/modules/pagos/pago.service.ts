import { estado_pago_qr } from '../../../generated/prisma/client'
import { PagoModel } from './pago.model'
import { ConfirmPagoQrDto, CreatePagoQrDto, PagoQrEstadoProvider, QrValidationMethod } from './pago.types'
import { AdbQrProviderService } from './adb/adb-qr-provider.service'
import { QrOrchestratorService } from './qr-orchestrator.service'

const calcularFechaExpiracion = (expirationDate?: string, expiresIn?: number | string) => {
    if (!expirationDate) {
        return new Date(Date.now() + Number(expiresIn || QrOrchestratorService.defaultExpiresIn()) * 1000)
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(expirationDate)) throw new Error('La fecha de expiracion debe tener formato YYYY-MM-DD')

    const date = new Date(`${expirationDate}T00:00:00.000Z`)
    if (Number.isNaN(date.getTime())) throw new Error('La fecha de expiracion no es valida')

    return date
}

const validarMonto = (value: number | string) => {
    const amount = Number(value)
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('El monto debe ser mayor a cero')
    return amount.toFixed(2)
}

const getValidationMethod = (): QrValidationMethod => 'token_concept'

const validarGlosa = (value: string) => {
    const gloss = value?.trim()
    if (!gloss) throw new Error('La glosa es obligatoria')
    return gloss
}

const asegurarAcceso = (pago: { id_usu: number | null; id_ref: number | null }, usuario?: { id_usu: number; id_ref?: number | null }) => {
    if (!usuario) throw new Error('No autenticado')
    if (pago.id_usu === usuario.id_usu) return
    if (pago.id_ref !== null && pago.id_ref === usuario.id_ref) return
    throw new Error('No puedes consultar este pago')
}

export const PagoService = {
    obtenerResumenAdmin: async () => {
        return await PagoModel.getAdminSummary()
    },

    listarMovimientosAdmin: async () => {
        return await PagoModel.findAdminMovements()
    },

    generarQr: async (data: CreatePagoQrDto, usuario?: { id_usu: number; id_ref?: number | null }) => {
        if (!usuario) throw new Error('No autenticado')

        const amount = validarMonto(data.amount)
        const gloss = validarGlosa(data.gloss)
        const expirationDate = calcularFechaExpiracion(data.expirationDate, data.expiresIn)
        const currency = (data.currency || 'BOB').trim().toUpperCase()
        const code = QrOrchestratorService.generateCode()
        const receiver = await PagoModel.findDonationReceiver()
        if (!receiver) throw new Error('No hay superadmin configurado para recibir donaciones')
        const validationMethod = getValidationMethod()
        const provider = AdbQrProviderService.enabled() ? process.env.QR_ADB_PROVIDER || 'adb-bank' : 'local'
        const amountToPay = amount

        const payment = await PagoModel.createQr({
            id_usu: usuario.id_usu,
            id_receptor: receiver.id_usu,
            id_ref: null,
            provider_payment_id: null,
            provider,
            validation_method: validationMethod,
            monto: amount,
            monto_a_pagar: amountToPay,
            moneda: currency,
            glosa: gloss,
            codigo: code,
            qr_payload: null,
            estado: estado_pago_qr.GENERANDO,
            provider_status: 'creating',
            provider_message: 'QR aceptado para generacion local',
            estimated_seconds: Number(process.env.QR_LOCAL_ESTIMATED_SECONDS || 1),
            attempts: [],
            fecha_expira: expirationDate,
        })

        const qrInput = {
            paymentId: String(payment.id_pago),
            amount: amountToPay,
            currency,
            gloss,
            code,
            expiresAt: expirationDate,
            receiverUserId: receiver.id_usu,
            validationMethod,
        }

        const qr = await AdbQrProviderService.createQr(qrInput) ?? QrOrchestratorService.createLocalQr(qrInput)

        return await PagoModel.updateGeneratedQr(payment.id_pago, {
            provider_payment_id: qr.provider_payment_id,
            provider: qr.provider,
            validation_method: qr.validation_method,
            monto_a_pagar: qr.amount_to_pay,
            codigo: qr.code,
            qr_payload: qr.qr_payload,
            qr_image_base64: qr.qr_image_base64,
            estado: qr.status,
            provider_status: 'pending',
            provider_message: qr.message,
            estimated_seconds: qr.estimated_seconds,
            attempts: [{ provider: qr.provider, ok: true, detail: 'qr listo', provider_payment_id: qr.provider_payment_id, at: new Date().toISOString() }],
        })
    },

    consultarEstado: async (id: number, usuario?: { id_usu: number; id_ref?: number | null }) => {
        const pago = await PagoModel.findById(id)
        if (!pago) throw new Error('Pago no encontrado')

        asegurarAcceso(pago, usuario)

        if (pago.estado === estado_pago_qr.PENDIENTE && pago.fecha_expira < new Date()) {
            const estado: PagoQrEstadoProvider = {
                estado: estado_pago_qr.EXPIRADO,
                provider_status: 'expired',
                provider_message: 'El QR expiro sin confirmacion de pago',
            }

            return await PagoModel.updateStatus(id, estado)
        }

        return pago
    },

    confirmarPorNotificacion: async (data: ConfirmPagoQrDto) => {
        const amount = validarMonto(data.amount)
        const provider = data.provider?.trim() || undefined
        const code = data.code?.trim().toUpperCase()
        const pago = code ? await PagoModel.findPendingByCodeAndAmount(code, amount, provider) : null

        if (!pago) throw new Error('No se encontro un pago pendiente para esa notificacion')

        return await PagoModel.updateStatus(pago.id_pago, {
            estado: estado_pago_qr.PAGADO,
            provider_status: 'paid',
            provider_message: 'Pago confirmado por notificacion',
            notification: data.notification ?? { code, amount, provider, validation_method: pago.validation_method },
        })
    },
}
