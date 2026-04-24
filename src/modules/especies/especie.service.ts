import { EspecieModel } from './especie.model'
import { CreateEspecieDto, UpdateEspecieDto } from './especie.types'

export const EspecieService = {
    getAll: async () => await EspecieModel.findAll(),

    getById: async (id: number) => {
        const especie = await EspecieModel.findById(id)
        if (!especie) throw new Error('Especie no encontrada')
        return especie
    },

    create: async (data: CreateEspecieDto) => await EspecieModel.create(data),

    update: async (id: number, data: UpdateEspecieDto) => {
        const especie = await EspecieModel.update(id, data)
        if (!especie) throw new Error('Especie no encontrada')
        return especie
    },

    delete: async (id: number) => {
        const especie = await EspecieModel.delete(id)
        if (!especie) throw new Error('Especie no encontrada')
        return especie
    },
}