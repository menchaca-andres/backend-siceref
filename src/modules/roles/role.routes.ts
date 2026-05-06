import { Router } from 'express'
import { RoleController } from './role.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('roles:obtener'), RoleController.getAll)
router.get('/:id', verificarToken, autorizar('roles:obtener'), RoleController.getById)
router.post('/', verificarToken, autorizar('roles:crear'), RoleController.create)
router.put('/:id', verificarToken, autorizar('roles:modificar'), RoleController.update)
router.delete('/:id', verificarToken, autorizar('roles:eliminar'), RoleController.delete)

export default router
