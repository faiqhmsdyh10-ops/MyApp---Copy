import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAksi: 0,
    aksiAktif: 0,
    totalRelawan: 0,
    totalDonasi: 0,
  });
  const [allActivities, setAllActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("semua");

  useEffect(() => {
    // Load stats from localStorage
    const aksiList = JSON.parse(localStorage.getItem("aksiList") || "[]");
    const relawanList = JSON.parse(localStorage.getItem("relawanList") || "[]");
    
    setStats({
      totalAksi: aksiList.length,
      aksiAktif: aksiList.filter(a => a.status === "aktif").length,
      totalRelawan: relawanList.length,
      totalDonasi: aksiList.reduce((sum, a) => sum + (a.donasiTerkumpul || 0), 0),
    });

    // Load recent activities from various sources
    loadRecentActivities();
  }, []);

  const loadRecentActivities = () => {
    const activities = [];

    // 1. Donasi terbaru
    const donations = JSON.parse(localStorage.getItem("donations") || "[]");
    donations.forEach(d => {
      const tipeDonasi = d.tipeDonasi || "Donasi";
      let description = "";
      if (tipeDonasi === "Uang") {
        const amount = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(d.jumlahDonasi || 0);
        description = `berdonasi ${amount}`;
      } else if (tipeDonasi === "Barang") {
        description = `mendonasikan barang`;
      } else if (tipeDonasi === "Jasa") {
        description = `mengajukan jasa/relawan`;
      }
      
      activities.push({
        id: `donation-${d.id}`,
        type: "donation",
        icon: tipeDonasi === "Uang" ? "💰" : tipeDonasi === "Barang" ? "📦" : "🤝",
        iconBg: tipeDonasi === "Uang" ? "bg-green-100 text-green-600" : tipeDonasi === "Barang" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600",
        title: `${d.namaLengkap || d.email || "Seseorang"} ${description}`,
        subtitle: `untuk aksi "${d.aksiJudul || "Aksi"}"`,
        timestamp: d.createdAt,
      });
    });

    // 2. Aksi baru dibuat (dari aksiList)
    const aksiList = JSON.parse(localStorage.getItem("aksiList") || "[]");
    aksiList.forEach(a => {
      activities.push({
        id: `aksi-${a.id}`,
        type: "aksi",
        icon: "📋",
        iconBg: "bg-blue-100 text-blue-600",
        title: `Aksi "${a.judul}" telah aktif`,
        subtitle: `Dibuat oleh ${a.createdBy || "Admin"}`,
        timestamp: a.createdAt,
      });
    });

    // 3. Pengajuan galang dana (pending)
    const pengajuanAksi = JSON.parse(localStorage.getItem("pengajuanAksiList") || "[]");
    pengajuanAksi.forEach(p => {
      let statusText = "menunggu persetujuan";
      let icon = "⏳";
      let iconBg = "bg-yellow-100 text-yellow-600";
      
      if (p.status === "approved") {
        statusText = "telah disetujui";
        icon = "✅";
        iconBg = "bg-green-100 text-green-600";
      } else if (p.status === "rejected") {
        statusText = "telah ditolak";
        icon = "❌";
        iconBg = "bg-red-100 text-red-600";
      }

      activities.push({
        id: `pengajuan-aksi-${p.id}`,
        type: "pengajuan_aksi",
        icon: icon,
        iconBg: iconBg,
        title: `Pengajuan galang dana "${p.judul}"`,
        subtitle: `oleh ${p.createdBy || p.createdByEmail || "User"} - ${statusText}`,
        timestamp: p.createdAt,
      });
    });

    // 4. Pengajuan jasa/relawan
    const pengajuanJasa = JSON.parse(localStorage.getItem("pengajuanJasaList") || "[]");
    pengajuanJasa.forEach(p => {
      activities.push({
        id: `pengajuan-jasa-${p.id}`,
        type: "pengajuan_jasa",
        icon: "🙋",
        iconBg: "bg-purple-100 text-purple-600",
        title: `${p.nama || p.email || "Seseorang"} mengajukan diri sebagai relawan`,
        subtitle: `Keahlian: ${p.deskripsi || "-"}`,
        timestamp: p.tanggalPengajuan ? new Date(p.tanggalPengajuan.split("/").reverse().join("-")).toISOString() : new Date().toISOString(),
      });
    });

    // 5. Relawan terdaftar
    const relawanList = JSON.parse(localStorage.getItem("relawanList") || "[]");
    relawanList.forEach(r => {
      if (r.dariPengajuanJasa) {
        activities.push({
          id: `relawan-${r.id}`,
          type: "relawan",
          icon: "👤",
          iconBg: "bg-indigo-100 text-indigo-600",
          title: `${r.nama} bergabung sebagai relawan`,
          subtitle: `Keahlian: ${r.keahlian || "-"}`,
          timestamp: r.tanggalDibuatRelawan ? new Date(r.tanggalDibuatRelawan.split("/").reverse().join("-")).toISOString() : new Date().toISOString(),
        });
      }
    });

    // 6. Donasi barang
    const donasiBarang = JSON.parse(localStorage.getItem("donasiBarangList") || "[]");
    donasiBarang.forEach(b => {
      activities.push({
        id: `barang-${b.id}`,
        type: "donasi_barang",
        icon: "📦",
        iconBg: b.status === "diterima" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600",
        title: `Donasi barang dari ${b.namaPendonasi || "Seseorang"}`,
        subtitle: `${b.jenisBarang || b.deskripsiBarang} - ${b.status === "diterima" ? "Sudah diterima" : "Belum diterima"}`,
        timestamp: b.tanggalDikirim ? new Date(b.tanggalDikirim.split("/").reverse().join("-")).toISOString() : new Date().toISOString(),
      });
    });

    // Sort by timestamp (newest first)
    activities.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0);
      const dateB = new Date(b.timestamp || 0);
      return dateB - dateA;
    });

    setAllActivities(activities);
  };

  // Filter activities based on search and date filter
  useEffect(() => {
    let result = [...allActivities];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.subtitle.toLowerCase().includes(query)
      );
    }

    // Filter by date
    const now = new Date();
    if (dateFilter === "hari-ini") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      result = result.filter(a => new Date(a.timestamp) >= today);
    } else if (dateFilter === "7-hari") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(a => new Date(a.timestamp) >= sevenDaysAgo);
    } else if (dateFilter === "30-hari") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter(a => new Date(a.timestamp) >= thirtyDaysAgo);
    }

    setFilteredActivities(result);
  }, [allActivities, searchQuery, dateFilter]);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Baru saja";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 0) return "Baru saja";
    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const statCards = [
    { label: "Total Aksi", value: stats.totalAksi, icon: "📋", color: "bg-blue-500" },
    { label: "Aksi Aktif", value: stats.aksiAktif, icon: "✅", color: "bg-green-500" },
    { label: "Total Relawan", value: stats.totalRelawan, icon: "👥", color: "bg-purple-500" },
    { label: "Total Donasi", value: `Rp ${stats.totalDonasi.toLocaleString("id-ID")}`, icon: "💰", color: "bg-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold text-gray-900">Aktivitas Terbaru</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-4 transform -translate-y-1 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari aktivitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-96 text-black bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-48"
              />
            </div>
            
            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 text-black border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="semua">Semua Waktu</option>
              <option value="hari-ini">Hari Ini</option>
              <option value="7-hari">7 Hari Terakhir</option>
              <option value="30-hari">30 Hari Terakhir</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto hide-scrollbar">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-4xl mb-2">📭</p>
              <p>{searchQuery || dateFilter !== "semua" ? "Tidak ada aktivitas yang sesuai filter" : "Belum ada aktivitas"}</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="flex border items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xl ${activity.iconBg}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.subtitle}</p>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results count */}
        {filteredActivities.length > 0 && (
          <div className="mt-4 pt-3 border-t text-xs text-gray-500 text-center">
            Menampilkan {filteredActivities.length} dari {allActivities.length} aktivitas
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
