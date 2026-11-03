import './config/env'
import app from './app'
import { connectDB } from './config/db'

const port = Number(process.env.PORT || 4000)

async function main() {
  try {
    await connectDB()
    app.listen(port, () => {
      console.log(`Servidor en http://localhost:${port}`)
    })
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error)
    process.exit(1)
  }
}

main()
