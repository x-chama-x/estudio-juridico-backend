import '../config/env'
import mongoose from 'mongoose'
import { connectDB } from '../config/db'
import { UsuarioModel } from '../models/Usuario'
import logger from '../config/logger'

async function seed() {
  await connectDB()

  await UsuarioModel.deleteMany({})

  await UsuarioModel.create([
    {
      nombre: 'Laura',
      apellido: 'Gómez',
      email: 'abogada@estudio.com',
      password: 'Password123',
      rol: 'abogado',
      matricula: 'T° 120 F° 45',
    },
    {
      nombre: 'Martín',
      apellido: 'Pérez',
      email: 'asistente@estudio.com',
      password: 'Password123',
      rol: 'asistente',
    },
  ])

  logger.info('Seed completado: 2 usuarios creados')
}

seed()
  .catch((error) => logger.error('Falló el seed', error))
  .finally(() => mongoose.disconnect())