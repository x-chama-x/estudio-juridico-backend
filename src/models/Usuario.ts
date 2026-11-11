import { Schema, model, InferSchemaType } from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true, select: false },
    rol: { type: String, enum: ['abogado', 'asistente'], required: true },
    matricula: { type: String, trim: true },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
)

usuarioSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

export type Usuario = InferSchemaType<typeof usuarioSchema>
export const UsuarioModel = model('Usuario', usuarioSchema, 'usuarios')