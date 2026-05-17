import { Request, Response } from 'express'
import { TamanioService } from './tamanio.service'

export const TamanioController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const includeInactive = req.query.all === 'true'
            const tamanios = await TamanioService.getAll(includeInactive)
            res.json(tamanios)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const tamanio = await TamanioService.getById(Number(req.params.id))
            res.json(tamanio)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const tamanio = await TamanioService.create(req.body)
            res.status(201).json(tamanio)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const tamanio = await TamanioService.update(Number(req.params.id), req.body)
            res.json(tamanio)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await TamanioService.delete(Number(req.params.id))
            res.json({ message: 'Tamaño desactivado correctamente' })
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    activate: async (req: Request, res: Response) => {
        try {
            const tamanio = await TamanioService.activate(Number(req.params.id))
            res.json(tamanio)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },
}
