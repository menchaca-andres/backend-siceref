import { RefugioModel } from './refugio.model'
import { CreateRefugioDto, UpdateRefugioDto } from './refugio.types'
import { uploadImageToCloudinary } from '../../config/cloudinary'

export const RefugioService = {
    getAll: async () => await RefugioModel.findAll(),

    getById: async (id: number) => {
        const refugio = await RefugioModel.findById(id)
        if (!refugio) throw new Error('Refugio no encontrado')
        return refugio
    },

    create: async (data: CreateRefugioDto, file?: Express.Multer.File) => {
        const existe = await RefugioModel.findByEmail(data.email_ref)
        if (existe) throw new Error('El correo ya está registrado')

        const img_ref = file ? await uploadImageToCloudinary(file, 'refugios') : data.img_ref

        return await RefugioModel.create({ ...data, img_ref })
    },

    update: async (id: number, data: UpdateRefugioDto, file?: Express.Multer.File) => {
        const img_ref = file ? await uploadImageToCloudinary(file, 'refugios') : data.img_ref
        const refugio = await RefugioModel.update(id, { ...data, img_ref })
        if (!refugio) throw new Error('Refugio no encontrado')
        return refugio
    },

    delete: async (id: number) => {
        const refugio = await RefugioModel.delete(id)
        if (!refugio) throw new Error('Refugio no encontrado')
        return refugio
    },
}
