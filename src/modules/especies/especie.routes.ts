import { Router } from 'express'
import { EspecieController } from './especie.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('Superadmin', 'Administrador Refugio', 'Trabajador Refugio'), EspecieController.getAll)
router.get('/:id', verificarToken, autorizar('Superadmin', 'Administrador Refugio', 'Trabajador Refugio'), EspecieController.getById)
router.post('/', verificarToken, autorizar('Superadmin', 'Administrador Refugio'), EspecieController.create)
router.put('/:id', verificarToken, autorizar('Superadmin', 'Administrador Refugio'), EspecieController.update)
router.delete('/:id', verificarToken, autorizar('Superadmin', 'Administrador Refugio'), EspecieController.delete)

export default router