import { Router } from 'express'
import { RefugioController } from './refugio.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('Superadmin'), RefugioController.getAll)
router.get('/:id', verificarToken, autorizar('Superadmin'), RefugioController.getById)
router.post('/', verificarToken, autorizar('Superadmin'), RefugioController.create)
router.put('/:id', verificarToken, autorizar('Superadmin'), RefugioController.update)
router.delete('/:id', verificarToken, autorizar('Superadmin'), RefugioController.delete)

export default router