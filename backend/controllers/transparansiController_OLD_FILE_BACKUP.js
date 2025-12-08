import { supabase } from '../config/supabaseClient.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const STORAGE_FILE = path.join(__dirname, '../data/transparansi.json')

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Load from file or initialize empty array
let transparansiStorage = []
try {
  if (fs.existsSync(STORAGE_FILE)) {
    const fileData = fs.readFileSync(STORAGE_FILE, 'utf8')
    transparansiStorage = JSON.parse(fileData)
    console.log(`✅ Loaded ${transparansiStorage.length} transparansi records from file`)
  }
} catch (error) {
  console.error('Error loading transparansi data:', error)
  transparansiStorage = []
}

// Helper function to save to file
const saveToFile = () => {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(transparansiStorage, null, 2))
  } catch (error) {
    console.error('Error saving transparansi data:', error)
  }
}

// GET all transparansi untuk 1 aksi
export const getTransparansiByAksi = async (req, res) => {
  try {
    const { aksiId } = req.params

    if (!aksiId) {
      return res.status(400).json({ error: 'aksiId diperlukan' })
    }

    // Filter by aksiId and sort by date DESC
    const filtered = transparansiStorage
      .filter(item => item.aksi_id === aksiId)
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))

    res.json({ data: filtered })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST new transparansi update
export const createTransparansi = async (req, res) => {
  try {
    const { aksi_id, tanggal, judul, deskripsi, gambar_url } = req.body

    // Validate required fields
    if (!aksi_id || !judul) {
      return res.status(400).json({ error: 'aksi_id dan judul wajib diisi' })
    }

    const newTransparansi = {
      id: `transparansi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      aksi_id,
      tanggal: tanggal || new Date().toISOString().split('T')[0],
      judul,
      deskripsi: deskripsi || null,
      gambar_url: gambar_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    transparansiStorage.push(newTransparansi)
    saveToFile()

    res.status(201).json({ data: newTransparansi })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// UPDATE transparansi
export const updateTransparansi = async (req, res) => {
  try {
    const { id } = req.params
    const { tanggal, judul, deskripsi, gambar_url } = req.body

    if (!id) {
      return res.status(400).json({ error: 'ID diperlukan' })
    }

    const index = transparansiStorage.findIndex(item => item.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Transparansi tidak ditemukan' })
    }

    transparansiStorage[index] = {
      ...transparansiStorage[index],
      tanggal,
      judul,
      deskripsi,
      gambar_url,
      updated_at: new Date().toISOString()
    }

    saveToFile()

    res.json({ data: transparansiStorage[index] })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// DELETE transparansi
export const deleteTransparansi = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: 'ID diperlukan' })
    }

    const index = transparansiStorage.findIndex(item => item.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Transparansi tidak ditemukan' })
    }

    transparansiStorage.splice(index, 1)
    saveToFile()

    res.json({ message: 'Transparansi berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
