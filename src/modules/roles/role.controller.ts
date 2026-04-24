import { Request, Response } from 'express'
import { RoleService } from './role.service'

export const RoleController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const roles = await RoleService.getAll()
            res.json(roles)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const role = await RoleService.getById(Number(req.params.id))
            res.json(role)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const role = await RoleService.create(req.body)
            res.status(201).json(role)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const role = await RoleService.update(Number(req.params.id), req.body)
            res.json(role)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await RoleService.delete(Number(req.params.id))
            res.json({ message: 'Rol eliminado correctamente' })
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },
}