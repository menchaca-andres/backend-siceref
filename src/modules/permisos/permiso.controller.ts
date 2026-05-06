import { Request, Response } from 'express'
import { PermisoService } from './permiso.service'

export const PermisoController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const permisos = await PermisoService.getAll()
      res.json(permisos)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const permiso = await PermisoService.getById(Number(req.params.id))
      res.json(permiso)
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const permiso = await PermisoService.create(req.body)
      res.status(201).json(permiso)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const permiso = await PermisoService.update(Number(req.params.id), req.body)
      res.json(permiso)
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await PermisoService.delete(Number(req.params.id))
      res.json({ message: 'Permiso eliminado correctamente' })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },
}
