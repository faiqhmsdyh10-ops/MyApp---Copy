import express from 'express'
import {
  getTransparansiByAksi,
  createTransparansi,
  updateTransparansi,
  deleteTransparansi
} from '../controllers/transparansiController.js'

const router = express.Router()

// GET transparansi untuk 1 aksi
router.get('/aksi/:aksiId', getTransparansiByAksi)

// POST transparansi baru
router.post('/', createTransparansi)

// UPDATE transparansi
router.patch('/:id', updateTransparansi)

// DELETE transparansi
router.delete('/:id', deleteTransparansi)

export default router
