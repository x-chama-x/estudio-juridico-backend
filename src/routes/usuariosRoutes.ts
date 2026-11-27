import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { listarAbogados } from '../controllers/usuariosController'

const router = Router()

router.use(requireAuth)

router.get('/abogados', listarAbogados)

export default router