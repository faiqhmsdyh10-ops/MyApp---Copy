import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Get all users
export const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data user' });
  }
};

// Add new user
export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email)
      return res.status(400).json({ message: 'Nama dan email wajib diisi' });

    const { data, error } = await supabase.from('users').insert([{ name, email }]);

    if (error) throw error;

    res.status(201).json({ message: 'User berhasil ditambahkan', data });
  } catch (err) {
    console.error('Error adding user:', err.message);
    res.status(500).json({ message: 'Gagal menambah user' });
  }
};
