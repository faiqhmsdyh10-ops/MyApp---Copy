import { useEffect, useState } from 'react'
import { getDonations } from '../api'

export default function DonationList() {
  const [donations, setDonations] = useState([])

  useEffect(() => {
    getDonations().then(data => setDonations(data))
  }, [])

  return (
    <div>
      <h3>Daftar Donasi Uang</h3>
      <ul>
        {donations.map((donasi) => (
          <li key={donasi.donasi_uang_id}>
            Donatur #{donasi.user_id} menyumbang Rp {donasi.jumlah} ({donasi.metode_pembayaran})
          </li>
        ))}
      </ul>
    </div>
  )
}
