import { supabase } from '../config/supabaseClient.js'

// GET all donations
export const getDonations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donasi_uang')
      .select('*')
      .order('tanggal_donasi', { ascending: false })

    if (error) {
      // Log error but return empty array (graceful fallback)
      // This allows frontend to still work with localStorage data
      console.warn('Supabase donasi_uang query error:', error.message)
      return res.json([])
    }
    res.json(data || [])
  } catch (err) {
    console.error('getDonations error:', err)
    // Return empty array instead of error to allow frontend fallback
    res.json([])
  }
}

// POST a new donation
export const createDonation = async (req, res) => {
  const { user_id, program_id, jumlah, metode_pembayaran } = req.body

  const { data, error } = await supabase
    .from('donasi_uang')
    .insert([{ user_id, program_id, jumlah, metode_pembayaran }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json(data)
}
