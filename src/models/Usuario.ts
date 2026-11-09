import { Schema, model, InferSchemaType } from 'mongoose'

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    rol: { type: String, enum: ['abogado', 'asistente'], required: true },
    matricula: { type: String, trim: true },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export type Usuario = InferSchemaType<typeof usuarioSchema>
export const UsuarioModel = model('Usuario', usuarioSchema, 'usuarios')