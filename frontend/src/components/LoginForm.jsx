import React, { useEffect, useState } from "react";
import { loginUser } from "../api";

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      onLogin(response.user);
    } catch (err) {
      setError(err.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:flex">
      {/* Left visual panel */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-3/5 overflow-hidden">
        <img
          src={slides[activeSlide].image}
          alt={slides[activeSlide].title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-md">
              <span className="text-base">✨</span> RuangBerbagi
            </div>
            <h2 className="mt-6 text-4xl font-bold leading-tight drop-shadow-sm">
              {slides[activeSlide].title}
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-lg">{slides[activeSlide].subtitle}</p>
          </div>
          <div className="space-y-4">
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

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 xl:w-2/5 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-8 lg:px-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold shadow-lg">
                RB
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Selamat Datang Kembali</h2>
            <p className="mt-2 text-sm text-gray-600">Masuk ke akun RuangBerbagi Anda</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Masukkan password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : "transform hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <button
                  onClick={onSwitchToRegister}
                  disabled={loading}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                >
                  Daftar di sini
                </button>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500">
            Dengan masuk, Anda menyetujui{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Ketentuan Layanan
            </a>{" "}
            dan{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Kebijakan Privasi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
