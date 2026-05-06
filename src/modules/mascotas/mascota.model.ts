import { prisma } from '../../config/database'
import { toDate } from '../../utils/date'
import { CreateMascotaDto, UpdateMascotaDto } from './mascota.types'

export const MascotaModel = {
  findAll: async () => {
    return await prisma.mascotas.findMany({
      include: { raza: { include: { especie: true } } },
      orderBy: { id_ani: 'asc' },
    })
  },

  findById: async (id: number) => {
    return await prisma.mascotas.findUnique({
      where: { id_ani: id },
      include: { raza: { include: { especie: true } } },
    })
  },

  create: async (data: CreateMascotaDto) => {
    return await prisma.mascotas.create({ data: { ...data, fechanac_mascot: toDate(data.fechanac_mascot)! } })
  },

  update: async (id: number, data: UpdateMascotaDto) => {
    return await prisma.mascotas.update({
      where: { id_ani: id },
      data: { ...data, fechanac_mascot: toDate(data.fechanac_mascot) },
    }).catch(() => null)
  },

  delete: async (id: number) => {
    return await prisma.mascotas.delete({ where: { id_ani: id } }).catch(() => null)
  },
}
