import { Request, Response } from 'express'
import { ConversacionService } from './conversacion.service'

export const ConversacionController = {
    getMine: async (req: Request, res: Response) => {
        try {
            const conversaciones = await ConversacionService.getMine(req.usuario!)
            res.json(conversaciones)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const conversacion = await ConversacionService.getById(Number(req.params.id_conv), req.usuario!)
            res.json(conversacion)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    getByPublicacion: async (req: Request, res: Response) => {
        try {
            const conversacion = await ConversacionService.getByPublicacion(Number(req.params.id_publi), req.usuario!)
            res.json(conversacion)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    createMensajeByPublicacion: async (req: Request, res: Response) => {
        try {
            const mensaje = await ConversacionService.createMensajeByPublicacion(Number(req.params.id_publi), req.body, req.usuario!)
            res.status(201).json(mensaje)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    createMensajeByConversacion: async (req: Request, res: Response) => {
        try {
            const mensaje = await ConversacionService.createMensajeByConversacion(Number(req.params.id_conv), req.body, req.usuario!)
            res.status(201).json(mensaje)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },
}
