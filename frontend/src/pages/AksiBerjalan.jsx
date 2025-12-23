import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const AksiBerjalan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [sortBy, setSortBy] = useState("Terbaru");
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Scroll to list-aksi section if hash is present
  useEffect(() => {
    if (location.hash === "#list-aksi") {
      // Wait for content to load, then scroll
      const scrollToList = () => {
        const element = document.getElementById("list-aksi");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      // Small delay to ensure DOM is ready
      setTimeout(scrollToList, 100);
    }
  }, [location.hash, loading]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        
        // Get from localStorage (admin-created aksi)
        // Note: Aksi saat ini disimpan di localStorage, bukan Supabase
        const localAksiRaw = JSON.parse(localStorage.getItem("aksiList") || "[]");
        const localAksi = Array.isArray(localAksiRaw) ? localAksiRaw.filter(Boolean) : [];
        
        setDonations(localAksi);
        setFilteredDonations(localAksi);
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

  // Filter and sort donations based on search, kategori, and sortBy
  useEffect(() => {
    let result = donations;

    // Search filter
    if (searchQuery) {
      result = result.filter((d) =>
        (d.title || d.judul || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.description || d.deskripsi || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Kategori filter
    if (selectedKategori !== "Semua") {
      result = result.filter((d) => {
        const tipe = d.kategori || d.tipe || d.category || "Umum";
        const arr = Array.isArray(tipe)
          ? tipe
          : typeof tipe === "string"
            ? tipe.split(",").map((k) => k.trim())
            : [String(tipe)];
        return arr.includes(selectedKategori);
      });
    }

    // Sorting
    if (sortBy === "Terbaru") {
      result = result.slice().sort((a, b) => {
        const dateA = new Date(a.createdAt || a.lastUpdated || 0);
        const dateB = new Date(b.createdAt || b.lastUpdated || 0);
        return dateB - dateA;
      });
    } else if (sortBy === "Progress Terendah") {
      result = result.slice().sort((a, b) => {
        const ta = Number(a.donasiTerkumpul ?? a.terkumpul ?? 0);
        const taTarget = Number(a.targetDonasi ?? a.target ?? 1);
        const tb = Number(b.donasiTerkumpul ?? b.terkumpul ?? 0);
        const tbTarget = Number(b.targetDonasi ?? b.target ?? 1);
        const pa = Math.min((ta / Math.max(taTarget, 1)) * 100, 100);
        const pb = Math.min((tb / Math.max(tbTarget, 1)) * 100, 100);
        return pa - pb;
      });
    } else if (sortBy === "Progress Tertinggi") {
      result = result.slice().sort((a, b) => {
        const ta = Number(a.donasiTerkumpul ?? a.terkumpul ?? 0);
        const taTarget = Number(a.targetDonasi ?? a.target ?? 1);
        const tb = Number(b.donasiTerkumpul ?? b.terkumpul ?? 0);
        const tbTarget = Number(b.targetDonasi ?? b.target ?? 1);
        const pa = Math.min((ta / Math.max(taTarget, 1)) * 100, 100);
        const pb = Math.min((tb / Math.max(tbTarget, 1)) * 100, 100);
        return pb - pa;
      });
    }

    setFilteredDonations(result);
  }, [searchQuery, donations, selectedKategori, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-56 pb-20 relative bg-cover bg-center h-[100vh]" style={{ backgroundImage: "url('/images/aksi.jpg')" }}>
        <div className="max-w-8xl ml-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-6xl font-bold text-white leading-tight">Aksi Berjalan: <span className="text-white">Ayo Bikin Dunia <span className="pl-2 pb-2 border-r-2 text-yellow-50 rounded-l-md px-1 border-yellow-400 bg-yellow-500/40">lebih Baik!</span> </span></h2>
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
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* Kategori Filter - Custom Dropdown */}
            <div className="relative w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <button
                onClick={() => setShowKategoriDropdown(!showKategoriDropdown)}
                className="flex items-center justify-between w-full gap-2 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl text-sm hover:border-gray-400 transition"
              >
                <span className="text-gray-900">{selectedKategori}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showKategoriDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showKategoriDropdown && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {["Semua", "Uang", "Barang", "Jasa"].map((kat) => (
                    <button
                      key={kat}
                      onClick={() => {
                        setSelectedKategori(kat);
                        setShowKategoriDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition ${
                        selectedKategori === kat
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {kat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sorting Filter - Custom Dropdown */}
            <div className="relative w-full md:w-56">
              <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center justify-between w-full gap-2 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl text-sm hover:border-gray-400 transition"
              >
                <span className="text-gray-900">{sortBy}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showSortDropdown && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {["Terbaru", "Progress Terendah", "Progress Tertinggi"].map((sort) => (
                    <button
                      key={sort}
                      onClick={() => {
                        setSortBy(sort);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition ${
                        sortBy === sort
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Aksi</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cari aksi yang sedang berjalan"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Trigger search on Enter key
                      e.preventDefault();
                    }
                  }}
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  onClick={() => {
                    // Search is already handled by useEffect watching searchQuery
                    // This button provides visual feedback
                  }}
                  className="px-6 py-3 mb-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section id="list-aksi" className="py-10">
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
    </div>
  );
};

export default AksiBerjalan;
