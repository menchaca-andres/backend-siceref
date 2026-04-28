import { Router } from 'express'
import { RazaController } from './raza.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('Superadmin', 'Administrador Refugio', 'Trabajador Refugio'), RazaController.getAll)
router.get('/:id', verificarToken, autorizar('Superadmin', 'Administrador Refugio', 'Trabajador Refugio'), RazaController.getById)
router.post('/', verificarToken, autorizar('Superadmin', 'Administrador Refugio'), RazaController.create)
router.put('/:id', verificarToken, autorizar('Superadmin', 'Administrador Refugio'), RazaController.update)
router.delete('/:id', verificarToken, autorizar('Superadmin', 'Administrador Refugio'), RazaController.delete)

export default router