import { Router } from 'express'
import { NotificacionController } from './notificacion.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('notificaciones:obtener'), NotificacionController.getMine)
router.put('/:id', verificarToken, autorizar('notificaciones:modificar'), NotificacionController.update)
router.put('/:id/leida', verificarToken, autorizar('notificaciones:modificar'), NotificacionController.markAsRead)

export default router
