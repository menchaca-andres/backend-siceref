import express from 'express'
import roleRoutes from './modules/roles/role.routes'
import especieRoutes from './modules/especies/especie.routes'
import razaRoutes from './modules/razas/raza.routes'
import usuarioRoutes from './modules/usuarios/usuario.routes'
import mascotaRoutes from './modules/mascotas/mascota.routes'

const app = express()
app.use(express.json())

app.use('/api/roles', roleRoutes)
app.use('/api/especies', especieRoutes)
app.use('/api/razas', razaRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/mascotas', mascotaRoutes)

export default app