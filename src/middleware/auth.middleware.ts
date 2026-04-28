import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { JwtPayload } from '../modules/auth/auth.types'

declare global {
    namespace Express {
        interface Request {
            usuario?: JwtPayload
        }
    }
}

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, env.jwt.secret) as JwtPayload
        req.usuario = payload
        next()
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' })
    }
}