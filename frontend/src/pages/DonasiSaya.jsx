import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const DonasiSaya = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDonated, setTotalDonated] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // Search by aksi name
  const [filterDate, setFilterDate] = useState(""); // Filter by specific date
  const [filterMonth, setFilterMonth] = useState(""); // Filter by month (MM format)
  const [filterYear, setFilterYear] = useState(""); // Filter by year (YYYY format)

  useEffect(() => {
    const userDataStr = localStorage.getItem("userData");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn || !userDataStr) {
      navigate("/login");
      return;
    }

    // Get donations from localStorage
    const donationList = JSON.parse(localStorage.getItem("donations") || "[]");
    const userData = JSON.parse(userDataStr);
    
    // Filter donations by current user (check email or nama lengkap)
    const userDonations = donationList.filter(
      (d) => d.email === userData.email || d.namaLengkap === userData.name
    );

    setDonations(userDonations);
    
    // Calculate total donated
    const total = userDonations.reduce((sum, d) => {
      const amount = parseInt(d.jumlahDonasi) || 0;
      return sum + amount;
    }, 0);
    setTotalDonated(total);
    setLoading(false);
  }, [navigate]);

  // Sort donations by newest first and filter by search/date
  const getFilteredAndSortedDonations = () => {
    let filtered = [...donations];

    // Sort by newest first (default)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filter by search query (aksi name)
    if (searchQuery.trim()) {
      filtered = filtered.filter((d) =>
        (d.aksiJudul || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by specific date (YYYY-MM-DD)
    if (filterDate) {
      filtered = filtered.filter((d) => {
        const donationDate = new Date(d.createdAt).toISOString().split("T")[0];
        return donationDate === filterDate;
      });
    }

    // Filter by month (MM format)
    if (filterMonth) {
      filtered = filtered.filter((d) => {
        const month = String(new Date(d.createdAt).getMonth() + 1).padStart(2, "0");
        return month === filterMonth;
      });
    }

    // Filter by year (YYYY format)
    if (filterYear) {
      filtered = filtered.filter((d) => {
        const year = new Date(d.createdAt).getFullYear().toString();
        return year === filterYear;
      });
    }

    return filtered;
  };

  const filteredDonations = getFilteredAndSortedDonations();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 pb-12 px-4">
          <div className="text-center">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Background Image Section */}
        <div 
          className="w-full relative"
          style={{ 
            backgroundImage: "url('/images/profile.jpg')",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "700px",
            backgroundColor: "#f3f4f6"
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-none pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent"></div>
        </div>

        {/* Content Container - positioned over background */}
        <div className="bg-white border rounded-2xl max-w-6xl mx-auto px-4 mb-8" style={{ position: "relative", marginTop: "-600px" }}>
          {/* Header Card */}
          <div className="bg-white p-8">
            <h1 className="text-4xl font-bold text-gray-900">Donasi Saya</h1>
            <p className="text-gray-600 mt-2">Riwayat dan detail donasi Anda</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-6">
            <div className="bg-white rounded-xl border shadow-xs p-6">
              <p className="text-sm font-medium text-gray-600">Total Donasi</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                Rp {totalDonated.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white rounded-xl border shadow-xs p-6">
              <p className="text-sm font-medium text-gray-600">Jumlah Donasi</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{donations.length}</p>
            </div>
            <div className="bg-white rounded-xl border shadow-xs p-6">
              <p className="text-sm font-medium text-gray-600">Rata-rata Donasi</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                Rp {donations.length > 0 ? Math.round(totalDonated / donations.length).toLocaleString("id-ID") : 0}
              </p>
            </div>
          </div>

          {/* Donations List */}
          <div className="bg-white rounded-2xl shadow-xs px-6 pb-6 pt-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Donasi</h2>

            {donations.length > 0 ? (
              <>
                {/* Search and Filter Section */}
                <div className="mb-6 space-y-4">

                  {/* Date, Month, Year Filters */}
                  <div className="grid grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cari Nama Aksi</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ketik nama aksi..."
                      className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                   </div>

                    {/* Filter by Month */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filter Bulan</label>
                      <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="w-full px-4 py-2 cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white"
                      >
                        <option value="">Semua Bulan</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                            {new Date(2024, i).toLocaleString("id-ID", { month: "long" })}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filter by Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filter Tahun</label>
                      <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white"
                      >
                        <option value="">Semua Tahun</option>
                        {Array.from({ length: 5 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <option key={year} value={year.toString()}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  {(searchQuery || filterDate || filterMonth || filterYear) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilterDate("");
                        setFilterMonth("");
                        setFilterYear("");
                      }}
                      className="w-full bg-white border text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
                    >
                      Bersihkan Filter
                    </button>
                  )}
                </div>

                {/* Donations Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Aksi</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Jumlah</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Tanggal</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Jenis</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonations.length > 0 ? (
                        filteredDonations.map((donation, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          {donation.aksiJudul || donation.aksi || "Donasi Umum"}
                        </td>
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          Rp {parseInt(donation.jumlahDonasi || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(donation.createdAt).toLocaleDateString("id-ID", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {donation.tipeDonasi || "Berhasil"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => navigate(`/aksi/${donation.aksiId}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition"
                          >
                            Lihat Aksi →
                          </button>
                        </td>
                      </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 px-4 text-center text-gray-500">
                            Tidak ada donasi yang sesuai dengan filter
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">Belum ada riwayat donasi</p>
                <button
                  onClick={() => navigate("/aksi-berjalan")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Mulai Donasi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DonasiSaya;
