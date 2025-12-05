import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getDashboardSummary } from "../api";

const formatNumber = (value) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value || 0);

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const Home = () => {
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
      <Navbar />

      {/* Hero Section */}
      <section className="pt-56 pb-20 relative bg-cover bg-center h-[100vh]" style={{ backgroundImage: "url('/images/hero.jpg')" }}>
        <div className="max-w-6xl mx-auto text-left ml-24">
          <h1 className="text-6xl font-bold text-white">
            Bikin Dampak Nyata, <br />
            Mulai dari Hal <span className="border-r-2 text-yellow-50 rounded-l-md px-1 border-yellow-500 bg-yellow-500/40">Sederhana</span>
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl">
            Bareng RuangBerbagi, kamu bisa bantu sesama lewat donasi uang, barang,
            atau bahkan skill yang kamu punya. Satu klik kecil, dampak sosial besar!
          </p>
          <div className="mt-8 flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">
              Mulai dari Sini
            </button>
            <button className="border bg-transparent border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">
              Lihat Cara Kerja
            </button>
          </div>
        </div>
      </section>

      {/* Statistik Section */}
      <section className="py-16 bg-white text-center text-gray-800">
        <h2 className="text-4xl font-bold text-gray-900">
          Kebaikan yang Terus Tumbuh.
        </h2>
        <p className="text-gray-600 mt-8 max-w-full mx-auto">
          Kami percaya setiap aksi kecil bisa membawa perubahan besar. Yuk, lihat
          sejauh mana kebaikan ini sudah berjalan bareng kamu semua!
        </p>

        <div className="mt-10 grid grid-cols-4 gap-6 max-w-full mx-24">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="bg-white p-6 rounded-2xl border-2 border-gray-300 hover:shadow-lg transition"
            >
              <p className="text-4xl mb-2">{item.icon}</p>
              <p className="text-3xl font-bold text-gray-400">{item.value}</p>
              <p className="text-gray-700 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {loading && <p className="mt-8 text-gray-500">Memuat data...</p>}
        {error && <p className="mt-8 text-red-500">{error}</p>}
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left - Illustration Placeholder */}
            <div 
              className="bg-gray-200 rounded-2xl h-80 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/section1.jpg')" }}
            >
              {/* Optional: Add overlay if needed */}
            </div>

            {/* Right - Benefits Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-4xl">📋</div>
                <h3 className="font-regular text-gray-900">Kamu gak perlu khawatir, platform kami 100% amanah dan dapat diandalkan!</h3>
              </div>
              <div className="space-y-3">
                <div className="text-4xl">💼</div>
                <h3 className="font-regular text-gray-900">Dukung kampanye sosial lewat QRIS, e-wallet, atau virtual account. Semudah beli kopi kekinian.</h3>
              </div>
              <div className="space-y-3">
                <div className="text-4xl">📦</div>
                <h3 className="font-regular text-gray-900">Punya barang layak pakai? Kirim ke drop point terdekat dan bantu yang membutuhkan.</h3>
              </div>
              <div className="space-y-3">
                <div className="text-4xl">⏰</div>
                <h3 className="font-regular text-gray-900">Bagi waktu dan skill kamu untuk bantu komunitas, dari mengajar sampai servis gratis.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berbagi Gak Harus Ribet Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Berbagi Gak Harus Ribet.</h2>
              <p className="text-gray-700 leading-relaxed">
                Kami bikin berdonasi senyaman cara orang online kasih ngasimu, transfer uang, ngasih barang, atau baru lewat keterlibanmu. RuangBerbagi nyediain semua cara biar kamu bisa berbagi lewat jalur yang aja aja.
              </p>
            </div>

            {/* Right - Illustration Placeholder */}
            <div 
              className="bg-gray-200 rounded-2xl h-80 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/section2.jpg')" }}
            >
              {/* Optional: Add overlay if needed */}
            </div>
          </div>
        </div>
      </section>

      {/* Setiap Kebaikan Ada Ceritanya Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left - Video Placeholder */}
            <div 
              className="bg-gray-200 rounded-2xl h-80 bg-cover bg-center relative overflow-hidden"
              style={{ backgroundImage: "url('/images/section3.jpg')" }}
            >
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition cursor-pointer">
                  <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right - Text */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Setiap Kebaikan Ada Ceritanya.</h2>
              <p className="text-gray-700 leading-relaxed">
                Di RuangBerbagi, kamu bukan cuma berdonasi, kamu ikut nulis cerita baru buat orang lain. Lihat gimana kontribusi kecilmu nyalain harapan buat banyak orang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Partner Logos */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Suara Mereka yang Udah Ikut Berbagi</h2>
            <div className="flex justify-center items-center gap-12 flex-wrap opacity-60">
              <div className="text-2xl font-bold text-gray-400">Gojek</div>
              <div className="text-2xl font-bold text-gray-400">Tokopedia</div>
              <div className="text-2xl font-bold text-gray-400">Traveloka</div>
              <div className="text-2xl font-bold text-gray-400">KitaBisa.com</div>
            </div>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6"></div>
              
              {/* Quote */}
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "Awalnya cuma mau bantu sedikit-sedikitlah, ah malah ketagihan. Ruang Berbagi biareseran bikin donasi itu gampang banget dan transparan!"
              </p>

              {/* Name & Role */}
              <p className="font-bold text-gray-900">Nadya</p>
              <p className="text-sm text-gray-600">Mahasiswa & Volunteer</p>
            </div>

            {/* Navigation Arrows */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

export default Home;
