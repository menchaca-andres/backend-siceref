import { MascotaModel } from './mascota.model'
import { CreateMascotaDto, UpdateMascotaDto } from './mascota.types'
import { cloudinary } from '../../config/cloudinary'

const uploadMascotaImage = async (file: Express.Multer.File) => {
  const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
  const result = await cloudinary.uploader.upload(base64, {
    folder: 'mascotas',
    resource_type: 'image',
  })
  return result.secure_url
}

export const MascotaService = {
  getAll: async (id_ref?: number | null) => await MascotaModel.findAll(id_ref),

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
