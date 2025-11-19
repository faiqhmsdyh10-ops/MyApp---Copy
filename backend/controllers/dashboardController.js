import { supabase } from '../config/supabaseClient.js'

const safeCount = async (buildQuery, defaultValue = 0) => {
  try {
    const { count, error } = await buildQuery
    if (error) throw error
    return count ?? defaultValue
  } catch (err) {
    if (err?.code !== '42P01') {
      console.error('❌ Gagal menghitung data dashboard:', err)
    }
    return defaultValue
  }
}

const safeAggregate = async (table, expression, alias, defaultValue = 0) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(`${alias}:${expression}`)
      .single()

    if (error) throw error
    const value = data?.[alias]
    if (value == null) return defaultValue
    const numericValue = Number(value)
    return Number.isFinite(numericValue) ? numericValue : defaultValue
  } catch (err) {
    if (err?.code !== '42P01') {
      console.error(`❌ Gagal menghitung agregasi ${expression} untuk ${table}:`, err)
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

    const moneyPromise = safeAggregate('donasi_uang', 'sum(jumlah)', 'total')

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

