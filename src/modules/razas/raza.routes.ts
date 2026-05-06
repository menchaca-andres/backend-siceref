import { Router } from 'express'
import { RazaController } from './raza.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('razas:obtener'), RazaController.getAll)
router.get('/:id', verificarToken, autorizar('razas:obtener'), RazaController.getById)
router.post('/', verificarToken, autorizar('razas:crear'), RazaController.create)
router.put('/:id', verificarToken, autorizar('razas:modificar'), RazaController.update)
router.delete('/:id', verificarToken, autorizar('razas:eliminar'), RazaController.delete)

export default router
