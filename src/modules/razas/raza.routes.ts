import { Router } from 'express'
import { RazaController } from './raza.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar, autorizarRol } from '../../middleware/roles.middleware'
import { cacheResponse, invalidateCache } from '../../middleware/cache.middleware'

const router = Router()

router.get('/public', cacheResponse({ namespace: 'razas' }), RazaController.getAll)
router.get('/', verificarToken, autorizar('razas:obtener'), cacheResponse({ namespace: 'razas', scope: 'role' }), RazaController.getAll)
router.get('/:id', verificarToken, autorizar('razas:obtener'), cacheResponse({ namespace: 'razas', scope: 'role' }), RazaController.getById)
router.post('/', verificarToken, autorizarRol('admin-sistema'), autorizar('razas:crear'), invalidateCache('razas', 'mascotas', 'publicaciones'), RazaController.create)
router.put('/:id', verificarToken, autorizarRol('admin-sistema'), autorizar('razas:modificar'), invalidateCache('razas', 'mascotas', 'publicaciones'), RazaController.update)
router.delete('/:id', verificarToken, autorizarRol('admin-sistema'), autorizar('razas:eliminar'), invalidateCache('razas', 'mascotas', 'publicaciones'), RazaController.delete)

export default router
