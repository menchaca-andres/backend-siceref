import { Router } from 'express'
import { RoleController } from './role.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('Superadmin'), RoleController.getAll)
router.get('/:id', verificarToken, autorizar('Superadmin'), RoleController.getById)
router.post('/', verificarToken, autorizar('Superadmin'), RoleController.create)
router.put('/:id', verificarToken, autorizar('Superadmin'), RoleController.update)
router.delete('/:id', verificarToken, autorizar('Superadmin'), RoleController.delete)

export default router