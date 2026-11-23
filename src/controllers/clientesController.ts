import { Request, Response } from 'express'
import { ClienteModel } from '../models/Cliente'
import { AppError } from '../utils/AppError'
import { leerPaginacion } from '../utils/paginacion'
import { escaparRegex } from '../utils/escaparRegex'

const CAMPOS_COMUNES = ['email', 'telefono', 'domicilio']
const CAMPOS_FISICA = ['nombre', 'apellido', 'dni']
const CAMPOS_JURIDICA = ['razonSocial', 'cuit']

function camposPermitidos(body: Record<string, unknown>, tipo: string) {
  const campos = [...CAMPOS_COMUNES, ...(tipo === 'fisica' ? CAMPOS_FISICA : CAMPOS_JURIDICA)]
  const datos: Record<string, unknown> = {}
  for (const campo of campos) {
    if (body[campo] !== undefined) {
      datos[campo] = body[campo]
    }
  }
  return datos
}

export async function listarClientes(req: Request, res: Response) {
  const { page, limit, skip } = leerPaginacion(req.query)
  const filtro: Record<string, unknown> = {}

  if (req.query.incluirInactivos !== 'true') {
    filtro.activo = true
  }

  if (req.query.tipo === 'fisica' || req.query.tipo === 'juridica') {
    filtro.tipo = req.query.tipo
  }

  if (typeof req.query.q === 'string' && req.query.q.trim() !== '') {
    const texto = new RegExp(escaparRegex(req.query.q.trim()), 'i')
    filtro.$or = [{ nombre: texto }, { apellido: texto }, { razonSocial: texto }, { dni: texto }, { cuit: texto }]
  }

  const [data, total] = await Promise.all([
    ClienteModel.find(filtro).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit),
    ClienteModel.countDocuments(filtro),
  ])

  res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) })
}

export async function obtenerCliente(req: Request, res: Response) {
  const cliente = await ClienteModel.findById(req.params.id)
  if (!cliente) {
    throw new AppError(404, 'Cliente no encontrado')
  }
  res.json(cliente)
}

export async function crearCliente(req: Request, res: Response) {
  const body = req.body ?? {}

  if (body.tipo !== 'fisica' && body.tipo !== 'juridica') {
    throw new AppError(400, 'El tipo debe ser "fisica" o "juridica"')
  }

  const cliente = await ClienteModel.create({ tipo: body.tipo, ...camposPermitidos(body, body.tipo) })
  res.status(201).json(cliente)
}

export async function actualizarCliente(req: Request, res: Response) {
  const cliente = await ClienteModel.findById(req.params.id)
  if (!cliente) {
    throw new AppError(404, 'Cliente no encontrado')
  }

  const body = req.body ?? {}
  if (body.tipo !== undefined && body.tipo !== cliente.tipo) {
    throw new AppError(400, 'No se puede cambiar el tipo de cliente')
  }

  cliente.set(camposPermitidos(body, cliente.tipo))
  await cliente.save()
  res.json(cliente)
}

export async function cambiarEstadoCliente(req: Request, res: Response) {
  const { activo } = req.body ?? {}
  if (typeof activo !== 'boolean') {
    throw new AppError(400, 'El campo "activo" debe ser true o false')
  }

  const cliente = await ClienteModel.findById(req.params.id)
  if (!cliente) {
    throw new AppError(404, 'Cliente no encontrado')
  }

  // TODO (rebanada 3): si activo es false, responder 409 si el cliente tiene expedientes no archivados

  cliente.activo = activo
  await cliente.save()
  res.json(cliente)
}