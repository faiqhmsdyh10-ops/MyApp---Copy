// backend/controllers/userController.js
import pool from '../config/supabaseClient.js'
import bcrypt from 'bcrypt'

const PUBLIC_USER_FIELDS = 'id, nama, email, no_hp, alamat, role'

// ambil semua user
export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT ${PUBLIC_USER_FIELDS} FROM users ORDER BY id DESC`)
    res.json(rows)
  } catch (err) {
    console.error('❌ Error saat ambil user:', err)
    res.status(500).json({ error: err.message })
  }
}

// tambah user baru (hanya untuk admin/dashboard)
export const createUser = async (req, res) => {
  try {
    const { nama, email, password, no_hp, alamat, role } = req.body

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null

    const { rows } = await pool.query(
      `INSERT INTO users (nama, email, password, no_hp, alamat, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${PUBLIC_USER_FIELDS}`,
      [nama, email, hashedPassword, no_hp, alamat, role]
    )

    res.json({ success: true, user: rows[0] })
  } catch (err) {
    console.error('❌ Error saat tambah user:', err)
    res.status(500).json({ error: err.message })
  }
}

// register user baru (from public form)
export const registerUser = async (req, res) => {
  try {
    const { nama, email, password, no_hp, alamat, role } = req.body

    if (!nama || !email || !password) {
      return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' })
    }

    const { rowCount: existingCount } = await pool.query(
      'SELECT 1 FROM users WHERE email = $1',
      [email]
    )

    if (existingCount > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { rows } = await pool.query(
      `INSERT INTO users (nama, email, password, no_hp, alamat, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${PUBLIC_USER_FIELDS}`,
      [nama, email, hashedPassword, no_hp || null, alamat || null, role || 'donatur']
    )

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: rows[0]
    })
  } catch (err) {
    console.error('❌ Error saat registrasi:', err)
    res.status(500).json({ error: err.message || 'Terjadi kesalahan saat registrasi' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const { rows, rowCount } = await pool.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    )

    if (rowCount === 0) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    const user = rows[0]
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

    const { password: _ignored, ...userWithoutPassword } = user

    res.json({
      success: true,
      message: 'Login berhasil',
      user: userWithoutPassword
    })
  } catch (err) {
    console.error('❌ Error saat login:', err)
    res.status(500).json({ error: 'Terjadi kesalahan saat login' })
  }
}
