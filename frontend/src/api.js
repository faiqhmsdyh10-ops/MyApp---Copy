const API_URL = 'http://localhost:5000/api'

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
