import { Router } from 'express'
import { TamanioController } from './tamanio.controller'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizar } from '../../middleware/roles.middleware'
import { cacheResponse, invalidateCache } from '../../middleware/cache.middleware'

const router = Router()

router.get('/public', cacheResponse({ namespace: 'tamanios' }), TamanioController.getAll)
router.get('/', verificarToken, autorizar('tamanios:obtener'), cacheResponse({ namespace: 'tamanios', scope: 'role' }), TamanioController.getAll)
router.get('/:id', verificarToken, autorizar('tamanios:obtener'), cacheResponse({ namespace: 'tamanios', scope: 'role' }), TamanioController.getById)
router.post('/', verificarToken, autorizar('tamanios:crear'), invalidateCache('tamanios', 'mascotas', 'publicaciones'), TamanioController.create)
router.put('/:id', verificarToken, autorizar('tamanios:modificar'), invalidateCache('tamanios', 'mascotas', 'publicaciones'), TamanioController.update)
router.put('/:id/activar', verificarToken, autorizar('tamanios:modificar'), invalidateCache('tamanios', 'mascotas', 'publicaciones'), TamanioController.activate)
router.delete('/:id', verificarToken, autorizar('tamanios:eliminar'), invalidateCache('tamanios', 'mascotas', 'publicaciones'), TamanioController.delete)

export default router
