import { Router } from 'express'
import { MascotaController } from './mascota.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'
import { uploadImage } from '../../middleware/upload.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('mascotas:obtener'), MascotaController.getAll)
router.get('/:id', verificarToken, autorizar('mascotas:obtener'), MascotaController.getById)
router.post('/', verificarToken, autorizar('mascotas:crear'), uploadImage.single('img_mascot'), MascotaController.create)
router.put('/:id', verificarToken, autorizar('mascotas:modificar'), uploadImage.single('img_mascot'), MascotaController.update)
router.delete('/:id', verificarToken, autorizar('mascotas:eliminar'), MascotaController.delete)

export default router
