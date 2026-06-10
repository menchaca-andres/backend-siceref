import { Router } from 'express'
import { PermisoController } from './permiso.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'
import { cacheResponse, invalidateCache } from '../../middleware/cache.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('permisos:obtener'), cacheResponse({ namespace: 'permisos', scope: 'role' }), PermisoController.getAll)
router.get('/:id', verificarToken, autorizar('permisos:obtener'), cacheResponse({ namespace: 'permisos', scope: 'role' }), PermisoController.getById)
router.post('/', verificarToken, autorizar('permisos:crear'), invalidateCache('permisos', 'roles'), PermisoController.create)
router.put('/:id', verificarToken, autorizar('permisos:modificar'), invalidateCache('permisos', 'roles'), PermisoController.update)
router.delete('/:id', verificarToken, autorizar('permisos:eliminar'), invalidateCache('permisos', 'roles'), PermisoController.delete)

export default router
