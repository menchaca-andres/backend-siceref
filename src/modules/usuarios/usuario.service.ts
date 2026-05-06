import { UsuarioModel } from './usuario.model'
import { CreateUsuarioDto, UpdateUsuarioDto } from './usuario.types'
import bcrypt from 'bcrypt'

export const UsuarioService = {
    getAll: async () => await UsuarioModel.findAll(),

    getMyWorkers: async (id_ref: number | null) => {
        if (id_ref === null) throw new Error('No perteneces a ningun refugio')
        return await UsuarioModel.findWorkersByRefugio(id_ref)
    },

    getById: async (id: number) => {
        const usuario = await UsuarioModel.findById(id)
        if (!usuario) throw new Error('Usuario no encontrado')
        return usuario
    },

    create: async (data: CreateUsuarioDto) => {
        const existe = await UsuarioModel.findByEmail(data.email_usu)
        if (existe) throw new Error('El correo ya está registrado')

        const hashPassword = await bcrypt.hash(data.pass_usu, 10)

        return await UsuarioModel.create({ ...data, pass_usu: hashPassword })
    },

    update: async (id: number, data: UpdateUsuarioDto) => {
        const usuario = await UsuarioModel.update(id, data)
        if (!usuario) throw new Error('Usuario no encontrado')
        return usuario
    },

    delete: async (id: number) => {
        const usuario = await UsuarioModel.delete(id)
        if (!usuario) throw new Error('Usuario no encontrado')
        return usuario
    },
}
