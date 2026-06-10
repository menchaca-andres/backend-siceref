import { Router } from 'express'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizarRol } from '../../middleware/roles.middleware'
import { PagoController } from './pago.controller'

const router = Router()

router.post('/qr', verificarToken, PagoController.generarQr)
router.post('/notificaciones', verificarToken, PagoController.confirmarPorNotificacion)
router.get('/admin/resumen', verificarToken, autorizarRol('admin-sistema'), PagoController.obtenerResumenAdmin)
router.get('/admin/movimientos', verificarToken, autorizarRol('admin-sistema'), PagoController.listarMovimientosAdmin)
router.get('/:id/status', verificarToken, PagoController.consultarEstado)

export default router
