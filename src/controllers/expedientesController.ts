import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { ExpedienteModel, ESTADOS, ETAPAS, FUEROS } from '../models/Expediente'
import { ClienteModel } from '../models/Cliente'
import { UsuarioModel } from '../models/Usuario'
import { AppError } from '../utils/AppError'
import { leerPaginacion } from '../utils/paginacion'
import { escaparRegex } from '../utils/escaparRegex'

const POPULATE = [
  { path: 'cliente', select: 'tipo nombre apellido razonSocial dni cuit' },
  { path: 'abogadoResponsable', select: 'nombre apellido' },
]

const CAMPOS_EDITABLES = ['caratula', 'cliente', 'fuero', 'etapa', 'fechaInicio', 'datosJudiciales']

function camposPermitidos(body: Record<string, unknown>) {
  const datos: Record<string, unknown> = {}
  for (const campo of CAMPOS_EDITABLES) {
    if (body[campo] !== undefined) {
      datos[campo] = body[campo]
    }
  }
  return datos
}

function esValor<T extends string>(lista: readonly T[], valor: unknown): valor is T {
  return typeof valor === 'string' && (lista as readonly string[]).includes(valor)
}

async function verificarClienteActivo(clienteId: unknown) {
  if (clienteId === undefined || clienteId === '') {
    throw new AppError(400, 'El cliente es obligatorio')
  }
  if (!isValidObjectId(clienteId)) {
    throw new AppError(400, 'Cliente inválido')
  }
  const cliente = await ClienteModel.findById(clienteId)
  if (!cliente || !cliente.activo) {
    throw new AppError(400, 'El cliente no existe o está dado de baja')
  }
}

async function buscarExpedientePropio(req: Request) {
  const expediente = await ExpedienteModel.findById(req.params.id)
  if (!expediente) {
    throw new AppError(404, 'Expediente no encontrado')
  }
  if (expediente.abogadoResponsable.toString() !== req.user!.userId) {
    throw new AppError(403, 'Solo el abogado responsable puede modificar este expediente')
  }
  return expediente
}

export async function listarExpedientes(req: Request, res: Response) {
  const { page, limit, skip } = leerPaginacion(req.query)
  const filtro: Record<string, unknown> = {}

  if (req.user!.rol === 'abogado') {
    filtro.abogadoResponsable = req.user!.userId
  }

  if (esValor(ESTADOS, req.query.estado)) filtro.estado = req.query.estado
  if (esValor(FUEROS, req.query.fuero)) filtro.fuero = req.query.fuero
  if (esValor(ETAPAS, req.query.etapa)) filtro.etapa = req.query.etapa

  if (typeof req.query.cliente === 'string' && req.query.cliente !== '') {
    if (!isValidObjectId(req.query.cliente)) {
      throw new AppError(400, 'Cliente inválido')
    }
    filtro.cliente = req.query.cliente
  }

  if (typeof req.query.q === 'string' && req.query.q.trim() !== '') {
    filtro.caratula = new RegExp(escaparRegex(req.query.q.trim()), 'i')
  }

  const [data, total] = await Promise.all([
    ExpedienteModel.find(filtro).populate(POPULATE).sort({ fechaInicio: -1, _id: -1 }).skip(skip).limit(limit),
    ExpedienteModel.countDocuments(filtro),
  ])

  res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) })
}

export async function obtenerExpediente(req: Request, res: Response) {
  const expediente = await ExpedienteModel.findById(req.params.id)
  if (!expediente) {
    throw new AppError(404, 'Expediente no encontrado')
  }
  if (req.user!.rol === 'abogado' && expediente.abogadoResponsable.toString() !== req.user!.userId) {
    throw new AppError(403, 'No tenés acceso a este expediente')
  }
  await expediente.populate(POPULATE)
  res.json(expediente)
}

export async function crearExpediente(req: Request, res: Response) {
  const body = req.body ?? {}
  await verificarClienteActivo(body.cliente)

  const expediente = await ExpedienteModel.create({
    ...camposPermitidos(body),
    abogadoResponsable: req.user!.userId,
  })

  await expediente.populate(POPULATE)
  res.status(201).json(expediente)
}

export async function actualizarExpediente(req: Request, res: Response) {
  const expediente = await buscarExpedientePropio(req)

  if (expediente.estado === 'archivado') {
    throw new AppError(409, 'El expediente está archivado: reabrilo para poder editarlo')
  }

  const body = req.body ?? {}
  if (body.cliente !== undefined && body.cliente !== expediente.cliente.toString()) {
    await verificarClienteActivo(body.cliente)
  }

  expediente.set(camposPermitidos(body))
  await expediente.save()
  await expediente.populate(POPULATE)
  res.json(expediente)
}

export async function cambiarEstadoExpediente(req: Request, res: Response) {
  const { estado } = req.body ?? {}
  if (!esValor(ESTADOS, estado)) {
    throw new AppError(400, `El estado debe ser uno de: ${ESTADOS.join(', ')}`)
  }

  const expediente = await buscarExpedientePropio(req)
  expediente.estado = estado
  await expediente.save()
  await expediente.populate(POPULATE)
  res.json(expediente)
}

export async function transferirExpediente(req: Request, res: Response) {
  const { abogadoId } = req.body ?? {}
  if (!isValidObjectId(abogadoId)) {
    throw new AppError(400, 'Abogado inválido')
  }

  const expediente = await buscarExpedientePropio(req)

  const abogado = await UsuarioModel.findById(abogadoId)
  if (!abogado || abogado.rol !== 'abogado' || !abogado.activo) {
    throw new AppError(400, 'El nuevo responsable debe ser un abogado activo')
  }

  expediente.abogadoResponsable = abogado._id
  await expediente.save()
  await expediente.populate(POPULATE)
  res.json(expediente)
}