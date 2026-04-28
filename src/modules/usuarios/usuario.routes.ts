import { Router } from 'express'
import { UsuarioController } from './usuario.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('Superadmin'), UsuarioController.getAll)
router.get('/:id', verificarToken, autorizar('Superadmin', 'Administrador Refugio', 'Trabajador Refugio', 'Adoptante'), UsuarioController.getById)
router.post('/', verificarToken, autorizar('Superadmin'), UsuarioController.create)
router.put('/:id', verificarToken, autorizar('Superadmin', 'Adoptante'), UsuarioController.update)
router.delete('/:id', verificarToken, autorizar('Superadmin'), UsuarioController.delete)

export default router