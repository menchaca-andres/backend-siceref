import { JwtPayload } from '../auth/auth.types'
import { ReporteModel } from './reporte.model'
import { ListReporteParams } from './reporte.types'

const resolveScope = (usuario: JwtPayload) => ({
    id_ref: usuario.id_ref ?? null,
})

const ensureRefugioScope = (usuario: JwtPayload) => {
    if (usuario.id_ref == null) throw new Error('No perteneces a ningun refugio')
    return { id_ref: usuario.id_ref }
}

const parseListParams = (query: Record<string, unknown>): ListReporteParams => ({
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 20,
    id_rol: query.id_rol ? Number(query.id_rol) : undefined,
    id_ref: query.id_ref ? Number(query.id_ref) : undefined,
    estado_proceso: typeof query.estado_proceso === 'string' ? query.estado_proceso as ListReporteParams['estado_proceso'] : undefined,
    estado_pago: typeof query.estado_pago === 'string' ? query.estado_pago : undefined,
    entidad: typeof query.entidad === 'string' ? query.entidad : undefined,
    accion: typeof query.accion === 'string' ? query.accion : undefined,
    id_usu: query.id_usu ? Number(query.id_usu) : undefined,
    fecha_desde: typeof query.fecha_desde === 'string' ? query.fecha_desde : undefined,
    fecha_hasta: typeof query.fecha_hasta === 'string' ? query.fecha_hasta : undefined,
})

export const ReporteService = {
    getEstadisticasSistema: async () => ReporteModel.getEstadisticas(),

    getEstadisticasRefugio: async (usuario: JwtPayload) => {
        return await ReporteModel.getEstadisticas(ensureRefugioScope(usuario))
    },

    getUsuarios: async (params: ListReporteParams) => ReporteModel.findUsuarios(params),

    getProcesosSistema: async (params: ListReporteParams) => ReporteModel.findProcesos(params),

    getProcesosRefugio: async (usuario: JwtPayload, params: ListReporteParams) => {
        return await ReporteModel.findProcesos(params, ensureRefugioScope(usuario))
    },

    getTransacciones: async (params: ListReporteParams) => ReporteModel.findTransacciones(params),

    getDonacionesSistema: async (params: ListReporteParams) => ReporteModel.findDonaciones(params),

    getDonacionesRefugio: async (usuario: JwtPayload, params: ListReporteParams) => {
        return await ReporteModel.findDonaciones(params, ensureRefugioScope(usuario))
    },

    parseListParams,
    resolveScope,
}
