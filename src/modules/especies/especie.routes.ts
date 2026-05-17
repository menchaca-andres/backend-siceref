import { Router } from 'express'
import { EspecieController } from './especie.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar, autorizarRol } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('especies:obtener'), EspecieController.getAll)
router.get('/:id', verificarToken, autorizar('especies:obtener'), EspecieController.getById)
router.post('/', verificarToken, autorizarRol('admin-sistema'), autorizar('especies:crear'), EspecieController.create)
router.put('/:id', verificarToken, autorizarRol('admin-sistema'), autorizar('especies:modificar'), EspecieController.update)
router.delete('/:id', verificarToken, autorizarRol('admin-sistema'), autorizar('especies:eliminar'), EspecieController.delete)

export default router
