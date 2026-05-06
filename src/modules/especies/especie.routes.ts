import { Router } from 'express'
import { EspecieController } from './especie.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('especies:obtener'), EspecieController.getAll)
router.get('/:id', verificarToken, autorizar('especies:obtener'), EspecieController.getById)
router.post('/', verificarToken, autorizar('especies:crear'), EspecieController.create)
router.put('/:id', verificarToken, autorizar('especies:modificar'), EspecieController.update)
router.delete('/:id', verificarToken, autorizar('especies:eliminar'), EspecieController.delete)

export default router
