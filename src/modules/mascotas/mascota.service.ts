import { MascotaModel } from './mascota.model'
import { CreateMascotaDto, UpdateMascotaDto } from './mascota.types'

export const MascotaService = {
    getAll: async () => await MascotaModel.findAll(),

    getById: async (id: number) => {
        const mascota = await MascotaModel.findById(id)
        if (!mascota) throw new Error('Mascota no encontrada')
        return mascota
    },

    create: async (data: CreateMascotaDto) => await MascotaModel.create(data),

    update: async (id: number, data: UpdateMascotaDto) => {
        const mascota = await MascotaModel.update(id, data)
        if (!mascota) throw new Error('Mascota no encontrada')
        return mascota
    },

    delete: async (id: number) => {
        const mascota = await MascotaModel.delete(id)
        if (!mascota) throw new Error('Mascota no encontrada')
        return mascota
    },
}