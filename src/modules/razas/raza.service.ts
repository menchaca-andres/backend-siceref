import { RazaModel } from './raza.model'
import { CreateRazaDto, UpdateRazaDto } from './raza.types'

export const RazaService = {
    getAll: async () => {
        return await RazaModel.findAll()
    },

    getById: async (id: number) => {
        const raza = await RazaModel.findById(id)
        if (!raza) throw new Error('Raza no encontrada')
        return raza
    },

    create: async (data: CreateRazaDto) => {
        return await RazaModel.create(data)
    },

    update: async (id: number, data: UpdateRazaDto) => {
        const raza = await RazaModel.update(id, data)
        if (!raza) throw new Error('Raza no encontrada')
        return raza
    },

    delete: async (id: number) => {
        const raza = await RazaModel.delete(id)
        if (!raza) throw new Error('Raza no encontrada')
        return raza
    },
}