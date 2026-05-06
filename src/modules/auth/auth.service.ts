import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../../config/database'
import { env } from '../../config/env'
import { toDate } from '../../utils/date'
import { LoginDto, JwtPayload, RegisterDto, RegisterWorkerDto } from './auth.types'

const getRoleIdByCode = async (codigo: string) => {
    const role = await prisma.roles.findUnique({ where: { codigo } })

    if (!role) throw new Error(`Rol no configurado: ${codigo}`)
    return role.id_rol
}

const usuarioSelect = {
    id_usu: true,
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

export const AuthService = {
    login: async (data: LoginDto) => {
        const usuario = await prisma.usuarios.findUnique({
            where: { email_usu: data.email_usu },
            include: { rol: true },
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

        const token = jwt.sign(payload, env.jwt.secret, {
            expiresIn: env.jwt.expiresIn,
        })

        return {
            token,
            usuario: {
                id_usu: usuario.id_usu,
                nom_usu: usuario.nom_usu,
                apell_usu: usuario.apell_usu,
                email_usu: usuario.email_usu,
                nom_rol: usuario.rol.nom_rol,
                id_ref: usuario.id_ref,
            }
        }
    },

    register: async (data: RegisterDto) => {
        const existe = await prisma.usuarios.findUnique({ where: { email_usu: data.email_usu } })
        if (existe) throw new Error('El correo ya está registrado')

        const hashPassword = await bcrypt.hash(data.pass_usu, 10)
        const id_rol = await getRoleIdByCode('adoptante')

        return await prisma.usuarios.create({
            data: { ...data, fecnac_usu: toDate(data.fecnac_usu)!, pass_usu: hashPassword, id_rol, id_ref: null },
            select: usuarioSelect,
        })
    },

    registerWorker: async (data: RegisterWorkerDto, adminRefugId: number | null) => {
        if (adminRefugId === null || data.id_ref !== adminRefugId) {
            throw new Error('No puedes registrar trabajadores en otro refugio')
        }

        const existe = await prisma.usuarios.findUnique({ where: { email_usu: data.email_usu } })
        if (existe) throw new Error('El correo ya está registrado')

        const hashPassword = await bcrypt.hash(data.pass_usu, 10)
        const id_rol = await getRoleIdByCode('trabajador-refugio')

        return await prisma.usuarios.create({
            data: { ...data, fecnac_usu: toDate(data.fecnac_usu)!, pass_usu: hashPassword, id_rol },
            select: usuarioSelect,
        })
    },

    registerSuperadmin: async (data: RegisterDto) => {
        const existe = await prisma.usuarios.findUnique({ where: { email_usu: data.email_usu } })
        if (existe) throw new Error('El correo ya está registrado')

        const hashPassword = await bcrypt.hash(data.pass_usu, 10)
        const id_rol = await getRoleIdByCode('admin-sistema')

        return await prisma.usuarios.create({
            data: { ...data, fecnac_usu: toDate(data.fecnac_usu)!, pass_usu: hashPassword, id_rol, id_ref: null },
            select: usuarioSelect,
        })
    },

    registerAdminRefugio: async (data: RegisterWorkerDto) => {
        const existe = await prisma.usuarios.findUnique({ where: { email_usu: data.email_usu } })
        if (existe) throw new Error('El correo ya está registrado')

        const hashPassword = await bcrypt.hash(data.pass_usu, 10)
        const id_rol = await getRoleIdByCode('admin-refugio')

        return await prisma.usuarios.create({
            data: { ...data, fecnac_usu: toDate(data.fecnac_usu)!, pass_usu: hashPassword, id_rol },
            select: usuarioSelect,
        })
    },
}
