import { Router } from 'express'
import { AuthController } from './auth.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/register/worker', verificarToken, autorizar('Administrador Refugio'), AuthController.registerWorker)
router.post('/register/superadmin', verificarToken, autorizar('Superadmin'), AuthController.registerSuperadmin)
router.post('/register/admin-refugio', verificarToken, autorizar('Superadmin'), AuthController.registerAdminRefugio)

export default router