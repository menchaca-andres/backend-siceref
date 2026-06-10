import { Request, Response } from 'express'
import { PagoService } from './pago.service'

export const PagoController = {
    obtenerResumenAdmin: async (_req: Request, res: Response) => {
        try {
            const resumen = await PagoService.obtenerResumenAdmin()
            res.json(resumen)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    listarMovimientosAdmin: async (_req: Request, res: Response) => {
        try {
            const movimientos = await PagoService.listarMovimientosAdmin()
            res.json(movimientos)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    generarQr: async (req: Request, res: Response) => {
        try {
            const pago = await PagoService.generarQr(req.body, req.usuario)
            res.status(201).json(pago)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    consultarEstado: async (req: Request, res: Response) => {
        try {
            const pago = await PagoService.consultarEstado(Number(req.params.id), req.usuario)
            res.json(pago)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    confirmarPorNotificacion: async (req: Request, res: Response) => {
        try {
            const pago = await PagoService.confirmarPorNotificacion(req.body)
            res.json(pago)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },
}
