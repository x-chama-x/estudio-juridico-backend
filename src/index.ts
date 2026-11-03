import './config/env'
import app from './app'
import { connectDB } from './config/db'
import logger from './config/logger'

const port = Number(process.env.PORT || 4000)

async function main() {
  try {
    await connectDB()
    app.listen(port, () => {
      logger.info(`Servidor en http://localhost:${port}`)
    })
  } catch (error) {
    logger.error('No se pudo iniciar el servidor:', error)
    logger.on('finish', () => process.exit(1))
    logger.end()
  }
}

main()
