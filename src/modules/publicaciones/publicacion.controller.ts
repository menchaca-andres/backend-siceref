import { Request, Response } from 'express'
import { PublicacionService } from './publicacion.service'

export const PublicacionController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const id_ref = req.query.id_ref === undefined ? null : Number(req.query.id_ref)
            const id_ani = req.query.id_ani === undefined ? undefined : Number(req.query.id_ani)
            const publicaciones = await PublicacionService.getAll(id_ref, id_ani)
            res.json(publicaciones)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getMine: async (req: Request, res: Response) => {
        try {
            const publicaciones = await PublicacionService.getMine(req.usuario?.id_ref ?? null)
            res.json(publicaciones)
        } catch (error: any) {
            res.status(403).json({ message: error.message })
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const publicacion = await PublicacionService.getById(Number(req.params.id), req.usuario?.id_ref ?? null)
            res.json(publicacion)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const publicacion = await PublicacionService.create(req.body, req.usuario?.id_ref ?? null)
            res.status(201).json(publicacion)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const publicacion = await PublicacionService.update(Number(req.params.id), req.body, req.usuario?.id_ref ?? null)
            res.json(publicacion)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await PublicacionService.delete(Number(req.params.id), req.usuario?.id_ref ?? null)
            res.json({ message: 'Publicacion eliminada correctamente' })
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },
}
