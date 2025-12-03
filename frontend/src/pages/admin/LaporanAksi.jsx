import React, { useState, useEffect } from "react";

const LaporanAksi = () => {
  const [filterPeriode, setFilterPeriode] = useState("7");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [showCustom, setShowCustom] = useState(false);
  const [summary, setSummary] = useState({
    totalDana: 0,
    totalBarang: 0,
    aksiSelesai: 0,
    totalAksi: 0,
  });
  const [aksiList, setAksiList] = useState([]);

  useEffect(() => {
    const fetchLaporan = () => {
      const allAksi = JSON.parse(localStorage.getItem("aksiList") || "[]");
      
      // Filter by date
      const now = new Date();
      let startDate = new Date();
      
      if (filterPeriode === "custom" && customRange.start && customRange.end) {
        startDate = new Date(customRange.start);
      } else {
        startDate.setDate(now.getDate() - parseInt(filterPeriode));
      }

      const filtered = allAksi.filter((aksi) => {
        const aksiDate = new Date(aksi.createdAt || aksi.lastUpdated);
        if (filterPeriode === "custom" && customRange.end) {
          return aksiDate >= startDate && aksiDate <= new Date(customRange.end);
        }
        return aksiDate >= startDate;
      });

      // Calculate summary
      const totalDana = filtered.reduce((sum, aksi) => sum + (aksi.donasiTerkumpul || 0), 0);
      const totalBarang = filtered.filter((aksi) => aksi.tipe === "Barang").length;
      const aksiSelesai = filtered.filter((aksi) => aksi.status === "selesai").length;

      setSummary({
        totalDana,
        totalBarang,
        aksiSelesai,
        totalAksi: filtered.length,
      });
      setAksiList(filtered);
    };

    fetchLaporan();
  }, [filterPeriode, customRange]);

  const handlePeriodeChange = (value) => {
    setFilterPeriode(value);
    if (value !== "custom") {
      setShowCustom(false);
      setCustomRange({ start: "", end: "" });
    } else {
      setShowCustom(true);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const exportData = () => {
    const csvContent = [
      ["Judul", "Kategori", "Target", "Terkumpul", "Status", "Tanggal"],
      ...aksiList.map((aksi) => [
        aksi.judul,
        aksi.tipe,
        aksi.targetDonasi || 0,
        aksi.donasiTerkumpul || 0,
        aksi.status,
        formatDate(aksi.createdAt),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-aksi-${new Date().getTime()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Laporan Aksi</h2>
          <p className="text-gray-600">Laporan lengkap aksi sosial berdasarkan periode waktu</p>
        </div>
        <button
          onClick={exportData}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Export CSV
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Periode Waktu
        </label>
        <select
          value={filterPeriode}
          onChange={(e) => handlePeriodeChange(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">7 Hari Terakhir</option>
          <option value="30">30 Hari Terakhir</option>
          <option value="90">3 Bulan Terakhir</option>
          <option value="365">1 Tahun Terakhir</option>
          <option value="custom">Custom Range</option>
        </select>

        {showCustom && (
          <div className="flex gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={customRange.start}
                onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tanggal Akhir</label>
              <input
                type="date"
                value={customRange.end}
                onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-sm font-medium mb-2">Total Dana Terkumpul</h3>
          <p className="text-3xl font-bold">{formatRupiah(summary.totalDana)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-sm font-medium mb-2">Aksi Barang</h3>
          <p className="text-3xl font-bold">{summary.totalBarang}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-sm font-medium mb-2">Aksi Selesai</h3>
          <p className="text-3xl font-bold">{summary.aksiSelesai}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-sm font-medium mb-2">Total Aksi</h3>
          <p className="text-3xl font-bold">{summary.totalAksi}</p>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Terkumpul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {aksiList.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data untuk periode yang dipilih
                </td>
              </tr>
            ) : (
              aksiList.map((aksi) => {
                const progress = aksi.targetDonasi
                  ? Math.min(((aksi.donasiTerkumpul || 0) / aksi.targetDonasi) * 100, 100)
                  : 0;
                return (
                  <tr key={aksi.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {aksi.judul}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{aksi.tipe}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatRupiah(aksi.targetDonasi || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatRupiah(aksi.donasiTerkumpul || 0)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {progress.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          aksi.status === "aktif"
                            ? "bg-green-100 text-green-800"
                            : aksi.status === "selesai"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {aksi.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(aksi.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanAksi;
