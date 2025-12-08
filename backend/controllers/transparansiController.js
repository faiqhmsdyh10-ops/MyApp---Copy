import { supabase } from '../config/supabaseClient.js'

// GET all transparansi untuk 1 aksi
export const getTransparansiByAksi = async (req, res) => {
  try {
    const { aksiId } = req.params
    
    console.log('🔍 Getting transparansi for aksiId:', aksiId)
    
    const { data, error } = await supabase
      .from('transparansi_donasi')
      .select('*')
      .eq('aksi_id', aksiId)
      .order('tanggal', { ascending: false })
    
    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }
    
    console.log(`✅ Found ${data.length} transparansi records`)
    res.json({ data })
    
  } catch (error) {
    console.error('❌ Error getting transparansi:', error)
    res.status(500).json({ 
      error: 'Gagal mengambil data transparansi',
      details: error.message 
    })
  }
}

// POST - Create transparansi baru
export const createTransparansi = async (req, res) => {
  try {
    const { aksi_id, tanggal, judul, deskripsi, gambar_url } = req.body
    
    console.log('📝 Creating transparansi for aksiId:', aksi_id)
    
    // Validasi
    if (!aksi_id || !judul) {
      return res.status(400).json({ 
        error: 'aksi_id dan judul wajib diisi' 
      })
    }
    
    const newTransparansi = {
      aksi_id: String(aksi_id), // Convert to string
      tanggal: tanggal || new Date().toISOString().split('T')[0],
      judul,
      deskripsi: deskripsi || null,
      gambar_url: gambar_url || null
    }
    
    const { data, error } = await supabase
      .from('transparansi_donasi')
      .insert([newTransparansi])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }
    
    console.log('✅ Transparansi created with ID:', data.id)
    res.status(201).json({ 
      message: 'Update transparansi berhasil ditambahkan',
      data 
    })
    
  } catch (error) {
    console.error('❌ Error creating transparansi:', error)
    res.status(500).json({ 
      error: 'Gagal membuat update transparansi',
      details: error.message 
    })
  }
}

// PATCH - Update transparansi
export const updateTransparansi = async (req, res) => {
  try {
    const { id } = req.params
    const { tanggal, judul, deskripsi, gambar_url } = req.body
    
    console.log('✏️ Updating transparansi:', id)
    
    const updates = {
      updated_at: new Date().toISOString()
    }
    
    if (tanggal !== undefined) updates.tanggal = tanggal
    if (judul !== undefined) updates.judul = judul
    if (deskripsi !== undefined) updates.deskripsi = deskripsi
    if (gambar_url !== undefined) updates.gambar_url = gambar_url
    
    const { data, error } = await supabase
      .from('transparansi_donasi')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }
    
    if (!data) {
      return res.status(404).json({ 
        error: 'Transparansi tidak ditemukan' 
      })
    }
    
    console.log('✅ Transparansi updated')
    res.json({ 
      message: 'Update transparansi berhasil diubah',
      data 
    })
    
  } catch (error) {
    console.error('❌ Error updating transparansi:', error)
    res.status(500).json({ 
      error: 'Gagal mengupdate transparansi',
      details: error.message 
    })
  }
}

// DELETE - Hapus transparansi
export const deleteTransparansi = async (req, res) => {
  try {
    const { id } = req.params
    
    console.log('🗑️ Deleting transparansi:', id)
    
    const { error } = await supabase
      .from('transparansi_donasi')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }
    
    console.log('✅ Transparansi deleted')
    res.json({ 
      message: 'Update transparansi berhasil dihapus' 
    })
    
  } catch (error) {
    console.error('❌ Error deleting transparansi:', error)
    res.status(500).json({ 
      error: 'Gagal menghapus transparansi',
      details: error.message 
    })
  }
}
