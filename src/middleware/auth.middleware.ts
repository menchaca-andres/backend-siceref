import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'
import { JwtPayload } from '../modules/auth/auth.types'
import { activeOnly } from '../utils/soft-delete'

export const verificarToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload
        const usuario = await prisma.usuarios.findFirst({
            where: { id_usu: payload.id_usu, ...activeOnly },
            select: { id_usu: true },
        })

        if (!usuario) {
            res.status(401).json({ message: 'Usuario inactivo o eliminado' })
            return
        }

        req.usuario = payload
        next()
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado' })
    }
}
