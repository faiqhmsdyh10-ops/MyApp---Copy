const API_URL = 'http://localhost:5000/api'

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || data.message || 'Gagal mendaftar')
    }
    return data
  } catch (error) {
    // Jika error adalah network error, beri pesan yang lebih jelas
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Tidak dapat terhubung ke server. Pastikan server backend berjalan.')
    }
    throw error
  }
}

export const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Login gagal')
    }
    return res.json()
  } catch (error) {
    throw error
  }
}

export const getDonations = async () => {
  const res = await fetch(`${API_URL}/donations`)
  return res.json()
}

export const createDonation = async (donationData) => {
  const res = await fetch(`${API_URL}/donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donationData)
  })
  return res.json()
}

export const getDashboardSummary = async () => {
  try {
    const res = await fetch(`${API_URL}/dashboard/summary`)
    const payload = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(payload.error || 'Gagal memuat ringkasan dashboard')
    }
    return payload?.data || {
      totalDonors: 0,
      totalGoods: 0,
      totalServices: 0,
      totalMoney: 0
    }
  } catch (error) {
    throw error
  }
}