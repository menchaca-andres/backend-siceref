import { Router } from 'express'
import { ConversacionController } from './conversacion.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('conversaciones:obtener'), ConversacionController.getMine)
router.get('/publicacion/:id_publi', verificarToken, autorizar('conversaciones:obtener'), ConversacionController.getByPublicacion)
router.post('/publicacion/:id_publi/mensajes', verificarToken, autorizar('mensajes-chat:crear'), ConversacionController.createMensajeByPublicacion)
router.get('/:id_conv', verificarToken, autorizar('conversaciones:obtener'), ConversacionController.getById)
router.post('/:id_conv/mensajes', verificarToken, autorizar('mensajes-chat:crear'), ConversacionController.createMensajeByConversacion)

export default router
