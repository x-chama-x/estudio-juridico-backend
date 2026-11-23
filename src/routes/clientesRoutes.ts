import { Router } from 'express'
import { requireAuth, requireRol } from '../middleware/auth'
import {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  cambiarEstadoCliente,
} from '../controllers/clientesController'

const router = Router()

router.use(requireAuth)

router.get('/', listarClientes)
router.get('/:id', obtenerCliente)
router.post('/', crearCliente)
router.put('/:id', actualizarCliente)
router.patch('/:id/estado', requireRol('abogado'), cambiarEstadoCliente)

export default router