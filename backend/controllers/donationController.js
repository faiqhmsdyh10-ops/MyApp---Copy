import { supabase } from '../config/supabaseClient.js'

// GET all donations
export const getDonations = async (req, res) => {
  const { data, error } = await supabase
    .from('donasi_uang')
    .select('*')
    .order('tanggal_donasi', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
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
