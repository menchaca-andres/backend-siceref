import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../../config/database'
import { toDate } from '../../utils/date'
import { LoginDto, JwtPayload, RegisterDto, RegisterWorkerDto } from './auth.types'
import { uploadImageToCloudinary } from '../../config/cloudinary'

const getRoleIdByCode = async (codigo: string) => {
    const role = await prisma.roles.findUnique({ where: { codigo } })

    if (!role) throw new Error(`Rol no configurado: ${codigo}`)
    return role.id_rol
}

const usuarioSelect = {
    id_usu: true,
    img_usu: true,
    nom_usu: true,
    apell_usu: true,
    fecnac_usu: true,
    numcel_usu: true,
    email_usu: true,
    id_rol: true,
    id_ref: true,
    rol: true,
    refugio: true,
}

const resolveUsuarioImage = async (data: RegisterDto, file?: Express.Multer.File) => {
    return file ? await uploadImageToCloudinary(file, 'usuarios') : data.img_usu
}

export const AuthService = {
    login: async (data: LoginDto) => {
        const usuario = await prisma.usuarios.findUnique({
            where: { email_usu: data.email_usu },
            include: { rol: { include: { rolPerms: { include: { permiso: true } } } } },
        })
        if (!usuario) throw new Error('Correo o contraseña incorrectos')

        const passwordValido = await bcrypt.compare(data.pass_usu, usuario.pass_usu)
        if (!passwordValido) throw new Error('Correo o contraseña incorrectos')

        const payload: JwtPayload = {
            id_usu: usuario.id_usu,
            id_rol: usuario.id_rol,
            nom_rol: usuario.rol.nom_rol,
            id_ref: usuario.id_ref,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
            expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn'],
        })

        return {
            token,
            usuario: {
                id_usu: usuario.id_usu,
                nom_usu: usuario.nom_usu,
                apell_usu: usuario.apell_usu,
                img_usu: usuario.img_usu,
                email_usu: usuario.email_usu,
                nom_rol: usuario.rol.nom_rol,
                id_ref: usuario.id_ref,
                permisos: usuario.rol.rolPerms.map((rolPerm) => rolPerm.permiso.codigo),
            }
        }
    },

    register: async (data: RegisterDto, file?: Express.Multer.File) => {
        const existe = await prisma.usuarios.findUnique({ where: { email_usu: data.email_usu } })
        if (existe) throw new Error('El correo ya está registrado')

        const img_usu = await resolveUsuarioImage(data, file)
        const hashPassword = await bcrypt.hash(data.pass_usu, 10)
        const id_rol = await getRoleIdByCode('adoptante')

        return await prisma.usuarios.create({
            data: { ...data, img_usu, fecnac_usu: toDate(data.fecnac_usu)!, pass_usu: hashPassword, id_rol, id_ref: null },
            select: usuarioSelect,
        })
    },

    registerWorker: async (data: RegisterWorkerDto, adminRefugId: number | null, file?: Express.Multer.File) => {
        if (adminRefugId === null || Number(data.id_ref) !== adminRefugId) {
            throw new Error('No puedes registrar trabajadores en otro refugio')
        }

        const existe = await prisma.usuarios.findUnique({ where: { email_usu: data.email_usu } })
        if (existe) throw new Error('El correo ya está registrado')

        const img_usu = await resolveUsuarioImage(data, file)
        const hashPassword = await bcrypt.hash(data.pass_usu, 10)
        const id_rol = await getRoleIdByCode('trabajador-refugio')

        return await prisma.usuarios.create({
            data: { ...data, img_usu, fecnac_usu: toDate(data.fecnac_usu)!, pass_usu: hashPassword, id_rol, id_ref: Number(data.id_ref) },
            select: usuarioSelect,
        })
    },

    registerSuperadmin: async (data: RegisterDto, file?: Express.Multer.File) => {
        const existe = await prisma.usuarios.findUnique({ where: { email_usu: data.email_usu } })
        if (existe) throw new Error('El correo ya está registrado')

        const img_usu = await resolveUsuarioImage(data, file)
        const hashPassword = await bcrypt.hash(data.pass_usu, 10)
        const id_rol = await getRoleIdByCode('admin-sistema')

        return await prisma.usuarios.create({
            data: { ...data, img_usu, fecnac_usu: toDate(data.fecnac_usu)!, pass_usu: hashPassword, id_rol, id_ref: null },
            select: usuarioSelect,
        })
    },

    registerAdminRefugio: async (data: RegisterWorkerDto, file?: Express.Multer.File) => {
        const existe = await prisma.usuarios.findUnique({ where: { email_usu: data.email_usu } })
        if (existe) throw new Error('El correo ya está registrado')

        const img_usu = await resolveUsuarioImage(data, file)
        const hashPassword = await bcrypt.hash(data.pass_usu, 10)
        const id_rol = await getRoleIdByCode('admin-refugio')

        return await prisma.usuarios.create({
            data: { ...data, img_usu, fecnac_usu: toDate(data.fecnac_usu)!, pass_usu: hashPassword, id_rol, id_ref: Number(data.id_ref) },
            select: usuarioSelect,
        })
    },
}
