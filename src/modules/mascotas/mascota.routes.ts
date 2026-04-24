import { Router } from 'express'
import { MascotaController } from './mascota.controller'

const router = Router()

router.get('/', MascotaController.getAll)
router.get('/:id', MascotaController.getById)
router.post('/', MascotaController.create)
router.put('/:id', MascotaController.update)
router.delete('/:id', MascotaController.delete)

export default router