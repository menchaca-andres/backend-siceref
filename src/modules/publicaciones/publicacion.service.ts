import { PublicacionModel } from './publicacion.model'
import { CreatePublicacionDto, UpdatePublicacionDto } from './publicacion.types'

const validarMascotaDelRefugio = async (id_ani: number, id_ref: number) => {
    const mascota = await PublicacionModel.findMascotaById(id_ani)
    if (!mascota) throw new Error('Mascota no encontrada')
    if (mascota.id_ref !== id_ref) throw new Error('La mascota no pertenece al refugio indicado')
}

const validarPublicacionDelRefugio = async (id: number, id_ref: number | null) => {
    const publicacion = await PublicacionModel.findById(id)
    if (!publicacion) throw new Error('Publicacion no encontrada')
    if (id_ref !== null && publicacion.id_ref !== id_ref) throw new Error('No puedes gestionar publicaciones de otro refugio')
    return publicacion
}

export const PublicacionService = {
    getAll: async (id_ref?: number | null, id_ani?: number) => await PublicacionModel.findAll(id_ref, id_ani),

    getMine: async (id_ref: number | null) => {
        if (id_ref === null) throw new Error('No perteneces a ningun refugio')
        return await PublicacionModel.findAll(id_ref)
    },

    getById: async (id: number, id_ref?: number | null) => {
        const publicacion = await PublicacionModel.findById(id)
        if (!publicacion) throw new Error('Publicacion no encontrada')
        if (id_ref !== null && id_ref !== undefined && publicacion.id_ref !== id_ref) throw new Error('Publicacion no encontrada')
        return publicacion
    },

    create: async (data: CreatePublicacionDto, id_ref: number | null) => {
        const id_ani = Number(data.id_ani)
        const refugioPublicacion = id_ref ?? Number(data.id_ref)

        if (!refugioPublicacion) throw new Error('El refugio es obligatorio')
        await validarMascotaDelRefugio(id_ani, refugioPublicacion)

        return await PublicacionModel.create({ ...data, id_ani, id_ref: refugioPublicacion })
    },

    update: async (id: number, data: UpdatePublicacionDto, id_ref: number | null) => {
        const publicacionActual = await validarPublicacionDelRefugio(id, id_ref)
        const refugioPublicacion = id_ref ?? (data.id_ref === undefined ? publicacionActual.id_ref : Number(data.id_ref))
        const id_ani = data.id_ani === undefined ? publicacionActual.id_ani : Number(data.id_ani)

        await validarMascotaDelRefugio(id_ani, refugioPublicacion)

        const publicacion = await PublicacionModel.update(id, { ...data, id_ani, id_ref: refugioPublicacion })
        if (!publicacion) throw new Error('Publicacion no encontrada')
        return publicacion
    },

    delete: async (id: number, id_ref: number | null) => {
        await validarPublicacionDelRefugio(id, id_ref)
        const publicacion = await PublicacionModel.delete(id)
        if (!publicacion) throw new Error('Publicacion no encontrada')
        return publicacion
    },
}
