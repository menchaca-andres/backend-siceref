import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/database'

const obtenerPermisosDelRol = async (id_rol: number) => {
    const permisos = await prisma.rol_perm.findMany({
        where: { id_rol },
        include: { permiso: true },
    })

    return permisos.map((rolPerm) => rolPerm.permiso.codigo.toLowerCase())
}

const tienePermiso = async (id_rol: number, permiso: string) => {
    const permisos = await obtenerPermisosDelRol(id_rol)
    return permisos.includes(permiso.toLowerCase())
}

export const autorizar = (...permisosRequeridos: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' })
            return
        }

        const permisos = await obtenerPermisosDelRol(req.usuario.id_rol).catch(() => null)

        if (!permisos) {
            res.status(500).json({ message: 'No se pudieron validar los permisos' })
            return
        }

        const autorizado = permisosRequeridos.every((permiso) => permisos.includes(permiso.toLowerCase()))

        if (!autorizado) {
            res.status(403).json({ message: 'No tienes permisos para esta acción' })
            return
        }

        next()
    }
}

export const autorizarAlguno = (...permisosPermitidos: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' })
            return
        }

        const permisos = await obtenerPermisosDelRol(req.usuario.id_rol).catch(() => null)

        if (!permisos) {
            res.status(500).json({ message: 'No se pudieron validar los permisos' })
            return
        }

        const autorizado = permisosPermitidos.some((permiso) => permisos.includes(permiso.toLowerCase()))

        if (!autorizado) {
            res.status(403).json({ message: 'No tienes permisos para esta acción' })
            return
        }

        next()
    }
}

export const autorizarPerfilPropioOPermiso = (permisoGlobal: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' })
            return
        }

        if (req.usuario.id_usu === Number(req.params.id) || await tienePermiso(req.usuario.id_rol, permisoGlobal)) {
            next()
            return
        }

        res.status(403).json({ message: 'Solo puedes acceder a tu propio perfil' })
    }
}

export const autorizarRefugioPropioOPermiso = (permisoGlobal: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' })
            return
        }

        if (req.usuario.id_ref === Number(req.params.id) || await tienePermiso(req.usuario.id_rol, permisoGlobal)) {
            next()
            return
        }

        res.status(403).json({ message: 'Solo puedes acceder a tu propio refugio' })
    }
}
