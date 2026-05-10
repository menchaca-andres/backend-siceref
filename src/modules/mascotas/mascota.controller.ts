import { Request, Response } from 'express'
import { MascotaService } from './mascota.service'

export const MascotaController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const mascotas = await MascotaService.getAll()
            res.json(mascotas)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const mascota = await MascotaService.getById(Number(req.params.id))
            res.json(mascota)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const mascota = await MascotaService.create(req.body, req.file)
            res.status(201).json(mascota)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const mascota = await MascotaService.update(Number(req.params.id), req.body, req.file)
            res.json(mascota)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await MascotaService.delete(Number(req.params.id))
            res.json({ message: 'Mascota eliminada correctamente' })
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },
}
