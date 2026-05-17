import { Router } from 'express'
import { RazaController } from './raza.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar, autorizarRol } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('razas:obtener'), RazaController.getAll)
router.get('/:id', verificarToken, autorizar('razas:obtener'), RazaController.getById)
router.post('/', verificarToken, autorizarRol('admin-sistema'), autorizar('razas:crear'), RazaController.create)
router.put('/:id', verificarToken, autorizarRol('admin-sistema'), autorizar('razas:modificar'), RazaController.update)
router.delete('/:id', verificarToken, autorizarRol('admin-sistema'), autorizar('razas:eliminar'), RazaController.delete)

export default router
