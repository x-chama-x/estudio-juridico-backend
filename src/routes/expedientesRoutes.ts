import { Router } from 'express'
import { requireAuth, requireRol } from '../middleware/auth'
import {
  listarExpedientes,
  obtenerExpediente,
  crearExpediente,
  actualizarExpediente,
  cambiarEstadoExpediente,
  transferirExpediente,
} from '../controllers/expedientesController'

const router = Router()

router.use(requireAuth)

router.get('/', listarExpedientes)
router.get('/:id', obtenerExpediente)
router.post('/', requireRol('abogado'), crearExpediente)
router.put('/:id', requireRol('abogado'), actualizarExpediente)
router.patch('/:id/estado', requireRol('abogado'), cambiarEstadoExpediente)
router.patch('/:id/responsable', requireRol('abogado'), transferirExpediente)

export default router