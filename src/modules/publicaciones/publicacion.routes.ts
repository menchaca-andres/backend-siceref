import { Router } from 'express'
import { PublicacionController } from './publicacion.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', PublicacionController.getAll)
router.get('/mis-publicaciones', verificarToken, autorizar('publicaciones:obtener'), PublicacionController.getMine)
router.get('/:id', PublicacionController.getById)
router.post('/', verificarToken, autorizar('publicaciones:crear'), PublicacionController.create)
router.put('/:id', verificarToken, autorizar('publicaciones:modificar'), PublicacionController.update)
router.delete('/:id', verificarToken, autorizar('publicaciones:eliminar'), PublicacionController.delete)

export default router
