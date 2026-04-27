import { Request, Response } from 'express'
import { RefugioService } from './refugio.service'

export const RefugioController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const refugios = await RefugioService.getAll()
            res.json(refugios)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const refugio = await RefugioService.getById(Number(req.params.id))
            res.json(refugio)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const refugio = await RefugioService.create(req.body)
            res.status(201).json(refugio)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const refugio = await RefugioService.update(Number(req.params.id), req.body)
            res.json(refugio)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await RefugioService.delete(Number(req.params.id))
            res.json({ message: 'Refugio eliminado correctamente' })
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },
}