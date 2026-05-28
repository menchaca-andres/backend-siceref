import { UsuarioModel } from './usuario.model'
import { CreateUsuarioDto, UpdateUsuarioDto } from './usuario.types'
import bcrypt from 'bcrypt'
import { uploadImageToCloudinary } from '../../config/cloudinary'

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

    create: async (data: CreateUsuarioDto, file?: Express.Multer.File) => {
        const existe = await UsuarioModel.findByEmail(data.email_usu)
        if (existe) throw new Error('El correo ya está registrado')

        const img_usu = file ? await uploadImageToCloudinary(file, 'usuarios') : data.img_usu

        const hashPassword = await bcrypt.hash(data.pass_usu, 10)

        return await UsuarioModel.create({ ...data, img_usu, pass_usu: hashPassword })
    },

    update: async (id: number, data: UpdateUsuarioDto, file?: Express.Multer.File) => {
        const img_usu = file ? await uploadImageToCloudinary(file, 'usuarios') : data.img_usu
        const dataToUpdate = data.pass_usu
            ? { ...data, img_usu, pass_usu: await bcrypt.hash(data.pass_usu, 10) }
            : { ...data, img_usu }

        const usuario = await UsuarioModel.update(id, dataToUpdate)
        if (!usuario) throw new Error('Usuario no encontrado')
        return usuario
    },

    delete: async (id: number) => {
        const usuario = await UsuarioModel.delete(id)
        if (!usuario) throw new Error('Usuario no encontrado')
        return usuario
    },
}
