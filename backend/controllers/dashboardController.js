import { supabase } from '../config/supabaseClient.js'

const safeCount = async (buildQuery, defaultValue = 0) => {
  try {
    const { count, error } = await buildQuery
    if (error) {
      // Jika error bukan "table not found", log error
      if (error.code !== '42P01' && error.code !== 'PGRST116') {
        console.warn('⚠️ Database query error:', error.message)
      }
      return defaultValue
    }
    return count ?? defaultValue
  } catch (err) {
    // Jika fetch failed (network issue), gunakan default value
    if (err.message?.includes('fetch failed')) {
      console.warn('⚠️ Database connection failed, using default value')
      return defaultValue
    }
    if (err?.code !== '42P01') {
      console.error('❌ Gagal menghitung data dashboard:', err)
    }
    return defaultValue
  }
}

const safeSum = async (table, column, defaultValue = 0) => {
  try {
    // Ambil semua data dan jumlahkan di JavaScript
    const { data, error } = await supabase
      .from(table)
      .select(column)

    if (error) {
      // Jika error bukan "table not found", log error
      if (error.code !== '42P01' && error.code !== 'PGRST116') {
        console.warn('⚠️ Database query error:', error.message)
      }
      return defaultValue
    }
    
    if (!data || data.length === 0) return defaultValue
    
    // Jumlahkan semua nilai
    const total = data.reduce((sum, item) => {
      const value = Number(item[column])
      return sum + (Number.isFinite(value) ? value : 0)
    }, 0)
    
    return total
  } catch (err) {
    // Jika fetch failed (network issue), gunakan default value
    if (err.message?.includes('fetch failed')) {
      console.warn('⚠️ Database connection failed, using default value')
      return defaultValue
    }
    if (err?.code !== '42P01') {
      console.error(`❌ Gagal menghitung sum ${column} untuk ${table}:`, err)
    }
    return defaultValue
  }
}

export const getDashboardSummary = async (_req, res) => {
  try {
    const donorsPromise = safeCount(
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'donatur')
    )

    const goodsPromise = safeCount(
      supabase.from('donasi_barang').select('*', { count: 'exact', head: true })
    )

    const servicesPromise = safeCount(
      supabase.from('program_relawan').select('*', { count: 'exact', head: true })
    )

    const moneyPromise = safeSum('donasi_uang', 'jumlah')

    const [totalDonors, totalGoods, totalServices, totalMoney] = await Promise.all([
      donorsPromise,
      goodsPromise,
      servicesPromise,
      moneyPromise
    ])

    res.json({
      success: true,
      data: {
        totalDonors,
        totalGoods,
        totalServices,
        totalMoney
      }
    })
  } catch (err) {
    console.error('❌ Error saat mengambil ringkasan dashboard:', err)
    res.status(500).json({
      success: false,
      error: 'Gagal memuat ringkasan dashboard',
      details: err.message
    })
  }
}

