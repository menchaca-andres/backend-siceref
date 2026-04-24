import { Request, Response } from 'express'
import { UsuarioService } from './usuario.service'
import { RoleService } from '../roles/role.service'

export const UsuarioController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const roles = await UsuarioService.getAll()
            res.json(roles)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const role = await UsuarioService.getById(Number(req.params.id))
            res.json(role)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const role = await UsuarioService.create(req.body)
            res.status(201).json(role)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const role = await UsuarioService.update(Number(req.params.id), req.body)
            res.json(role)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await UsuarioService.delete(Number(req.params.id))
            res.json({ message: 'Usuario eliminado correctamente' })
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },
}