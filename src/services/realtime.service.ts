import { Server } from 'http'
import jwt from 'jsonwebtoken'
import { WebSocket, WebSocketServer } from 'ws'
import { JwtPayload } from '../modules/auth/auth.types'

type RealtimeClient = {
    socket: WebSocket
    usuario: JwtPayload
}

type RealtimeEvent =
    | { type: 'connected'; payload: unknown }
    | { type: 'mensaje_chat'; payload: unknown }
    | { type: 'notificacion'; payload: unknown }

const clients = new Map<number, Set<RealtimeClient>>()

const send = (client: RealtimeClient, event: RealtimeEvent) => {
    if (client.socket.readyState !== WebSocket.OPEN) return
    client.socket.send(JSON.stringify(event))
}

const addClient = (client: RealtimeClient) => {
    const userClients = clients.get(client.usuario.id_usu) ?? new Set<RealtimeClient>()
    userClients.add(client)
    clients.set(client.usuario.id_usu, userClients)

    client.socket.on('close', () => {
        userClients.delete(client)
        if (userClients.size === 0) clients.delete(client.usuario.id_usu)
    })
}

const authenticate = (token: string | null): JwtPayload | null => {
    if (!token) return null

    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload
    } catch {
        return null
    }
}

export const RealtimeService = {
    attach: (server: Server) => {
        const wss = new WebSocketServer({ noServer: true })

        server.on('upgrade', (request, socket, head) => {
            const url = new URL(request.url ?? '', `http://${request.headers.host}`)
            if (url.pathname !== '/ws') return

            const usuario = authenticate(url.searchParams.get('token'))
            if (!usuario) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
                socket.destroy()
                return
            }

            wss.handleUpgrade(request, socket, head, (ws) => {
                addClient({ socket: ws, usuario })
                ws.send(JSON.stringify({ type: 'connected', payload: { id_usu: usuario.id_usu } }))
            })
        })
    },

    sendToUser: (id_usu: number, event: RealtimeEvent) => {
        const userClients = clients.get(id_usu)
        if (!userClients) return

        userClients.forEach((client) => send(client, event))
    },

    sendToUsers: (ids: number[], event: RealtimeEvent) => {
        Array.from(new Set(ids)).forEach((id) => RealtimeService.sendToUser(id, event))
    },
}
