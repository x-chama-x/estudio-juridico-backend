import '../config/env'
import mongoose from 'mongoose'
import { connectDB } from '../config/db'
import { UsuarioModel } from '../models/Usuario'
import logger from '../config/logger'
import { ClienteModel } from '../models/Cliente'
import { ExpedienteModel } from '../models/Expediente'

async function seed() {
  await connectDB()

  await ExpedienteModel.deleteMany({})
  await ClienteModel.deleteMany({})
  await UsuarioModel.deleteMany({})

  const [laura, carlos] = await UsuarioModel.create([
    {
      nombre: 'Laura',
      apellido: 'Gómez',
      email: 'abogada@estudio.com',
      password: 'Password123',
      rol: 'abogado',
      matricula: 'T° 120 F° 45',
    },
    {
      nombre: 'Carlos',
      apellido: 'Méndez',
      email: 'abogado2@estudio.com',
      password: 'Password123',
      rol: 'abogado',
      matricula: 'T° 98 F° 210',
    },
  ])

  await UsuarioModel.create({
    nombre: 'Martín',
    apellido: 'Pérez',
    email: 'asistente@estudio.com',
    password: 'Password123',
    rol: 'asistente',
  })

  const [juan, maria, transportes, panaderia] = await ClienteModel.create([
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

  await ExpedienteModel.create([
    {
      caratula: 'Rodríguez, Juan c/ Logística Norte S.A. s/ despido',
      cliente: juan._id,
      abogadoResponsable: laura._id,
      fuero: 'laboral',
      etapa: 'judicial',
      estado: 'en_tramite',
      fechaInicio: new Date('2025-03-10'),
      datosJudiciales: {
        jurisdiccion: 'nacion',
        numero: '12345',
        anio: 2025,
        juzgado: 'Juzgado Nacional de 1ª Instancia del Trabajo N° 45',
      },
    },
    {
      caratula: 'Fernández, María s/ sucesión ab intestato',
      cliente: maria._id,
      abogadoResponsable: laura._id,
      fuero: 'civil',
      etapa: 'judicial',
      estado: 'en_espera',
      fechaInicio: new Date('2024-08-22'),
      datosJudiciales: {
        jurisdiccion: 'nacion',
        numero: '45678',
        anio: 2024,
        juzgado: 'Juzgado Nacional en lo Civil N° 12',
        secretaria: 'Secretaría N° 2',
      },
    },
    {
      caratula: 'Transportes Sur S.A. c/ Gómez, Pedro s/ cobro de pesos',
      cliente: transportes._id,
      abogadoResponsable: laura._id,
      fuero: 'comercial',
      etapa: 'mediacion',
      estado: 'en_tramite',
      fechaInicio: new Date('2026-09-05'),
    },
    {
      caratula: 'Fernández, María c/ Banco Austral S.A. s/ reclamo por débitos indebidos',
      cliente: maria._id,
      abogadoResponsable: laura._id,
      fuero: 'comercial',
      etapa: 'extrajudicial',
      estado: 'en_espera',
      fechaInicio: new Date('2026-10-14'),
    },
    {
      caratula: 'Panadería La Espiga S.R.L. s/ habilitación comercial',
      cliente: panaderia._id,
      abogadoResponsable: carlos._id,
      fuero: 'contencioso_administrativo',
      etapa: 'extrajudicial',
      estado: 'en_tramite',
      fechaInicio: new Date('2026-11-02'),
    },
    {
      caratula: 'Rodríguez, Juan c/ Aseguradora del Plata S.A. s/ daños y perjuicios',
      cliente: juan._id,
      abogadoResponsable: carlos._id,
      fuero: 'civil',
      etapa: 'judicial',
      estado: 'archivado',
      fechaInicio: new Date('2023-05-18'),
      datosJudiciales: {
        jurisdiccion: 'pba',
        numero: '3021',
        anio: 2023,
        juzgado: 'Juzgado Civil y Comercial N° 4 de San Isidro',
      },
    },
  ])

  logger.info('Seed completado: 3 usuarios, 4 clientes y 6 expedientes creados')
}

seed()
  .catch((error) => logger.error('Falló el seed', error))
  .finally(() => mongoose.disconnect())