import { MascotaModel } from './mascota.model'
import { CreateMascotaDto, UpdateMascotaDto } from './mascota.types'
import { uploadImageToCloudinary } from '../../config/cloudinary'

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
    const img_mascot = file ? await uploadImageToCloudinary(file, 'mascotas') : data.img_mascot

    if (!isIntegerValue(data.id_tam)) throw new Error('El tamaño de la mascota es obligatorio')

    return await MascotaModel.create({ ...data, img_mascot })
  },

  update: async (id: number, data: UpdateMascotaDto, file?: Express.Multer.File) => {
    const img_mascot = file ? await uploadImageToCloudinary(file, 'mascotas') : data.img_mascot
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
