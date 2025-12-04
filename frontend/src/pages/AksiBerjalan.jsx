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
        const localAksiRaw = JSON.parse(localStorage.getItem("aksiList") || "[]");
        const localAksi = Array.isArray(localAksiRaw) ? localAksiRaw.filter(Boolean) : [];
        
        // Then get from API
        let apiData = [];
        try {
          apiData = await getDonations();
        } catch (err) {
          console.warn("Could not fetch from API:", err);
        }
        
        // Merge both sources, prioritize localStorage, filter out falsy/null items
        const mergedRaw = [...(Array.isArray(localAksi) ? localAksi : []), ...(Array.isArray(apiData) ? apiData : [])];
        const merged = mergedRaw.filter(Boolean);
        
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-56 pb-20 relative bg-cover bg-center h-[100vh]" style={{ backgroundImage: "url('/images/aksi.jpg')" }}>
        <div className="max-w-8xl ml-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-6xl font-bold text-white">Aksi Berjalan: <span className="text-white">Ayo Bikin Dunia lebih Baik!</span></h2>
              <p className="mt-4 text-white max-w-xl">
                Yuk, lihat berbagai aksi kebaikan yang lagi jalan. Kamu bisa pilih mana yang paling
                menyentuh hatimu buat didukung hari ini.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">Mulai dari Sini</button>
                <button className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">Lihat Cara Kerja</button>
              </div>
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
            {filteredDonations.filter(Boolean).map((donation) => {
              const title = donation.judul || donation.title || "Tanpa Judul";
              const tipe = donation.tipe || donation.category || "Umum";
              const terkumpul = Number(donation.donasiTerkumpul ?? donation.terkumpul ?? 0) || 0;
              const target = Number(donation.targetDonasi ?? donation.target ?? 0);
              const safeTarget = Math.max(target || 0, 1); // avoid division by zero
              const progressPct = Math.min((terkumpul / safeTarget) * 100, 100);

              // Parse kategori/tipe yang bisa multiple (comma-separated)
              const kategoriRaw = donation.kategori || tipe || "Umum";
              const kategoriArray = Array.isArray(kategoriRaw) 
                ? kategoriRaw 
                : (typeof kategoriRaw === 'string' ? kategoriRaw.split(',').map(k => k.trim()) : [String(kategoriRaw)]);

              // Fungsi untuk mendapatkan warna badge berdasarkan tipe
              const getBadgeColor = (type) => {
                const normalizedType = type.toLowerCase();
                if (normalizedType.includes('uang')) return 'bg-green-50 text-green-700 border border-green-700';
                if (normalizedType.includes('barang')) return 'bg-blue-50 text-blue-700 border border-blue-700';
                if (normalizedType.includes('jasa')) return 'bg-purple-50 text-purple-700 border border-purple-700';
                return 'bg-gray-100 text-gray-700';
              };

              return (
              <div key={donation.id ?? Math.random()} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {donation.image ? (
                    <img src={donation.image} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">📷</div>
                  )}
                </div>

                <div className="px-6 py-5">
                  {/* Multiple badges dengan warna berbeda */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {kategoriArray.map((kategori, idx) => (
                      <span 
                        key={idx} 
                        className={`text-xs tracking-wide px-3 py-1 rounded-full ${getBadgeColor(kategori)}`}
                      >
                        {kategori}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">{title}</h3>
                  <p className="text-md font-bold text-blue-600 mb-2">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(terkumpul)}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Target: {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(target || 0)}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${progressPct}%` 
                        }}
                      ></div>
                    </div>
                  <div className="flex items-center justify-center mt-4">
                    <button onClick={() => navigate(`/aksi/${donation.id}`)} className="text-sm border border-gray-300 p-2 rounded-lg text-blue-600 font-medium hover:bg-gray-50">Lihat Detail</button>
                  </div>
                </div>
              </div>
            );})}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left - Text & CTA */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Yuk, Jadi Bagian dari Perubahan!</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Mulai langkah kecilmu hari ini. Karena kebaikan gak harus nungguin kaya, cukup niat dan tik aja.
              </p>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition font-medium">
                  Mulai Donasi Sekarang
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition font-medium">
                  Gabung Jadi Relawan
                </button>
              </div>
            </div>

            {/* Right - Charity Image */}
            <div className="flex justify-center">
              <div 
                className="w-full h-96 bg-gray-300 rounded-3xl bg-cover bg-center"
                style={{ backgroundImage: "url('/images/charity.jpg')" }}
              >
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-700 text-gray-300">
        {/* Newsletter Section */}
        <div className="border-b border-gray-600 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📧</div>
                <div>
                  <h3 className="font-bold text-white text-lg">Stay up to date</h3>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email to get the latest news..."
                  className="flex-1 md:w-80 px-4 py-2 rounded-lg bg-gray-600 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Column One */}
              <div>
                <h4 className="font-bold text-white mb-4">Column One</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Twenty One</a></li>
                  <li><a href="#" className="hover:text-white transition">Thirty Two</a></li>
                  <li><a href="#" className="hover:text-white transition">Fourty Three</a></li>
                  <li><a href="#" className="hover:text-white transition">Fifty Four</a></li>
                </ul>
              </div>

              {/* Column Two */}
              <div>
                <h4 className="font-bold text-white mb-4">Column Two</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">Sixty Five</a></li>
                  <li><a href="#" className="hover:text-white transition">Seventy Six</a></li>
                  <li><a href="#" className="hover:text-white transition">Eighty Seven</a></li>
                  <li><a href="#" className="hover:text-white transition">Ninety Eight</a></li>
                </ul>
              </div>

              {/* Column Three */}
              <div>
                <h4 className="font-bold text-white mb-4">Column Three</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">One Two</a></li>
                  <li><a href="#" className="hover:text-white transition">Three Four</a></li>
                  <li><a href="#" className="hover:text-white transition">Five Six</a></li>
                  <li><a href="#" className="hover:text-white transition">Seven Eight</a></li>
                </ul>
              </div>

              {/* Column Four - App Store & Social */}
              <div>
                <h4 className="font-bold text-white mb-4">Column Four</h4>
                <div className="space-y-3 mb-6">
                  <a href="#" className="block">
                    <div className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500 transition flex items-center gap-2">
                      <span className="text-xl">🍎</span>
                      <span className="text-sm">App Store</span>
                    </div>
                  </a>
                  <a href="#" className="block">
                    <div className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500 transition flex items-center gap-2">
                      <span className="text-xl">📱</span>
                      <span className="text-sm">Google Play</span>
                    </div>
                  </a>
                </div>
                
                {/* Social Media */}
                <div>
                  <h5 className="font-semibold text-white text-sm mb-3">Join Us</h5>
                  <div className="flex gap-3">
                    <a href="#" className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 transition">
                      <span className="text-sm">▶️</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 transition">
                      <span className="text-sm">f</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 transition">
                      <span className="text-sm">🐦</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 transition">
                      <span className="text-sm">📷</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 transition">
                      <span className="text-sm">in</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-600 py-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                <span>CompanyName © 2024. All rights reserved.</span>
              </div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition">Eleven</a>
                <a href="#" className="hover:text-white transition">Twelve</a>
                <a href="#" className="hover:text-white transition">Thirteen</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AksiBerjalan;
