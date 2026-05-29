import { JwtPayload } from '../auth/auth.types'
import { CreateMensajeDto } from './conversacion.types'
import { ConversacionModel } from './conversacion.model'
import { RealtimeService } from '../../services/realtime.service'

const validarPublicacionDisponible = async (id_publi: number) => {
    const publicacion = await ConversacionModel.findPublicacionById(id_publi)
    if (!publicacion) throw new Error('Publicacion no encontrada')
    if (!publicacion.estad_publ) throw new Error('La publicacion no esta disponible')
    return publicacion
}

const validarAccesoConversacion = async (id_conv: number, usuario: JwtPayload) => {
    const conversacion = await ConversacionModel.findById(id_conv)
    if (!conversacion) throw new Error('Conversacion no encontrada')

    const esAdoptante = conversacion.id_usu === usuario.id_usu
    const esResponsable = conversacion.id_responsable === usuario.id_usu
    const puedeTomarConversacion = conversacion.id_responsable === null && usuario.id_ref !== null && conversacion.publicacion.id_ref === usuario.id_ref

    if (!esAdoptante && !esResponsable && !puedeTomarConversacion) throw new Error('No puedes acceder a esta conversacion')
    return conversacion
}

const asignarResponsableSiCorresponde = async (conversacion: Awaited<ReturnType<typeof ConversacionModel.findById>>, usuario: JwtPayload) => {
    if (!conversacion) throw new Error('Conversacion no encontrada')
    const esPersonalDelRefugio = usuario.id_ref !== null && conversacion.publicacion.id_ref === usuario.id_ref

    if (esPersonalDelRefugio && conversacion.id_responsable === null) {
        const conversacionAsignada = await ConversacionModel.assignResponsable(conversacion.id_conv, usuario.id_usu)
        if (!conversacionAsignada || conversacionAsignada.id_responsable !== usuario.id_usu) {
            throw new Error('Esta conversacion ya fue tomada por otra persona del refugio')
        }

        return conversacionAsignada
    }

    return conversacion
}

const notificarRefugio = async (id_ref: number, id_remitente: number, id_publi: number, nombreMascota: string, id_responsable: number | null) => {
    if (id_responsable !== null) {
        return await ConversacionModel.createNotificaciones([{
            id_destinatario: id_responsable,
            id_publi,
            tipo: 'MENSAJE_CHAT',
            titulo: 'Nuevo mensaje de adopcion',
            mensaje: `Nuevo mensaje sobre ${nombreMascota}`,
        }])
    }

    const destinatarios = await ConversacionModel.findUsuariosDelRefugio(id_ref, id_remitente)
    return await ConversacionModel.createNotificaciones(destinatarios.map((destinatario) => ({
        id_destinatario: destinatario.id_usu,
        id_publi,
        tipo: 'MENSAJE_CHAT',
        titulo: 'Nuevo mensaje de adopcion',
        mensaje: `Nuevo mensaje sobre ${nombreMascota}`,
    })))
}

const emitirNotificaciones = (notificaciones: Awaited<ReturnType<typeof ConversacionModel.createNotificaciones>>) => {
    notificaciones.forEach((notificacion) => {
        RealtimeService.sendToUser(notificacion.id_destinatario, { type: 'notificacion', payload: notificacion })
    })
}

const emitirMensaje = async (mensaje: unknown, id_remitente: number, conversacion: Awaited<ReturnType<typeof ConversacionModel.findById>>) => {
    if (!conversacion) return

    const destinatarios = new Set<number>([id_remitente, conversacion.id_usu])
    if (conversacion.id_responsable !== null) destinatarios.add(conversacion.id_responsable)

    if (conversacion.id_responsable === null) {
        const usuariosRefugio = await ConversacionModel.findUsuariosDelRefugio(conversacion.publicacion.id_ref, id_remitente)
        usuariosRefugio.forEach((usuario) => destinatarios.add(usuario.id_usu))
    }

    RealtimeService.sendToUsers([...destinatarios], { type: 'mensaje_chat', payload: mensaje })
}

export const ConversacionService = {
    getMine: async (usuario: JwtPayload) => await ConversacionModel.findByUsuario(usuario.id_usu, usuario.id_ref),

    getById: async (id_conv: number, usuario: JwtPayload) => await validarAccesoConversacion(id_conv, usuario),

    getByPublicacion: async (id_publi: number, usuario: JwtPayload) => {
        const publicacion = await validarPublicacionDisponible(id_publi)
        if (usuario.id_ref !== null && usuario.id_ref === publicacion.id_ref) {
            throw new Error('El refugio debe acceder desde una conversacion existente')
        }

        return await ConversacionModel.findOrCreateByUsuarioAndPublicacion(usuario.id_usu, id_publi)
    },

    createMensajeByPublicacion: async (id_publi: number, data: CreateMensajeDto, usuario: JwtPayload) => {
        if (!data.contenido?.trim()) throw new Error('El mensaje es obligatorio')

        const publicacion = await validarPublicacionDisponible(id_publi)
        if (usuario.id_ref !== null && usuario.id_ref === publicacion.id_ref) {
            throw new Error('El refugio debe responder desde una conversacion existente')
        }

        const conversacion = await ConversacionModel.findOrCreateByUsuarioAndPublicacion(usuario.id_usu, id_publi)
        const mensaje = await ConversacionModel.createMensaje(conversacion.id_conv, usuario.id_usu, data.contenido.trim())

        const notificaciones = await notificarRefugio(publicacion.id_ref, usuario.id_usu, id_publi, publicacion.mascota.nom_mascot, conversacion.id_responsable)
        await emitirMensaje(mensaje, usuario.id_usu, conversacion)
        emitirNotificaciones(notificaciones)

        return mensaje
    },

    createMensajeByConversacion: async (id_conv: number, data: CreateMensajeDto, usuario: JwtPayload) => {
        if (!data.contenido?.trim()) throw new Error('El mensaje es obligatorio')

        const conversacion = await asignarResponsableSiCorresponde(await validarAccesoConversacion(id_conv, usuario), usuario)
        const mensaje = await ConversacionModel.createMensaje(conversacion.id_conv, usuario.id_usu, data.contenido.trim())

        if (usuario.id_usu === conversacion.id_usu) {
            const notificaciones = await notificarRefugio(
                conversacion.publicacion.id_ref,
                usuario.id_usu,
                conversacion.id_publi,
                conversacion.publicacion.mascota.nom_mascot,
                conversacion.id_responsable,
            )
            emitirNotificaciones(notificaciones)
        } else {
            const notificaciones = await ConversacionModel.createNotificaciones([{
                id_destinatario: conversacion.id_usu,
                id_publi: conversacion.id_publi,
                tipo: 'MENSAJE_CHAT',
                titulo: 'Nuevo mensaje de adopcion',
                mensaje: `Nuevo mensaje sobre ${conversacion.publicacion.mascota.nom_mascot}`,
            }])
            emitirNotificaciones(notificaciones)
        }

        await emitirMensaje(mensaje, usuario.id_usu, conversacion)

        return mensaje
    },
}
