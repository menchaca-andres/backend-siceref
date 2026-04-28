import { Request, Response } from 'express'
import { AuthService } from './auth.service'

export const AuthController = {
    login: async (req: Request, res: Response) => {
        try {
            const result = await AuthService.login(req.body)
            res.json(result)
        } catch (error: any) {
            res.status(401).json({ message: error.message })
        }
    },

    register: async (req: Request, res: Response) => {
        try {
            const usuario = await AuthService.register(req.body)
            res.status(201).json({ message: 'Adoptante registrado correctamente', usuario })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    registerWorker: async (req: Request, res: Response) => {
        try {
            const adminRefugId = req.usuario?.id_refug ?? null
            const worker = await AuthService.registerWorker(req.body, adminRefugId)
            res.status(201).json({ message: 'Trabajador registrado correctamente', worker })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    registerSuperadmin: async (req: Request, res: Response) => {
        try {
            const usuario = await AuthService.registerSuperadmin(req.body)
            res.status(201).json({ message: 'Superadmin registrado correctamente', usuario })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
}