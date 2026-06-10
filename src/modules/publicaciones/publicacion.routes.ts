import { Router } from 'express'
import { PublicacionController } from './publicacion.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'
import { cacheResponse, invalidateCache } from '../../middleware/cache.middleware'

const router = Router()

router.get('/', cacheResponse({ namespace: 'publicaciones', ttlSeconds: 120 }), PublicacionController.getAll)
router.get('/mis-publicaciones', verificarToken, autorizar('publicaciones:obtener'), cacheResponse({ namespace: 'publicaciones', scope: 'refugio', ttlSeconds: 120 }), PublicacionController.getMine)
router.get('/:id', cacheResponse({ namespace: 'publicaciones', ttlSeconds: 120 }), PublicacionController.getById)
router.post('/', verificarToken, autorizar('publicaciones:crear'), invalidateCache('publicaciones'), PublicacionController.create)
router.put('/:id', verificarToken, autorizar('publicaciones:modificar'), invalidateCache('publicaciones'), PublicacionController.update)
router.delete('/:id', verificarToken, autorizar('publicaciones:eliminar'), invalidateCache('publicaciones'), PublicacionController.delete)

export default router
