import { prisma } from '../../config/database'
import { activeOnly, softDeleteNow, withActiveOnly } from '../../utils/soft-delete'
import { CreatePermisoDto, UpdatePermisoDto } from './permiso.types'

export const PermisoModel = {
  findAll: async () => {
    return await prisma.permisos.findMany({
      where: activeOnly,
      orderBy: { id_per: 'asc' },
    })
  },

  findById: async (id: number) => {
    return await prisma.permisos.findFirst({ where: withActiveOnly({ id_per: id }) })
  },

  create: async (data: CreatePermisoDto) => {
    return await prisma.permisos.create({ data })
  },

  update: async (id: number, data: UpdatePermisoDto) => {
    const existing = await prisma.permisos.findFirst({ where: withActiveOnly({ id_per: id }) })
    if (!existing) return null

    return await prisma.permisos.update({ where: { id_per: id }, data }).catch(() => null)
  },

  delete: async (id: number) => {
    const existing = await prisma.permisos.findFirst({ where: withActiveOnly({ id_per: id }) })
    if (!existing) return null

    return await prisma.permisos.update({
      where: { id_per: id },
      data: { deleted_at: softDeleteNow() },
    }).catch(() => null)
  },
}
