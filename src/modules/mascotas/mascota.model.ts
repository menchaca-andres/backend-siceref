import { prisma } from '../../config/database'
import { toDate } from '../../utils/date'
import { activeOnly, softDeleteNow, withActiveOnly } from '../../utils/soft-delete'
import { CreateMascotaDto, UpdateMascotaDto } from './mascota.types'

const includeMascota = {
  raza: { include: { especie: true } },
  tamano: true,
  refugio: true,
}

const activeMascotaWhere = {
  ...activeOnly,
  refugio: activeOnly,
  raza: activeOnly,
}

export const MascotaModel = {
  findAll: async (id_ref?: number | null) => {
    return await prisma.mascotas.findMany({
      where: {
        ...activeMascotaWhere,
        ...(id_ref != null ? { id_ref } : {}),
      },
      include: includeMascota,
      orderBy: { id_ani: 'asc' },
    })
  },

  findById: async (id: number) => {
    return await prisma.mascotas.findFirst({
      where: withActiveOnly({ id_ani: id }),
      include: includeMascota,
    })
  },

  create: async (data: CreateMascotaDto) => {
    return await prisma.mascotas.create({
      data: {
        nom_mascot: data.nom_mascot,
        img_mascot: data.img_mascot,
        fechanac_mascot: toDate(data.fechanac_mascot)!,
        esteril_mascot: data.esteril_mascot === true || data.esteril_mascot === 'true',
        sexo_mascot: data.sexo_mascot,
        caract_mascot: data.caract_mascot,
        hist_mascot: data.hist_mascot,
        id_raza: Number(data.id_raza),
        id_tam: Number(data.id_tam),
        id_ref: Number(data.id_ref),
      },
    })
  },

  update: async (id: number, data: UpdateMascotaDto) => {
    const existing = await prisma.mascotas.findFirst({ where: withActiveOnly({ id_ani: id }) })
    if (!existing) return null

    return await prisma.mascotas.update({
      where: { id_ani: id },
      data: {
        ...data,
        fechanac_mascot: toDate(data.fechanac_mascot),
        esteril_mascot: data.esteril_mascot === undefined
          ? undefined
          : data.esteril_mascot === true || data.esteril_mascot === 'true',
        id_raza: data.id_raza === undefined ? undefined : Number(data.id_raza),
        id_tam: data.id_tam === undefined ? undefined : Number(data.id_tam),
        id_ref: data.id_ref === undefined ? undefined : Number(data.id_ref),
      },
    }).catch(() => null)
  },

  delete: async (id: number) => {
    const existing = await prisma.mascotas.findFirst({ where: withActiveOnly({ id_ani: id }) })
    if (!existing) return null

    const deletedAt = softDeleteNow()

    await prisma.$transaction([
      prisma.publicaciones.updateMany({
        where: withActiveOnly({ id_ani: id }),
        data: { deleted_at: deletedAt, estad_publ: false },
      }),
      prisma.mascotas.update({
        where: { id_ani: id },
        data: { deleted_at: deletedAt },
      }),
    ])

    return await prisma.mascotas.findUnique({ where: { id_ani: id } })
  },
}
