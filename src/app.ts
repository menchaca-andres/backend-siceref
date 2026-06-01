import express from 'express'
import cors from 'cors'
import roleRoutes from './modules/roles/role.routes'
import especieRoutes from './modules/especies/especie.routes'
import razaRoutes from './modules/razas/raza.routes'
import usuarioRoutes from './modules/usuarios/usuario.routes'
import mascotaRoutes from './modules/mascotas/mascota.routes'
import refugioRoutes from './modules/refugios/refugio.routes'
import authRoutes from './modules/auth/auth.routes'
import permisoRoutes from './modules/permisos/permiso.routes'
import publicacionRoutes from './modules/publicaciones/publicacion.routes'
import tamanioRoutes from './modules/tamanios/tamanio.routes'
import notificacionRoutes from './modules/notificaciones/notificacion.routes'
import conversacionRoutes from './modules/conversaciones/conversacion.routes'

const app = express()
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.use('/api/permisos', permisoRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/especies', especieRoutes)
app.use('/api/razas', razaRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/mascotas', mascotaRoutes)
app.use('/api/tamanios', tamanioRoutes)
app.use('/api/refugios', refugioRoutes)
app.use('/api/publicaciones', publicacionRoutes)
app.use('/api/notificaciones', notificacionRoutes)
app.use('/api/conversaciones', conversacionRoutes)
app.use('/api/auth', authRoutes)

export default app
