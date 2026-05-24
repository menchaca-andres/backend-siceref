import { UpdateNotificacionDto } from './notificacion.types'
import { NotificacionModel } from './notificacion.model'

export const NotificacionService = {
    getMine: async (id_destinatario: number) => await NotificacionModel.findByUsuario(id_destinatario),

    update: async (id_noti: number, data: UpdateNotificacionDto, id_destinatario: number) => {
        const notificacion = await NotificacionModel.findById(id_noti)
        if (!notificacion) throw new Error('Notificacion no encontrada')
        if (notificacion.id_destinatario !== id_destinatario) throw new Error('No puedes modificar esta notificacion')

        return await NotificacionModel.update(id_noti, data)
    },

    markAsRead: async (id_noti: number, id_destinatario: number) => {
        return await NotificacionService.update(id_noti, { leida: true }, id_destinatario)
    },
}
