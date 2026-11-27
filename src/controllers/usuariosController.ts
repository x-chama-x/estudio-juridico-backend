import { Request, Response } from 'express'
import { UsuarioModel } from '../models/Usuario'

export async function listarAbogados(_req: Request, res: Response) {
  const abogados = await UsuarioModel.find({ rol: 'abogado', activo: true })
    .select('nombre apellido')
    .sort({ apellido: 1, nombre: 1 })
  res.json(abogados)
}