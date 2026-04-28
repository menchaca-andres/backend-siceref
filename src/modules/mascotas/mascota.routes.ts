import { Router } from 'express'
import { MascotaController } from './mascota.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('Superadmin', 'Administrador Refugio', 'Trabajador Refugio'), MascotaController.getAll)
router.get('/:id', verificarToken, autorizar('Superadmin', 'Administrador Refugio', 'Trabajador Refugio'), MascotaController.getById)
router.post('/', verificarToken, autorizar('Superadmin', 'Administrador Refugio'), MascotaController.create)
router.put('/:id', verificarToken, autorizar('Superadmin', 'Administrador Refugio'), MascotaController.update)
router.delete('/:id', verificarToken, autorizar('Superadmin', 'Administrador Refugio'), MascotaController.delete)

export default router