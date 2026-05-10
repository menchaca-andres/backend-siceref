import { MascotaModel } from './mascota.model'
import { CreateMascotaDto, UpdateMascotaDto } from './mascota.types'
import { cloudinary } from '../../config/cloudinary'

const uploadMascotaImage = async (file: Express.Multer.File) => {
    return await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'mascotas', resource_type: 'image' },
            (error, result) => {
                if (error || !result) {
                    reject(error ?? new Error('No se pudo subir la imagen'))
                    return
                }

                resolve(result.secure_url)
            },
        )

        stream.end(file.buffer)
    })
}

export const MascotaService = {
    getAll: async () => await MascotaModel.findAll(),

    getById: async (id: number) => {
        const mascota = await MascotaModel.findById(id)
        if (!mascota) throw new Error('Mascota no encontrada')
        return mascota
    },

    create: async (data: CreateMascotaDto, file?: Express.Multer.File) => {
        const img_mascot = file ? await uploadMascotaImage(file) : data.img_mascot

        if (!img_mascot) throw new Error('La imagen de la mascota es obligatoria')

        return await MascotaModel.create({ ...data, img_mascot })
    },

    update: async (id: number, data: UpdateMascotaDto, file?: Express.Multer.File) => {
        const img_mascot = file ? await uploadMascotaImage(file) : data.img_mascot
        const mascota = await MascotaModel.update(id, { ...data, img_mascot })
        if (!mascota) throw new Error('Mascota no encontrada')
        return mascota
    },

    delete: async (id: number) => {
        const mascota = await MascotaModel.delete(id)
        if (!mascota) throw new Error('Mascota no encontrada')
        return mascota
    },
}
