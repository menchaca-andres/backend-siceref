import { NextFunction, Request, Response } from 'express'
import { AuditLogService } from '../services/audit-log.service'

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

const ENTITY_ID_KEYS = [
    'id_usu',
    'id_ref',
    'id_ani',
    'id_publi',
    'id_pago',
    'id_conv',
    'id_msj',
    'id_esp',
    'id_raza',
    'id_tam',
    'id_rol',
    'id_per',
    'id_noti',
    'id',
]

const getOperation = (method: string) => {
    if (method === 'POST') return 'crear'
    if (method === 'DELETE') return 'eliminar'
    return 'modificar'
}

const getEntity = (req: Request) => {
    const segments = req.originalUrl.split('?')[0].split('/').filter(Boolean)
    return segments[0] === 'api' ? segments[1] : segments[0]
}

const getRouteParts = (req: Request) => {
    const routePath: string = typeof req.route?.path === 'string' ? req.route.path : ''

    return routePath
        .split('/')
        .filter((part: string) => part && !part.startsWith(':'))
        .map((part: string) => part.replace(/[^a-zA-Z0-9_-]/g, ''))
        .filter(Boolean)
}

const buildAction = (req: Request) => {
    const entity = getEntity(req) ?? 'general'
    return [entity, getOperation(req.method), ...getRouteParts(req)].join('.').slice(0, 120)
}

const getParamEntityId = (req: Request) => {
    const idKey = Object.keys(req.params).find((key) => key === 'id' || key.startsWith('id_'))
    const value = idKey ? req.params[idKey] : null
    return Array.isArray(value) ? value[0] ?? null : value
}

const getResponseEntityId = (body: unknown): string | number | null => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null

    const record = body as Record<string, unknown>
    const key = ENTITY_ID_KEYS.find((idKey) => record[idKey] !== undefined)
    if (key && (typeof record[key] === 'string' || typeof record[key] === 'number')) return record[key]

    for (const value of Object.values(record)) {
        const nestedId = getResponseEntityId(value)
        if (nestedId !== null) return nestedId
    }

    return null
}

const getBodyFields = (body: unknown) => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return []
    return Object.keys(body).filter((key) => key !== 'pass_usu')
}

export const auditarAccionesUsuario = (req: Request, res: Response, next: NextFunction) => {
    let responseBody: unknown
    const originalJson = res.json.bind(res)

    res.json = (body: unknown) => {
        responseBody = body
        return originalJson(body)
    }

    res.on('finish', () => {
        if (!MUTATING_METHODS.has(req.method) || !req.usuario || res.statusCode >= 400) return

        const entidad = getEntity(req) ?? null
        const id_entidad = getParamEntityId(req) ?? getResponseEntityId(responseBody)

        void AuditLogService.create({
            req,
            accion: buildAction(req),
            entidad,
            id_entidad,
            detalle: {
                method: req.method,
                path: req.originalUrl,
                status_code: res.statusCode,
                params: req.params,
                query: req.query,
                body_fields: getBodyFields(req.body),
                file_field: req.file?.fieldname ?? null,
            },
        }).catch((error) => {
            console.error('Error al registrar log de usuario:', error)
        })
    })

    next()
}
