import express from 'express'
import cors from 'cors'
import roleRoutes from './modules/roles/role.routes'
import especieRoutes from './modules/especies/especie.routes'
import razaRoutes from './modules/razas/raza.routes'
import usuarioRoutes from './modules/usuarios/usuario.routes'
import mascotaRoutes from './modules/mascotas/mascota.routes'
import refugioRoutes from './modules/refugios/refugio.routes'
import authRoutes from './modules/auth/auth.routes'

const app = express()

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.use('/api/roles', roleRoutes)
app.use('/api/especies', especieRoutes)
app.use('/api/razas', razaRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/mascotas', mascotaRoutes)
app.use('/api/refugios', refugioRoutes)
app.use('/api/auth', authRoutes)

export default app