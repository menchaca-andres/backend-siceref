import { Router } from 'express'
import { UsuarioController } from './usuario.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar, autorizarAlguno, autorizarPerfilPropioOPermiso } from '../../middleware/roles.middleware'
import { uploadImage } from '../../middleware/upload.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('usuarios:obtener'), UsuarioController.getAll)
router.get('/trabajadores/mis-trabajadores', verificarToken, autorizar('trabajadores:obtener'), UsuarioController.getMyWorkers)
router.get('/:id', verificarToken, autorizarAlguno('perfil:obtener', 'usuarios:obtener'), autorizarPerfilPropioOPermiso('usuarios:obtener'), UsuarioController.getById)
router.post('/', verificarToken, autorizar('usuarios:crear'), uploadImage.single('img_usu'), UsuarioController.create)
router.put('/:id', verificarToken, autorizarAlguno('perfil:modificar', 'usuarios:modificar'), autorizarPerfilPropioOPermiso('usuarios:modificar'), uploadImage.single('img_usu'), UsuarioController.update)
router.delete('/:id', verificarToken, autorizarAlguno('perfil:eliminar', 'usuarios:eliminar'), autorizarPerfilPropioOPermiso('usuarios:eliminar'), UsuarioController.delete)

export default router
