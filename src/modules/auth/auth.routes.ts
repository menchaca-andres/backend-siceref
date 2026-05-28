import { Router } from 'express'
import { AuthController } from './auth.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'
import { uploadImage } from '../../middleware/upload.middleware'

const router = Router()

router.post('/login', AuthController.login)
router.post('/register', uploadImage.single('img_usu'), AuthController.register)
router.post('/register/worker', verificarToken, autorizar('trabajadores:crear'), uploadImage.single('img_usu'), AuthController.registerWorker)
router.post('/register/superadmin', verificarToken, autorizar('admins-sistema:crear'), uploadImage.single('img_usu'), AuthController.registerSuperadmin)
router.post('/register/admin-refugio', verificarToken, autorizar('admins-refugio:crear'), uploadImage.single('img_usu'), AuthController.registerAdminRefugio)

export default router
