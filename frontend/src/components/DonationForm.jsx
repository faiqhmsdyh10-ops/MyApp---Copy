import { useState } from 'react'
import { createDonation } from '../api'

export default function DonationForm() {
  const [form, setForm] = useState({ user_id: '', program_id: '', jumlah: '', metode_pembayaran: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createDonation(form)
    alert('Donasi berhasil dikirim!')
  }

  return (
    <form onSubmit={handleSubmit} className="donation-form">
      <h3>Form Donasi Uang</h3>
      <input name="user_id" placeholder="ID User" onChange={handleChange} />
      <input name="program_id" placeholder="ID Program" onChange={handleChange} />
      <input name="jumlah" placeholder="Jumlah Donasi" type="number" onChange={handleChange} />
      <input name="metode_pembayaran" placeholder="Metode Pembayaran" onChange={handleChange} />
      <button type="submit">Kirim Donasi</button>
    </form>
  )
}
