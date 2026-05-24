import { Request, Response } from 'express'
import { NotificacionService } from './notificacion.service'

export const NotificacionController = {
    getMine: async (req: Request, res: Response) => {
        try {
            const notificaciones = await NotificacionService.getMine(req.usuario!.id_usu)
            res.json(notificaciones)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const notificacion = await NotificacionService.update(Number(req.params.id), req.body, req.usuario!.id_usu)
            res.json(notificacion)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    markAsRead: async (req: Request, res: Response) => {
        try {
            const notificacion = await NotificacionService.markAsRead(Number(req.params.id), req.usuario!.id_usu)
            res.json(notificacion)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },
}
