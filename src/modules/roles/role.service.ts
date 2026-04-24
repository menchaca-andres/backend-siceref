import { RoleModel } from './role.model'
import { CreateRoleDto, UpdateRoleDto } from './role.types'

export const RoleService = {
    getAll: async () => {
        return await RoleModel.findAll()
    },

    getById: async (id: number) => {
        const role = await RoleModel.findById(id)
        if (!role) throw new Error('Rol no encontrado')
        return role
    },

    create: async (data: CreateRoleDto) => {
        return await RoleModel.create(data)
    },

    update: async (id: number, data: UpdateRoleDto) => {
        const role = await RoleModel.update(id, data)
        if (!role) throw new Error('Rol no encontrado')
        return role
    },

    delete: async (id: number) => {
        const role = await RoleModel.delete(id)
        if (!role) throw new Error('Rol no encontrado')
        return role
    },
}