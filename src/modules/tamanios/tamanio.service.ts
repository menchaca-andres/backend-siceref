import { TamanioModel } from './tamanio.model'
import { CreateTamanioDto, UpdateTamanioDto } from './tamanio.types'

const validateId = (id: number) => {
    if (!Number.isInteger(id) || id <= 0) throw new Error('Id de tamaño inválido')
}

const validateNombre = (value: unknown, required: boolean) => {
    if (value === undefined && !required) return undefined
    if (typeof value !== 'string') throw new Error('El nombre del tamaño debe ser texto')

    const nom_tam = value.trim()
    if (!nom_tam) throw new Error('El nombre del tamaño es obligatorio')
    if (nom_tam.length > 50) throw new Error('El nombre del tamaño no puede superar 50 caracteres')

    return nom_tam
}

const validateEstado = (value: unknown) => {
    if (value === undefined) return undefined
    if (typeof value !== 'boolean') throw new Error('El estado del tamaño debe ser booleano')
    return value
}

const sanitizeCreate = (data: CreateTamanioDto) => ({
    nom_tam: validateNombre(data.nom_tam, true)!,
    estado_tam: validateEstado(data.estado_tam),
})

const sanitizeUpdate = (data: UpdateTamanioDto) => ({
    nom_tam: validateNombre(data.nom_tam, false),
    estado_tam: validateEstado(data.estado_tam),
})

export const TamanioService = {
    getAll: async (includeInactive = false) => await TamanioModel.findAll(includeInactive),

    getById: async (id: number) => {
        validateId(id)
        const tamanio = await TamanioModel.findById(id)
        if (!tamanio) throw new Error('Tamaño no encontrado')
        return tamanio
    },

    create: async (data: CreateTamanioDto) => await TamanioModel.create(sanitizeCreate(data)),

    update: async (id: number, data: UpdateTamanioDto) => {
        validateId(id)
        const tamanio = await TamanioModel.update(id, sanitizeUpdate(data))
        if (!tamanio) throw new Error('Tamaño no encontrado')
        return tamanio
    },

    delete: async (id: number) => {
        validateId(id)
        const tamanio = await TamanioModel.deactivate(id)
        if (!tamanio) throw new Error('Tamaño no encontrado')
        return tamanio
    },

    activate: async (id: number) => {
        validateId(id)
        const tamanio = await TamanioModel.activate(id)
        if (!tamanio) throw new Error('Tamaño no encontrado')
        return tamanio
    },
}
