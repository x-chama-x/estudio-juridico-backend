import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { UsuarioModel } from '../models/Usuario'
import { AppError } from '../utils/AppError'
import { generarToken, Rol } from '../services/authService'

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {}

  // Se valida la presencia de las credenciales requeridas.
  if (!email || !password) {
    throw new AppError(400, 'Email y contraseña son obligatorios')
  }

  // Se busca el usuario con su password para verificar la autenticación.
  const usuario = await UsuarioModel.findOne({ email: String(email).toLowerCase() }).select('+password')

  if (!usuario || !usuario.activo) {
    throw new AppError(401, 'Credenciales inválidas')
  }

  // La contraseña se compara contra el hash almacenado.
  const passwordValida = await bcrypt.compare(password, usuario.password)
  if (!passwordValida) {
    throw new AppError(401, 'Credenciales inválidas')
  }

  // Se crea el token de sesión con el identificador y el rol del usuario.
  const token = generarToken({ userId: usuario.id, rol: usuario.rol as Rol })

  res.json({
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
    },
  })
}

export async function me(req: Request, res: Response) {
  // Se obtiene el usuario autenticado desde el payload del token.
  const usuario = await UsuarioModel.findById(req.user!.userId)

  if (!usuario || !usuario.activo) {
    throw new AppError(401, 'Usuario no encontrado o inactivo')
  }

  res.json({
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    rol: usuario.rol,
  })
}