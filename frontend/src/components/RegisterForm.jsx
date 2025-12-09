import React, { useEffect, useState } from "react";
import { registerUser } from "../api";

const RegisterForm = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState(1); // Step 1 atau Step 2
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nama_panggilan: "",
    email: "",
    no_hp: "",
    jenis_kelamin: "",
    negara: "",
    alamat: "",
    password: "",
    konfirmasi_password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=80",
      title: "Kebaikan yang Terus Tumbuh",
      subtitle: "Setiap kontribusi kamu bantu ribuan penerima bantuan di seluruh Indonesia."
    },
    {
      image:
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=80",
      title: "Donasi Barang, Dana, atau Skill",
      subtitle:
        "Bagikan barang layak pakai, donasi dana, atau kemampuanmu untuk aksi sosial yang tepat sasaran."
    },
    {
      image:
        "https://images.unsplash.com/photo-1496180727794-817822f65950?auto=format&fit=crop&w=1600&q=80",
      title: "Transparan & Berdampak",
      subtitle:
        "Semua donasi tersalurkan secara transparan. Lihat langsung progres dan laporan setiap aksi."
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  // Validasi Step 1
  const validateStep1 = () => {
    if (!formData.nama_lengkap.trim()) {
      setError("Nama lengkap wajib diisi");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email wajib diisi");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }
    if (!formData.no_hp.trim()) {
      setError("Nomor HP wajib diisi");
      return false;
    }
    if (!formData.password) {
      setError("Password wajib diisi");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }
    if (formData.password !== formData.konfirmasi_password) {
      setError("Password dan konfirmasi password tidak cocok");
      return false;
    }
    return true;
  };

  // Validasi Step 2
  const validateStep2 = () => {
    if (!formData.jenis_kelamin) {
      setError("Jenis kelamin wajib dipilih");
      return false;
    }
    if (!formData.negara.trim()) {
      setError("Negara wajib diisi");
      return false;
    }
    if (!formData.alamat.trim()) {
      setError("Alamat wajib diisi");
      return false;
    }
    return true;
  };

  // Handle Next (Step 1 -> Step 2)
  const handleNext = () => {
    if (validateStep1()) {
      setError("");
      setStep(2);
    }
  };

  // Handle Back (Step 2 -> Step 1)
  const handleBack = () => {
    setError("");
    setStep(1);
  };

  // Handle Submit (Step 2)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await registerUser({
        nama_lengkap: formData.nama_lengkap,
        nama_panggilan: formData.nama_panggilan,
        email: formData.email,
        no_hp: formData.no_hp,
        jenis_kelamin: formData.jenis_kelamin,
        negara: formData.negara,
        alamat: formData.alamat,
        password: formData.password
      });

      // Save to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userToken", response.token || "dummy-token");

      const profileKey = `userProfile_${formData.email}`;
      const userData = {
        email: formData.email,
        nama_lengkap: formData.nama_lengkap,
        nama_panggilan: formData.nama_panggilan,
        no_hp: formData.no_hp,
        jenis_kelamin: formData.jenis_kelamin,
        negara: formData.negara,
        alamat: formData.alamat
      };

      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem(profileKey, JSON.stringify(userData));

      onRegisterSuccess();
    } catch (err) {
      setError(err.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex font-inter">
      {/* Left visual panel - Carousel */}
      <div className="hidden lg:flex w-3/5 rounded-r-full bg-none relative overflow-hidden">
        <img
          src={slides[activeSlide].image}
          alt={slides[activeSlide].title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Carousel text overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-transparent flex flex-col">
          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full h-full">
            <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-none border-2 border-blue-600 px-4 py-1.5 text-sm font-medium backdrop-blur-2xl">
                <span className="text-base"></span> RuangBerbagi
              </div>
              <h2 className="mt-6 text-4xl font-bold leading-tight drop-shadow-sm">{slides[activeSlide].title}</h2>
              <p className="mt-4 text-lg text-white/80 max-w-lg">{slides[activeSlide].subtitle}</p>
            </div>
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  😊
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-white/60">Donatur Aktif</p>
                  <p className="text-2xl font-semibold">2.550+</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      idx === activeSlide ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
                    }`}
                    onClick={() => setActiveSlide(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-2/5 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Akun</h1>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              ❌ {error}
            </div>
          )}

          {step === 1 ? (
            // STEP 1: Nama Lengkap, No HP, Email, Password, Konfirmasi Password
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-2 bg-white text-black rounded-2xl border p-8">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="w-full bg-white text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-white text-sm"
                />
              </div>

              {/* Nomor HP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor HP *
                </label>
                <input
                  type="tel"
                  name="no_hp"
                  value={formData.no_hp}
                  onChange={handleChange}
                  placeholder="Contoh: 08123456789"
                  className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan email"
                  className="w-full bg-white text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password * (Min. 6 karakter)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password *
                </label>
                <input
                  type="password"
                  name="konfirmasi_password"
                  value={formData.konfirmasi_password}
                  onChange={handleChange}
                  placeholder="Ketik ulang password"
                  className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Next Button */}
              <div className="flex gap-3 mt-0 w-full justify-end">
                <button
                  type="submit"
                  className="px-4 bg-blue-600 border-2 border-blue-600 hover:bg-blue-700 hover:text-white text-white font-medium py-2 rounded-full transition duration-200"
                >
                  Selanjutnya
                </button>
              </div>
            </form>
          ) : (
            // STEP 2: Nama Panggilan, Jenis Kelamin, Negara, Alamat
            <form onSubmit={handleSubmit} className="space-y-2 bg-white p-8 border rounded-2xl">
              {/* Nama Panggilan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Panggilan (Opsional)
                </label>
                <input
                  type="text"
                  name="nama_panggilan"
                  value={formData.nama_panggilan}
                  onChange={handleChange}
                  placeholder="Nama panggilan"
                  className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Jenis Kelamin - Radio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Jenis Kelamin *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jenis_kelamin"
                      value="Laki-laki"
                      checked={formData.jenis_kelamin === "Laki-laki"}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-gray-700">Laki-laki</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jenis_kelamin"
                      value="Perempuan"
                      checked={formData.jenis_kelamin === "Perempuan"}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-gray-700">Perempuan</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jenis_kelamin"
                      value="Lainnya"
                      checked={formData.jenis_kelamin === "Lainnya"}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-gray-700">Lainnya</span>
                  </label>
                </div>
              </div>

              {/* Negara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Negara *
                </label>
                <input
                  type="text"
                  name="negara"
                  value={formData.negara}
                  onChange={handleChange}
                  placeholder="Contoh: Indonesia"
                  className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat *
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap"
                  rows="2"
                  className="w-full bg-white text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-full hover:bg-gray-100 transition duration-200"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-full transition duration-200"
                >
                  {loading ? "Mendaftar..." : "Daftar"}
                </button>
              </div>
            </form>
          )}

          {/* Switch to Login */}
          <p className="text-center mt-6 text-gray-600 text-sm">
            Sudah punya akun?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 font-semibold hover:underline"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
