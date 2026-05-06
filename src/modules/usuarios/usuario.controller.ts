import { Request, Response } from 'express'
import { UsuarioService } from './usuario.service'

export const UsuarioController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const usuarios = await UsuarioService.getAll()
            res.json(usuarios)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getMyWorkers: async (req: Request, res: Response) => {
        try {
            const trabajadores = await UsuarioService.getMyWorkers(req.usuario?.id_ref ?? null)
            res.json(trabajadores)
        } catch (error: any) {
            res.status(403).json({ message: error.message })
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const usuario = await UsuarioService.getById(Number(req.params.id))
            res.json(usuario)
        } catch (error: any) {
            res.status(404).json({ message: error.message })
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const usuario = await UsuarioService.create(req.body)
            res.status(201).json(usuario)
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const usuario = await UsuarioService.update(Number(req.params.id), req.body)
            res.json(usuario)
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
