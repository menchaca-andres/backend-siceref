import { prisma } from '../../config/database'
import { CreatePermisoDto, UpdatePermisoDto } from './permiso.types'

export const PermisoModel = {
  findAll: async () => {
    return await prisma.permisos.findMany({ orderBy: { id_per: 'asc' } })
  },

  findById: async (id: number) => {
    return await prisma.permisos.findUnique({ where: { id_per: id } })
  },

  create: async (data: CreatePermisoDto) => {
    return await prisma.permisos.create({ data })
  },

  update: async (id: number, data: UpdatePermisoDto) => {
    return await prisma.permisos.update({ where: { id_per: id }, data }).catch(() => null)
  },

  delete: async (id: number) => {
    return await prisma.permisos.delete({ where: { id_per: id } }).catch(() => null)
  },
}
