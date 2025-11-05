import React, { useEffect, useState } from "react";

const DonationDetailPage = () => {
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    // Ganti dengan endpoint backend kamu
    fetch("http://localhost:5000/api/donations/1")
      .then((res) => res.json())
      .then((data) => setDonation(data))
      .catch((err) => console.error(err));
  }, []);

  if (!donation) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Judul dan tanggal */}
      <h2 className="text-2xl font-bold mb-2">
        {donation.title || "Bantuan Darurat untuk Warga Terdampak Banjir di Kabupaten Demak"}
      </h2>
      <p className="text-gray-500 mb-4">{donation.date || "15 Desember 2025"}</p>

      <div className="grid grid-cols-3 gap-6">
        {/* Kolom kiri: deskripsi */}
        <div className="col-span-2">
          <div className="bg-gray-100 h-60 mb-4 rounded-xl"></div>
          <p className="text-gray-700 leading-relaxed">
            {donation.description ||
              `Sejak awal Desember 2025, curah hujan tinggi di wilayah pantura Jawa Tengah menyebabkan meluapnya Sungai Tuntang dan Sungai Serang...`}
          </p>

          <h4 className="font-semibold mt-6 mb-2">Barang yang Dibutuhkan:</h4>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Pakaian layak pakai (dewasa & anak-anak)</li>
            <li>Selimut, handuk, dan tikar</li>
            <li>Obat-obatan ringan & vitamin</li>
            <li>Air mineral dan makanan instan</li>
          </ul>
        </div>

        {/* Kolom kanan: info donasi */}
        <div className="bg-white shadow p-5 rounded-xl">
          <h4 className="text-gray-500 font-semibold">Dana Terkumpul</h4>
          <p className="text-blue-600 text-2xl font-bold mb-2">
            Rp {donation.total?.toLocaleString("id-ID") || "70.550.000"}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
          <p className="text-gray-500 text-sm mb-4">dari target Rp 100.000.000</p>

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg mb-2 hover:bg-blue-600">
            Ikut Berdonasi
          </button>
          <button className="w-full border border-blue-500 text-blue-500 py-2 rounded-lg hover:bg-blue-50">
            Lihat Penyaluran Donasi
          </button>

          <h4 className="mt-5 font-semibold">Baru Saja Berdonasi</h4>
          <ul className="mt-3 text-gray-700 text-sm space-y-2">
            <li>Faiqah — Rp50.000 · 3 jam lalu</li>
            <li>Ahmad — Rp100.000 · 5 jam lalu</li>
            <li>Siti — Rp25.000 · 6 jam lalu</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 bg-blue-50 text-center py-8 rounded-xl">
        <h3 className="text-xl font-bold mb-2">Yuk, Jadi Bagian dari Perubahan!</h3>
        <p className="text-gray-700 max-w-xl mx-auto">
          Bencana memang datang tanpa diduga, tetapi kepedulian bisa selalu kita hadirkan.
          Yuk, ikut berkontribusi membantu sesama!
        </p>
      </div>
    </div>
  );
};

export default DonationDetailPage;
