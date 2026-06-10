import { Router } from 'express'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizarRol } from '../../middleware/roles.middleware'
import { LogController } from './log.controller'

const router = Router()

router.get('/', verificarToken, autorizarRol('admin-sistema'), LogController.getAll)

export default router
