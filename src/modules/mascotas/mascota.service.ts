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

const isIntegerValue = (value: number | string | undefined) => {
  if (value === undefined || value === '') return false
  return Number.isInteger(Number(value))
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
    if (!isIntegerValue(data.id_tam)) throw new Error('El tamaño de la mascota es obligatorio')

    return await MascotaModel.create({ ...data, img_mascot })
  },

  update: async (id: number, data: UpdateMascotaDto, file?: Express.Multer.File) => {
    const img_mascot = file ? await uploadMascotaImage(file) : data.img_mascot
    if (data.id_tam !== undefined && !isIntegerValue(data.id_tam)) throw new Error('El tamaño de la mascota debe ser un entero')

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
