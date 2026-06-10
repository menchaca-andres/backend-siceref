import { Router } from 'express'
import { EspecieController } from './especie.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar, autorizarRol } from '../../middleware/roles.middleware'
import { cacheResponse, invalidateCache } from '../../middleware/cache.middleware'

const router = Router()

router.get('/public', cacheResponse({ namespace: 'especies' }), EspecieController.getAll)
router.get('/', verificarToken, autorizar('especies:obtener'), cacheResponse({ namespace: 'especies', scope: 'role' }), EspecieController.getAll)
router.get('/:id', verificarToken, autorizar('especies:obtener'), cacheResponse({ namespace: 'especies', scope: 'role' }), EspecieController.getById)
router.post('/', verificarToken, autorizarRol('admin-sistema'), autorizar('especies:crear'), invalidateCache('especies', 'razas', 'mascotas', 'publicaciones'), EspecieController.create)
router.put('/:id', verificarToken, autorizarRol('admin-sistema'), autorizar('especies:modificar'), invalidateCache('especies', 'razas', 'mascotas', 'publicaciones'), EspecieController.update)
router.delete('/:id', verificarToken, autorizarRol('admin-sistema'), autorizar('especies:eliminar'), invalidateCache('especies', 'razas', 'mascotas', 'publicaciones'), EspecieController.delete)

export default router
