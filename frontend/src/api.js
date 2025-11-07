const API_URL = 'http://localhost:5000/api'

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Gagal mendaftar')
    }
    return res.json()
  } catch (error) {
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
