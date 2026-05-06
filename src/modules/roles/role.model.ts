import { prisma } from '../../config/database'
import { CreateRoleDto, UpdateRoleDto } from './role.types'

export const RoleModel = {
  findAll: async () => {
    return await prisma.roles.findMany({ orderBy: { id_rol: 'asc' } })
  },

  findById: async (id: number) => {
    return await prisma.roles.findUnique({ where: { id_rol: id } })
  },

  create: async (data: CreateRoleDto) => {
    return await prisma.roles.create({ data })
  },

  update: async (id: number, data: UpdateRoleDto) => {
    return await prisma.roles.update({ where: { id_rol: id }, data }).catch(() => null)
  },

  delete: async (id: number) => {
    return await prisma.roles.delete({ where: { id_rol: id } }).catch(() => null)
  },
}
