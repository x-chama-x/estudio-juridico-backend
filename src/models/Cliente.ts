import { Schema, model, InferSchemaType } from 'mongoose'

function esFisica(this: { tipo?: string }) {
  return this.tipo === 'fisica'
}

function esJuridica(this: { tipo?: string }) {
  return this.tipo === 'juridica'
}

const clienteSchema = new Schema(
  {
    tipo: { type: String, enum: ['fisica', 'juridica'], required: true },

    // Persona física
    nombre: { type: String, trim: true, required: [esFisica, 'El nombre es obligatorio'] },
    apellido: { type: String, trim: true, required: [esFisica, 'El apellido es obligatorio'] },
    dni: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^\d{7,8}$/, 'El DNI debe tener 7 u 8 números'],
      required: [esFisica, 'El DNI es obligatorio'],
    },

    // Persona jurídica
    razonSocial: { type: String, trim: true, required: [esJuridica, 'La razón social es obligatoria'] },
    cuit: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^\d{11}$/, 'El CUIT debe tener 11 números, sin guiones'],
      required: [esJuridica, 'El CUIT es obligatorio'],
    },

    // Comunes
    email: { type: String, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'El email no es válido'] },
    telefono: { type: String, trim: true },
    domicilio: { type: String, trim: true },

    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export type Cliente = InferSchemaType<typeof clienteSchema>
export const ClienteModel = model('Cliente', clienteSchema, 'clientes')