import { Router } from 'express'
import { MascotaController } from './mascota.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('mascotas:obtener'), MascotaController.getAll)
router.get('/:id', verificarToken, autorizar('mascotas:obtener'), MascotaController.getById)
router.post('/', verificarToken, autorizar('mascotas:crear'), MascotaController.create)
router.put('/:id', verificarToken, autorizar('mascotas:modificar'), MascotaController.update)
router.delete('/:id', verificarToken, autorizar('mascotas:eliminar'), MascotaController.delete)

export default router
