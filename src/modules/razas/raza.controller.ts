import { Request, Response } from 'express'
import { RazaService } from './raza.service'

export const RazaController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const razas = await RazaService.getAll()
            res.json(razas)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const raza = await RazaService.getById(Number(req.params.id))
            res.json(raza)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const raza = await RazaService.create(req.body)
            res.status(201).json(raza)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const raza = await RazaService.update(Number(req.params.id), req.body)
            res.json(raza)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await RazaService.delete(Number(req.params.id))
            res.json({ message: 'Raza eliminada correctamente' })
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },
}