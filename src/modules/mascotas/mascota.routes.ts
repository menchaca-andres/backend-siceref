import { Router } from 'express'
import { MascotaController } from './mascota.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'
import { uploadImage } from '../../middleware/upload.middleware'
import { cacheResponse, invalidateCache } from '../../middleware/cache.middleware'

const router = Router()

router.get('/', verificarToken, autorizar('mascotas:obtener'), cacheResponse({ namespace: 'mascotas', scope: 'refugio', ttlSeconds: 120 }), MascotaController.getAll)
router.get('/:id', verificarToken, autorizar('mascotas:obtener'), cacheResponse({ namespace: 'mascotas', scope: 'role', ttlSeconds: 120 }), MascotaController.getById)
router.post('/', verificarToken, autorizar('mascotas:crear'), uploadImage.single('img_mascot'), invalidateCache('mascotas', 'publicaciones'), MascotaController.create)
router.put('/:id', verificarToken, autorizar('mascotas:modificar'), uploadImage.single('img_mascot'), invalidateCache('mascotas', 'publicaciones'), MascotaController.update)
router.delete('/:id', verificarToken, autorizar('mascotas:eliminar'), invalidateCache('mascotas', 'publicaciones'), MascotaController.delete)

export default router
