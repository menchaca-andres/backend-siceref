import { Request, Response, NextFunction } from 'express'

export const autorizar = (...rolesPermitidos: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' })
            return
        }

        if (!rolesPermitidos.includes(req.usuario.nom_rol)) {
            res.status(403).json({ message: 'No tienes permisos para esta acción' })
            return
        }

        next()
    }
}