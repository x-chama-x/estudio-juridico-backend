import { Schema, model, InferSchemaType } from 'mongoose'

export const FUEROS = [
  'civil',
  'comercial',
  'laboral',
  'penal',
  'familia',
  'contencioso_administrativo',
  'seguridad_social',
] as const
export const ETAPAS = ['extrajudicial', 'mediacion', 'judicial'] as const
export const ESTADOS = ['en_tramite', 'en_espera', 'archivado'] as const
export const JURISDICCIONES = ['nacion', 'caba', 'pba'] as const

const expedienteSchema = new Schema(
  {
    caratula: { type: String, required: [true, 'La carátula es obligatoria'], trim: true },
    cliente: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'El cliente es obligatorio'],
      index: true,
    },
    abogadoResponsable: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El abogado responsable es obligatorio'],
      index: true,
    },
    fuero: {
      type: String,
      enum: { values: [...FUEROS], message: 'Fuero inválido' },
      required: [true, 'El fuero es obligatorio'],
    },
    etapa: {
      type: String,
      enum: { values: [...ETAPAS], message: 'Etapa inválida' },
      default: 'extrajudicial',
    },
    estado: {
      type: String,
      enum: { values: [...ESTADOS], message: 'Estado inválido' },
      default: 'en_tramite',
      index: true,
    },
    fechaInicio: { type: Date, default: Date.now },
    datosJudiciales: {
      jurisdiccion: { type: String, enum: { values: [...JURISDICCIONES], message: 'Jurisdicción inválida' } },
      numero: { type: String, trim: true, match: [/^\d+$/, 'El número de expediente debe tener solo números'] },
      anio: { type: Number, min: [1900, 'Año inválido'], max: [2100, 'Año inválido'] },
      juzgado: { type: String, trim: true },
      secretaria: { type: String, trim: true },
    },
  },
  { timestamps: true }
)

expedienteSchema.pre('validate', function () {
  if (this.etapa !== 'judicial') return

  const datos = this.datosJudiciales
  if (!datos?.jurisdiccion) {
    this.invalidate('datosJudiciales.jurisdiccion', 'La jurisdicción es obligatoria en etapa judicial')
  }
  if (!datos?.numero) {
    this.invalidate('datosJudiciales.numero', 'El número de expediente es obligatorio en etapa judicial')
  }
  if (!datos?.anio) {
    this.invalidate('datosJudiciales.anio', 'El año es obligatorio en etapa judicial')
  }
  if (!datos?.juzgado) {
    this.invalidate('datosJudiciales.juzgado', 'El juzgado es obligatorio en etapa judicial')
  }
})

expedienteSchema.index(
  { 'datosJudiciales.jurisdiccion': 1, fuero: 1, 'datosJudiciales.numero': 1, 'datosJudiciales.anio': 1 },
  { unique: true, partialFilterExpression: { 'datosJudiciales.numero': { $exists: true } } }
)

export type Expediente = InferSchemaType<typeof expedienteSchema>
export const ExpedienteModel = model('Expediente', expedienteSchema, 'expedientes')