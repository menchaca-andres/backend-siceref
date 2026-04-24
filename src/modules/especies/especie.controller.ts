import { Request, Response } from 'express'
import { EspecieService } from './especie.service'

export const EspecieController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const especie = await EspecieService.getAll()
            res.json(especie)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const especie = await EspecieService.getById(Number(req.params.id))
            res.json(especie)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const especie = await EspecieService.create(req.body)
            res.status(201).json(especie)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const especie = await EspecieService.update(Number(req.params.id), req.body)
            res.json(especie)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await EspecieService.delete(Number(req.params.id))
            res.json({ message: 'Especie eliminada correctamente' })
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },
}