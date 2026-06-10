import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuditLogService } from '../../services/audit-log.service'

export const AuthController = {
    login: async (req: Request, res: Response) => {
        try {
            const result = await AuthService.login(req.body)
            void AuditLogService.create({
                req,
                id_usu: result.usuario.id_usu,
                accion: 'auth.login',
                entidad: 'usuarios',
                id_entidad: result.usuario.id_usu,
                detalle: { email_usu: result.usuario.email_usu },
            }).catch((error) => {
                console.error('Error al registrar log de login:', error)
            })
            res.json(result)
        } catch (error: any) {
            res.status(401).json({ message: error.message })
        }
    },

    register: async (req: Request, res: Response) => {
        try {
            const usuario = await AuthService.register(req.body, req.file)
            void AuditLogService.create({
                req,
                id_usu: usuario.id_usu,
                accion: 'auth.register',
                entidad: 'usuarios',
                id_entidad: usuario.id_usu,
                detalle: { email_usu: usuario.email_usu },
            }).catch((error) => {
                console.error('Error al registrar log de registro:', error)
            })
            res.status(201).json({ message: 'Adoptante registrado correctamente', usuario })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    registerWorker: async (req: Request, res: Response) => {
        try {
            const adminRefugId = req.usuario?.id_ref ?? null
            const worker = await AuthService.registerWorker(req.body, adminRefugId, req.file)
            res.status(201).json({ message: 'Trabajador registrado correctamente', worker })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    registerSuperadmin: async (req: Request, res: Response) => {
        try {
            const usuario = await AuthService.registerSuperadmin(req.body, req.file)
            res.status(201).json({ message: 'Administrador del sistema registrado correctamente', usuario })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    registerAdminRefugio: async (req: Request, res: Response) => {
        try {
            const usuario = await AuthService.registerAdminRefugio(req.body, req.file)
            res.status(201).json({ message: 'Administrador de refugio registrado correctamente', usuario })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },
}
