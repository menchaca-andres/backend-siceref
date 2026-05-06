import { Router } from 'express'
import { PermisoController } from './permiso.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('permisos:obtener'), PermisoController.getAll)
router.get('/:id', verificarToken, autorizar('permisos:obtener'), PermisoController.getById)
router.post('/', verificarToken, autorizar('permisos:crear'), PermisoController.create)
router.put('/:id', verificarToken, autorizar('permisos:modificar'), PermisoController.update)
router.delete('/:id', verificarToken, autorizar('permisos:eliminar'), PermisoController.delete)

export default router
