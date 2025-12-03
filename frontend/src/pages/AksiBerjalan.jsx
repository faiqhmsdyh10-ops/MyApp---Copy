import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getDonations } from "../api";

const AksiBerjalan = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        
        // First, get from localStorage (admin-created aksi)
        const localAksi = JSON.parse(localStorage.getItem("aksiList") || "[]");
        
        // Then get from API
        let apiData = [];
        try {
          apiData = await getDonations();
        } catch (err) {
          console.warn("Could not fetch from API:", err);
        }
        
        // Merge both sources, prioritize localStorage
        const merged = [...localAksi, ...apiData];
        
        setDonations(merged || []);
        setFilteredDonations(merged || []);
        setError("");
      } catch (err) {
        console.error("Gagal memuat aksi berjalan:", err);
        setError(err.message || "Gagal memuat data aksi");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Filter donations based on search and category
  useEffect(() => {
    let result = donations;

    if (searchQuery) {
      result = result.filter((d) =>
        (d.title || d.judul || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.description || d.deskripsi || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDonations(result);
  }, [searchQuery, donations]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-10 bg-gradient-to-r from-white via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Aksi Berjalan: <span className="text-blue-700">Ayo Bikin Dunia lebih Baik!</span></h2>
              <p className="mt-4 text-gray-600 max-w-xl">
                Yuk, lihat berbagai aksi kebaikan yang lagi jalan. Kamu bisa pilih mana yang paling
                menyentuh hatimu buat didukung hari ini.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-sm hover:bg-blue-700 transition">Mulai dari Sini</button>
                <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-white transition">Lihat Cara Kerja</button>
              </div>
            </div>
            <div className="hidden lg:block">
              {/* Decorative/illustration area - keep empty or add image later */}
              <div className="w-full h-44 bg-gradient-to-br from-blue-100 to-white rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="px-3 py-2 text-black bg-white border border-gray-200 rounded-full text-sm shadow-sm">Kategori ▾</button>
              <button className="px-3 py-2 text-black bg-white border border-gray-200 rounded-full text-sm shadow-sm">Filter ▾</button>
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari aksi yang sedang berjalan"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          {loading && <p className="text-center text-gray-500">Memuat aksi berjalan...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && filteredDonations.length === 0 && (
            <p className="text-center text-gray-500">Tidak ada aksi yang ditemukan</p>
          )}

          {/* 3-Column Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {donation.image ? (
                    <img src={donation.image} alt={donation.judul || donation.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">📷</div>
                  )}
                </div>

                <div className="p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">{donation.tipe || donation.category || "Umum"}</div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{donation.judul || donation.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{donation.deskripsi || donation.description}</p>
                  <div className="flex items-center justify-between">
                    <button onClick={() => navigate(`/aksi/${donation.id}`)} className="text-sm text-blue-600 font-medium">Learn more →</button>
                    <div className="text-xs text-gray-400">&nbsp;</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600 border-t mt-12">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-600">RuangBerbagi</span> — Semua hak dilindungi.
      </footer>
    </div>
  );
};

export default AksiBerjalan;
