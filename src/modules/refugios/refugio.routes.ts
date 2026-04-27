import { Router } from 'express'
import { RefugioController } from './refugio.controller'

const router = Router()

router.get('/', RefugioController.getAll)
router.get('/:id', RefugioController.getById)
router.post('/', RefugioController.create)
router.put('/:id', RefugioController.update)
router.delete('/:id', RefugioController.delete)

export default router