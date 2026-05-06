import { RefugioModel } from './refugio.model'
import { CreateRefugioDto, UpdateRefugioDto } from './refugio.types'

export const RefugioService = {
    getAll: async () => await RefugioModel.findAll(),

    getById: async (id: number) => {
        const refugio = await RefugioModel.findById(id)
        if (!refugio) throw new Error('Refugio no encontrado')
        return refugio
    },

    create: async (data: CreateRefugioDto) => {
        const existe = await RefugioModel.findByEmail(data.email_ref)
        if (existe) throw new Error('El correo ya está registrado')
        return await RefugioModel.create(data)
    },

    update: async (id: number, data: UpdateRefugioDto) => {
        const refugio = await RefugioModel.update(id, data)
        if (!refugio) throw new Error('Refugio no encontrado')
        return refugio
    },

    delete: async (id: number) => {
        const refugio = await RefugioModel.delete(id)
        if (!refugio) throw new Error('Refugio no encontrado')
        return refugio
    },
}
