import { Router } from 'express'
import { EspecieController } from './especie.controller'

const router = Router()

router.get('/', EspecieController.getAll)
router.get('/:id', EspecieController.getById)
router.post('/', EspecieController.create)
router.put('/:id', EspecieController.update)
router.delete('/:id', EspecieController.delete)

export default router