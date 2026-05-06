import { Router } from 'express'
import { UsuarioController } from './usuario.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar, autorizarAlguno, autorizarPerfilPropioOPermiso } from '../../middleware/roles.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('usuarios:obtener'), UsuarioController.getAll)
router.get('/trabajadores/mis-trabajadores', verificarToken, autorizar('trabajadores:obtener'), UsuarioController.getMyWorkers)
router.get('/:id', verificarToken, autorizarAlguno('perfil:obtener', 'usuarios:obtener'), autorizarPerfilPropioOPermiso('usuarios:obtener'), UsuarioController.getById)
router.post('/', verificarToken, autorizar('usuarios:crear'), UsuarioController.create)
router.put('/:id', verificarToken, autorizarAlguno('perfil:modificar', 'usuarios:modificar'), autorizarPerfilPropioOPermiso('usuarios:modificar'), UsuarioController.update)
router.delete('/:id', verificarToken, autorizarAlguno('perfil:eliminar', 'usuarios:eliminar'), autorizarPerfilPropioOPermiso('usuarios:eliminar'), UsuarioController.delete)

export default router
