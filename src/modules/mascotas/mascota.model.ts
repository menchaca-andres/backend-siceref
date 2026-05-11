import { prisma } from '../../config/database'
import { toDate } from '../../utils/date'
import { CreateMascotaDto, UpdateMascotaDto } from './mascota.types'

export const MascotaModel = {
  findAll: async (id_ref?: number | null) => {
    return await prisma.mascotas.findMany({
      where: id_ref != null ? { id_ref } : undefined,
      include: { raza: { include: { especie: true } }, refugio: true },
      orderBy: { id_ani: 'asc' },
    })
  },

  findById: async (id: number) => {
    return await prisma.mascotas.findUnique({
      where: { id_ani: id },
      include: { raza: { include: { especie: true } }, refugio: true },
    })
  },

  create: async (data: CreateMascotaDto) => {
    return await prisma.mascotas.create({
      data: {
        nom_mascot: data.nom_mascot,
        img_mascot: data.img_mascot!,
        fechanac_mascot: toDate(data.fechanac_mascot)!,
        esteril_mascot: data.esteril_mascot === true || data.esteril_mascot === 'true',
        sexo_mascot: data.sexo_mascot,
        caract_mascot: data.caract_mascot,
        id_raza: Number(data.id_raza),
        id_ref: Number(data.id_ref),
      },
    })
  },

  update: async (id: number, data: UpdateMascotaDto) => {
    return await prisma.mascotas.update({
      where: { id_ani: id },
      data: {
        ...data,
        fechanac_mascot: toDate(data.fechanac_mascot),
        esteril_mascot: data.esteril_mascot === undefined
          ? undefined
          : data.esteril_mascot === true || data.esteril_mascot === 'true',
        id_raza: data.id_raza === undefined ? undefined : Number(data.id_raza),
        id_ref: data.id_ref === undefined ? undefined : Number(data.id_ref),
      },
    }).catch(() => null)
  },

  delete: async (id: number) => {
    return await prisma.mascotas.delete({ where: { id_ani: id } }).catch(() => null)
  },
}
