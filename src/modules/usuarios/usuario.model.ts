import { prisma } from '../../config/database'
import { toDate } from '../../utils/date'
import { CreateUsuarioDto, UpdateUsuarioDto } from './usuario.types'

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

export const UsuarioModel = {
  findAll: async () => {
    return await prisma.usuarios.findMany({
      select: usuarioSelect,
      orderBy: { id_usu: 'asc' },
    })
  },

  findById: async (id: number) => {
    return await prisma.usuarios.findUnique({
      where: { id_usu: id },
      select: usuarioSelect,
    })
  },

  findByEmail: async (email: string) => {
    return await prisma.usuarios.findUnique({ where: { email_usu: email } })
  },

  findWorkersByRefugio: async (id_ref: number) => {
    return await prisma.usuarios.findMany({
      where: {
        id_ref,
        rol: { codigo: 'trabajador-refugio' },
      },
      select: usuarioSelect,
      orderBy: { id_usu: 'asc' },
    })
  },

  create: async (data: CreateUsuarioDto) => {
    return await prisma.usuarios.create({
      data: {
        img_usu: data.img_usu,
        nom_usu: data.nom_usu,
        apell_usu: data.apell_usu,
        fecnac_usu: toDate(data.fecnac_usu)!,
        numcel_usu: data.numcel_usu,
        email_usu: data.email_usu,
        pass_usu: data.pass_usu,
        id_rol: Number(data.id_rol),
        id_ref: data.id_ref == null ? null : Number(data.id_ref),
      },
      select: usuarioSelect,
    })
  },

  update: async (id: number, data: UpdateUsuarioDto) => {
    return await prisma.usuarios.update({
      where: { id_usu: id },
      data: {
        img_usu: data.img_usu,
        nom_usu: data.nom_usu,
        apell_usu: data.apell_usu,
        fecnac_usu: toDate(data.fecnac_usu),
        numcel_usu: data.numcel_usu,
        email_usu: data.email_usu,
        pass_usu: data.pass_usu,
        id_rol: data.id_rol === undefined ? undefined : Number(data.id_rol),
        id_ref: data.id_ref === undefined || data.id_ref === null ? data.id_ref : Number(data.id_ref),
      },
      select: usuarioSelect,
    }).catch(() => null)
  },

  delete: async (id: number) => {
    return await prisma.usuarios.delete({ where: { id_usu: id } }).catch(() => null)
  },
}
