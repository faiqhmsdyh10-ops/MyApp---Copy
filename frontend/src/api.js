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
}

// Transparansi Donasi API
export const getTransparansiByAksi = async (aksiId) => {
  const res = await fetch(`${API_URL}/transparansi/aksi/${aksiId}`)
  if (!res.ok) throw new Error('Gagal memuat transparansi')
  return res.json()
}

export const createTransparansi = async (data) => {
  const res = await fetch(`${API_URL}/transparansi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Gagal membuat transparansi')
  return res.json()
}

export const updateTransparansi = async (id, data) => {
  const res = await fetch(`${API_URL}/transparansi/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Gagal update transparansi')
  return res.json()
}

export const deleteTransparansi = async (id) => {
  const res = await fetch(`${API_URL}/transparansi/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Gagal hapus transparansi')
  return res.json()
}

// User Profile API
export const getUserProfile = async (email) => {
  try {
    const res = await fetch(`${API_URL}/users/profile/${email}`)
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error('Gagal mengambil profil')
    }
    const data = await res.json()
    return data.user || data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export const updateUserProfile = async (email, profileData) => {
  const res = await fetch(`${API_URL}/users/profile/${email}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  })
  if (!res.ok) throw new Error('Gagal mengupdate profil')
  const data = await res.json()
  return data
}