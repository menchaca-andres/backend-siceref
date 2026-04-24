import { Router } from 'express'
import { RazaController } from './raza.controller'

const router = Router()

router.get('/', RazaController.getAll)
router.get('/:id', RazaController.getById)
router.post('/', RazaController.create)
router.put('/:id', RazaController.update)
router.delete('/:id', RazaController.delete)

export default router