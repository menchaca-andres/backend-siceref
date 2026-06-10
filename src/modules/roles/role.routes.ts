import { Router } from 'express'
import { RoleController } from './role.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'
import { cacheResponse, invalidateCache } from '../../middleware/cache.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('roles:obtener'), cacheResponse({ namespace: 'roles', scope: 'role' }), RoleController.getAll)
router.get('/:id', verificarToken, autorizar('roles:obtener'), cacheResponse({ namespace: 'roles', scope: 'role' }), RoleController.getById)
router.post('/', verificarToken, autorizar('roles:crear'), invalidateCache('roles', 'usuarios'), RoleController.create)
router.put('/:id', verificarToken, autorizar('roles:modificar'), invalidateCache('roles', 'usuarios'), RoleController.update)
router.delete('/:id', verificarToken, autorizar('roles:eliminar'), invalidateCache('roles', 'usuarios'), RoleController.delete)

export default router
