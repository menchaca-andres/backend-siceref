import { Router } from 'express'
import { RefugioController } from './refugio.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar, autorizarAlguno, autorizarRefugioPropioOPermiso } from '../../middleware/roles.middleware'
import { uploadImage } from '../../middleware/upload.middleware'
import { cacheResponse, invalidateCache } from '../../middleware/cache.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('refugios:obtener'), cacheResponse({ namespace: 'refugios', scope: 'role' }), RefugioController.getAll)
router.get('/:id', verificarToken, autorizarAlguno('refugio:obtener:propio', 'refugios:obtener'), autorizarRefugioPropioOPermiso('refugios:obtener'), cacheResponse({ namespace: 'refugios', scope: 'user' }), RefugioController.getById)
router.post('/', verificarToken, autorizar('refugios:crear'), uploadImage.single('img_ref'), invalidateCache('refugios', 'mascotas', 'publicaciones'), RefugioController.create)
router.put('/:id', verificarToken, autorizarAlguno('refugio:modificar:propio', 'refugios:modificar'), autorizarRefugioPropioOPermiso('refugios:modificar'), uploadImage.single('img_ref'), invalidateCache('refugios', 'mascotas', 'publicaciones'), RefugioController.update)
router.delete('/:id', verificarToken, autorizar('refugios:eliminar'), invalidateCache('refugios', 'mascotas', 'publicaciones'), RefugioController.delete)

export default router
