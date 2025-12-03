import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAksi: 0,
    aksiAktif: 0,
    totalRelawan: 0,
    totalDonasi: 0,
  });

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
  }, []);

  const statCards = [
    { label: "Total Aksi", value: stats.totalAksi, icon: "📋", color: "bg-blue-500" },
    { label: "Aksi Aktif", value: stats.aksiAktif, icon: "✅", color: "bg-green-500" },
    { label: "Total Relawan", value: stats.totalRelawan, icon: "👥", color: "bg-purple-500" },
    { label: "Total Donasi", value: `Rp ${stats.totalDonasi.toLocaleString("id-ID")}`, icon: "💰", color: "bg-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Ringkasan sistem RuangBerbagi</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate("/admin/tambah-aksi")}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <span>➕</span>
            <span>Tambah Aksi Baru</span>
          </button>
          <button 
            onClick={() => navigate("/admin/kelola-aksi")}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <span>📋</span>
            <span>Kelola Aksi</span>
          </button>
          <button 
            onClick={() => navigate("/admin/laporan")}
            className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            <span>📈</span>
            <span>Lihat Laporan</span>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                {i}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Aktivitas sistem #{i}</p>
                <p className="text-xs text-gray-500">{i} jam yang lalu</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
