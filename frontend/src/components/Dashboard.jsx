// src/pages/Dashboard.jsx
import React from "react";

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-5 px-8 flex justify-between items-center shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">Ruang Berbagi</h1>
        <div className="flex items-center space-x-6">
          <span className="text-base">
            Halo, <strong className="text-blue-100">{user?.nama || user?.email || "Pengguna"}</strong>
          </span>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-xl p-6 space-y-6">
          <nav className="flex flex-col space-y-2">
            <a
              href="#"
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 py-3 px-4 rounded-lg transition-all duration-200 flex items-center space-x-3 font-medium"
            >
              <span className="text-xl">🏠</span>
              <span>Beranda</span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 py-3 px-4 rounded-lg transition-all duration-200 flex items-center space-x-3 font-medium"
            >
              <span className="text-xl">💰</span>
              <span>Donasi</span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 py-3 px-4 rounded-lg transition-all duration-200 flex items-center space-x-3 font-medium"
            >
              <span className="text-xl">🎁</span>
              <span>Penerima Bantuan</span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 py-3 px-4 rounded-lg transition-all duration-200 flex items-center space-x-3 font-medium"
            >
              <span className="text-xl">📊</span>
              <span>Laporan</span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:bg-blue-100 py-2 px-3 rounded-md"
            >
              👤 Profil Saya
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Dashboard Utama
          </h2>
          <p className="text-gray-600 mb-6">
            Selamat datang di sistem <strong>Ruang Berbagi</strong>.  
            Di sini kamu dapat melihat data donasi, penerima bantuan, dan laporan kegiatan.
          </p>

          {/* Contoh Konten Ringkasan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-200 hover:scale-105">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-700 font-semibold text-lg">Total Donasi</h3>
                <span className="text-blue-500 bg-blue-100 p-3 rounded-full">💰</span>
              </div>
              <p className="text-4xl font-bold text-blue-600 mt-4">Rp 12.450.000</p>
              <p className="text-sm text-gray-500 mt-2">Total donasi terkumpul</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-200 hover:scale-105">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-700 font-semibold text-lg">Jumlah Donatur</h3>
                <span className="text-green-500 bg-green-100 p-3 rounded-full">👥</span>
              </div>
              <p className="text-4xl font-bold text-green-600 mt-4">27</p>
              <p className="text-sm text-gray-500 mt-2">Donatur aktif</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-200 hover:scale-105">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-700 font-semibold text-lg">Penerima Bantuan</h3>
                <span className="text-purple-500 bg-purple-100 p-3 rounded-full">🎁</span>
              </div>
              <p className="text-4xl font-bold text-purple-600 mt-4">15</p>
              <p className="text-sm text-gray-500 mt-2">Telah menerima bantuan</p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-4 shadow-inner text-gray-500 text-sm">
        © 2025 Ruang Berbagi — Semua hak dilindungi.
      </footer>
    </div>
  );
};

export default Dashboard;
