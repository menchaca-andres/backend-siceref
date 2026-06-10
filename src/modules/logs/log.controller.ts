import { Request, Response } from 'express'
import { AuditLogService } from '../../services/audit-log.service'

export const LogController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const logs = await AuditLogService.findAll({
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 50,
                id_usu: req.query.id_usu ? Number(req.query.id_usu) : undefined,
                accion: typeof req.query.accion === 'string' ? req.query.accion : undefined,
                entidad: typeof req.query.entidad === 'string' ? req.query.entidad : undefined,
            })

            res.json(logs)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },
}
