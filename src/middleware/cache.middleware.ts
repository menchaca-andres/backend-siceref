import { NextFunction, Request, Response } from 'express'
import { CacheService } from '../services/cache.service'

type CacheScope = 'public' | 'role' | 'refugio' | 'user'

type CacheOptions = {
    namespace: string
    ttlSeconds?: number
    scope?: CacheScope
}

const defaultTtl = Number(process.env.CACHE_TTL_SECONDS || 300)

const getScopeKey = (req: Request, scope: CacheScope) => {
    if (scope === 'role') return `role:${req.usuario?.id_rol ?? 'anonymous'}`
    if (scope === 'refugio') return `refugio:${req.usuario?.id_ref ?? 'none'}`
    if (scope === 'user') return `user:${req.usuario?.id_usu ?? 'anonymous'}`
    return 'public'
}

const buildCacheKey = (req: Request, options: CacheOptions) => {
    return `http:${options.namespace}:${getScopeKey(req, options.scope ?? 'public')}:${req.originalUrl}`
}

export const cacheResponse = (options: CacheOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET') return next()

        const cacheKey = buildCacheKey(req, options)
        const cached = await CacheService.get<unknown>(cacheKey)

        if (cached !== null) {
            res.setHeader('X-Cache', 'HIT')
            return res.json(cached)
        }

        const originalJson = res.json.bind(res)

        res.json = (body: unknown) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                res.setHeader('X-Cache', 'MISS')
                void CacheService.set(cacheKey, body, options.ttlSeconds ?? defaultTtl)
            }

            return originalJson(body)
        }

        return next()
    }
}

export const invalidateCache = (...prefixes: string[]) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        res.on('finish', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                prefixes.forEach((prefix) => {
                    void CacheService.deleteByPrefix(`http:${prefix}`)
                })
            }
        })

        next()
    }
}
