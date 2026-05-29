import 'dotenv/config'
import app from './src/app'
import { RealtimeService } from './src/services/realtime.service'

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

RealtimeService.attach(server)
