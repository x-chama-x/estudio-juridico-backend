import '../config/env'
import mongoose from 'mongoose'
import { connectDB } from '../config/db'
import { UsuarioModel } from '../models/Usuario'
import logger from '../config/logger'
import { ClienteModel } from '../models/Cliente'

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

    await ClienteModel.deleteMany({})

  await ClienteModel.create([
    {
      tipo: 'fisica',
      nombre: 'Juan',
      apellido: 'Rodríguez',
      dni: '30123456',
      email: 'juan.rodriguez@mail.com',
      telefono: '11 4567-8901',
      domicilio: 'Av. Corrientes 1234, CABA',
    },
    {
      tipo: 'fisica',
      nombre: 'María',
      apellido: 'Fernández',
      dni: '27987654',
      telefono: '11 2345-6789',
    },
    {
      tipo: 'juridica',
      razonSocial: 'Transportes Sur S.A.',
      cuit: '30712345678',
      email: 'legales@transportessur.com.ar',
      domicilio: 'Av. Belgrano 500, CABA',
    },
    {
      tipo: 'juridica',
      razonSocial: 'Panadería La Espiga S.R.L.',
      cuit: '30698765432',
      telefono: '11 4321-0000',
    },
  ])
  

  logger.info('Seed completado: 2 usuarios y 4 clientes creados')
}

seed()
  .catch((error) => logger.error('Falló el seed', error))
  .finally(() => mongoose.disconnect())