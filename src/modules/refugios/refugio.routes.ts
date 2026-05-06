import { Router } from 'express'
import { RefugioController } from './refugio.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar, autorizarAlguno, autorizarRefugioPropioOPermiso } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('refugios:obtener'), RefugioController.getAll)
router.get('/:id', verificarToken, autorizarAlguno('refugio:obtener:propio', 'refugios:obtener'), autorizarRefugioPropioOPermiso('refugios:obtener'), RefugioController.getById)
router.post('/', verificarToken, autorizar('refugios:crear'), RefugioController.create)
router.put('/:id', verificarToken, autorizarAlguno('refugio:modificar:propio', 'refugios:modificar'), autorizarRefugioPropioOPermiso('refugios:modificar'), RefugioController.update)
router.delete('/:id', verificarToken, autorizar('refugios:eliminar'), RefugioController.delete)

export default router
