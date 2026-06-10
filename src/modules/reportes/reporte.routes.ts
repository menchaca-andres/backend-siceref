import { Router } from 'express'
import { verificarToken } from '../../middleware/auth.middleware'
import { autorizarRol } from '../../middleware/roles.middleware'
import { ReporteController } from './reporte.controller'

const router = Router()

router.get('/estadisticas', verificarToken, autorizarRol('admin-sistema'), ReporteController.getEstadisticasSistema)
router.get('/estadisticas/refugio', verificarToken, autorizarRol('admin-refugio'), ReporteController.getEstadisticasRefugio)
router.get('/usuarios', verificarToken, autorizarRol('admin-sistema'), ReporteController.getUsuarios)
router.get('/procesos', verificarToken, autorizarRol('admin-sistema'), ReporteController.getProcesosSistema)
router.get('/procesos/refugio', verificarToken, autorizarRol('admin-refugio'), ReporteController.getProcesosRefugio)
router.get('/transacciones', verificarToken, autorizarRol('admin-sistema'), ReporteController.getTransacciones)
router.get('/donaciones', verificarToken, autorizarRol('admin-sistema'), ReporteController.getDonacionesSistema)
router.get('/donaciones/refugio', verificarToken, autorizarRol('admin-refugio'), ReporteController.getDonacionesRefugio)

export default router
