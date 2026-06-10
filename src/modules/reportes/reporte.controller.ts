import { Request, Response } from 'express'
import { ReporteService } from './reporte.service'

export const ReporteController = {
    getEstadisticasSistema: async (_req: Request, res: Response) => {
        try {
            res.json(await ReporteService.getEstadisticasSistema())
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getEstadisticasRefugio: async (req: Request, res: Response) => {
        try {
            res.json(await ReporteService.getEstadisticasRefugio(req.usuario!))
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    getUsuarios: async (req: Request, res: Response) => {
        try {
            res.json(await ReporteService.getUsuarios(ReporteService.parseListParams(req.query)))
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getProcesosSistema: async (req: Request, res: Response) => {
        try {
            res.json(await ReporteService.getProcesosSistema(ReporteService.parseListParams(req.query)))
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getProcesosRefugio: async (req: Request, res: Response) => {
        try {
            res.json(await ReporteService.getProcesosRefugio(req.usuario!, ReporteService.parseListParams(req.query)))
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },

    getTransacciones: async (req: Request, res: Response) => {
        try {
            res.json(await ReporteService.getTransacciones(ReporteService.parseListParams(req.query)))
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getDonacionesSistema: async (req: Request, res: Response) => {
        try {
            res.json(await ReporteService.getDonacionesSistema(ReporteService.parseListParams(req.query)))
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    getDonacionesRefugio: async (req: Request, res: Response) => {
        try {
            res.json(await ReporteService.getDonacionesRefugio(req.usuario!, ReporteService.parseListParams(req.query)))
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    },
}
