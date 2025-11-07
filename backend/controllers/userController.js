// backend/controllers/userController.js
import { supabase } from '../config/supabaseClient.js'
import bcrypt from 'bcrypt'

// ambil semua user
export const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, nama, email, no_hp, alamat, role')
      .order('id', { ascending: false })

    if (error) throw error

    res.json(data)
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

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nama,
          email,
          password: hashedPassword,
          no_hp,
          alamat,
          role
        }
      ])
      .select('id, nama, email, no_hp, alamat, role')

    if (error) throw error

    res.json({ success: true, user: data?.[0] })
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

    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingError) throw existingError

    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nama,
          email,
          password: hashedPassword,
          no_hp,
          alamat,
          role: role || 'donatur'
        }
      ])
      .select('id, nama, email, no_hp, alamat, role')

    if (error) throw error

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: data?.[0]
    })
  } catch (err) {
    console.error('❌ Error saat registrasi:', err)
    res.status(500).json({ error: err.message || 'Terjadi kesalahan saat registrasi' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (error) throw error

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' })
    }

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
