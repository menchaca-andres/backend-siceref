import { PermisoModel } from './permiso.model'
import { CreatePermisoDto, UpdatePermisoDto } from './permiso.types'

export const PermisoService = {
  getAll: async () => {
    return await PermisoModel.findAll()
  },

  getById: async (id: number) => {
    const permiso = await PermisoModel.findById(id)
    if (!permiso) throw new Error('Permiso no encontrado')
    return permiso
  },

  create: async (data: CreatePermisoDto) => {
    return await PermisoModel.create(data)
  },

  update: async (id: number, data: UpdatePermisoDto) => {
    const permiso = await PermisoModel.update(id, data)
    if (!permiso) throw new Error('Permiso no encontrado')
    return permiso
  },

  delete: async (id: number) => {
    const permiso = await PermisoModel.delete(id)
    if (!permiso) throw new Error('Permiso no encontrado')
    return permiso
  },
}
