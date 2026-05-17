import { Router } from 'express'
import { TamanioController } from './tamanio.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('tamanios:obtener'), TamanioController.getAll)
router.get('/:id', verificarToken, autorizar('tamanios:obtener'), TamanioController.getById)
router.post('/', verificarToken, autorizar('tamanios:crear'), TamanioController.create)
router.put('/:id', verificarToken, autorizar('tamanios:modificar'), TamanioController.update)
router.put('/:id/activar', verificarToken, autorizar('tamanios:modificar'), TamanioController.activate)
router.delete('/:id', verificarToken, autorizar('tamanios:eliminar'), TamanioController.delete)

export default router
