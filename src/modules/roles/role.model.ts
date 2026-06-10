import { prisma } from '../../config/database'
import { activeOnly, softDeleteNow, withActiveOnly } from '../../utils/soft-delete'
import { CreateRoleDto, UpdateRoleDto } from './role.types'

export const RoleModel = {
  findAll: async () => {
    return await prisma.roles.findMany({
      where: activeOnly,
      orderBy: { id_rol: 'asc' },
    })
  },

  findById: async (id: number) => {
    return await prisma.roles.findFirst({ where: withActiveOnly({ id_rol: id }) })
  },

  create: async (data: CreateRoleDto) => {
    return await prisma.roles.create({ data })
  },

  update: async (id: number, data: UpdateRoleDto) => {
    const existing = await prisma.roles.findFirst({ where: withActiveOnly({ id_rol: id }) })
    if (!existing) return null

    return await prisma.roles.update({ where: { id_rol: id }, data }).catch(() => null)
  },

  delete: async (id: number) => {
    const existing = await prisma.roles.findFirst({ where: withActiveOnly({ id_rol: id }) })
    if (!existing) return null

    return await prisma.roles.update({
      where: { id_rol: id },
      data: { deleted_at: softDeleteNow() },
    }).catch(() => null)
  },
}
