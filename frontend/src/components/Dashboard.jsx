import React, { useEffect, useMemo, useState } from "react";
import { getDashboardSummary } from "../api";

const formatNumber = (value) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value || 0);

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const Dashboard = ({ user, onLogout }) => {
  const [summary, setSummary] = useState({
    totalDonors: 0,
    totalGoods: 0,
    totalServices: 0,
    totalMoney: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await getDashboardSummary();
        setSummary({
          totalDonors: data.totalDonors ?? 0,
          totalGoods: data.totalGoods ?? 0,
          totalServices: data.totalServices ?? 0,
          totalMoney: data.totalMoney ?? 0,
        });
        setError("");
      } catch (err) {
        console.error("Gagal memuat ringkasan dashboard:", err);
        setError(err.message || "Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const metrics = useMemo(
    () => [
      { label: "Donatur Aktif", value: `${formatNumber(summary.totalDonors)}+`, icon: "😊" },
      { label: "Barang Terkumpul", value: `${formatNumber(summary.totalGoods)}+`, icon: "📦" },
      { label: "Jasa & Skill Dibagikan", value: `${formatNumber(summary.totalServices)}+`, icon: "🛠️" },
      { label: "Donasi Tersalurkan", value: formatCurrency(summary.totalMoney), icon: "💙" },
    ],
    [summary]
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black font-inter">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white shadow-md border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2 text-lg font-bold text-gray-800">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              RB
            </span>
            <span>RuangBerbagi</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
            <a href="#aksi" className="hover:text-blue-600 transition-colors">Aksi Berjalan</a>
            <a href="#relawan" className="hover:text-blue-600 transition-colors">Relawan</a>
            <a href="#tentang" className="hover:text-blue-600 transition-colors">Tentang Kami</a>
          </div>
          <div>
            {user ? (
              <button
                onClick={onLogout}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Keluar
              </button>
            ) : (
              <a
                href="#login"
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                Masuk
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-gradient-to-r from-white via-blue-50 to-blue-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Bikin Dampak Nyata, <br />
            <span className="text-blue-700">Mulai dari Hal Sederhana ✨</span>
          </h1>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            Bareng RuangBerbagi, kamu bisa bantu sesama lewat donasi uang, barang,
            atau bahkan skill yang kamu punya. Satu klik kecil, dampak sosial besar!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Mulai dari Sini
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition">
              Lihat Cara Kerja
            </button>
          </div>
        </div>
      </section>

      {/* Statistik Section */}
      <section className="py-16 bg-white text-center text-gray-800">
        <h2 className="text-2xl font-bold text-gray-900">
          Kebaikan yang Terus Tumbuh 🌱
        </h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          Kami percaya setiap aksi kecil bisa membawa perubahan besar. Yuk, lihat
          sejauh mana kebaikan ini sudah berjalan bareng kamu semua!
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-4xl mb-2">{item.icon}</p>
              <p className="text-3xl font-bold text-blue-600">{item.value}</p>
              <p className="text-gray-700 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {loading && <p className="mt-8 text-gray-500">Memuat data...</p>}
        {error && <p className="mt-8 text-red-500">{error}</p>}
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600 border-t">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-600">RuangBerbagi</span> — Semua hak dilindungi.
      </footer>
    </div>
  );
};

export default Dashboard;
