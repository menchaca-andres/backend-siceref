import { Router } from 'express'
import { UsuarioController } from './usuario.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar, autorizarAlguno, autorizarPerfilPropioOPermiso } from '../../middleware/roles.middleware'
import { uploadImage } from '../../middleware/upload.middleware'
import { cacheResponse, invalidateCache } from '../../middleware/cache.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('usuarios:obtener'), cacheResponse({ namespace: 'usuarios', scope: 'role', ttlSeconds: 120 }), UsuarioController.getAll)
router.get('/trabajadores/mis-trabajadores', verificarToken, autorizar('trabajadores:obtener'), cacheResponse({ namespace: 'usuarios', scope: 'refugio', ttlSeconds: 120 }), UsuarioController.getMyWorkers)
router.get('/:id', verificarToken, autorizarAlguno('perfil:obtener', 'usuarios:obtener'), autorizarPerfilPropioOPermiso('usuarios:obtener'), cacheResponse({ namespace: 'usuarios', scope: 'user', ttlSeconds: 120 }), UsuarioController.getById)
router.post('/', verificarToken, autorizar('usuarios:crear'), uploadImage.single('img_usu'), invalidateCache('usuarios'), UsuarioController.create)
router.put('/:id', verificarToken, autorizarAlguno('perfil:modificar', 'usuarios:modificar'), autorizarPerfilPropioOPermiso('usuarios:modificar'), uploadImage.single('img_usu'), invalidateCache('usuarios'), UsuarioController.update)
router.delete('/:id', verificarToken, autorizarAlguno('perfil:eliminar', 'usuarios:eliminar'), autorizarPerfilPropioOPermiso('usuarios:eliminar'), invalidateCache('usuarios'), UsuarioController.delete)

export default router
