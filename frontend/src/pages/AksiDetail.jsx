import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getDonations } from "../api";
import ShareModal from "../components/ShareModal";
import TransparansiDonasi from "../components/TransparansiDonasi";
import { Share2, ArrowLeft } from "lucide-react";

const AksiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aksi, setAksi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentDonors, setRecentDonors] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTransparansi, setShowTransparansi] = useState(false);
  const [isOwnAksi, setIsOwnAksi] = useState(false);

  const handleDonateClick = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("userToken") || localStorage.getItem("isLoggedIn");
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // Check if this is user's own aksi
    if (isOwnAksi) {
      alert("Anda tidak dapat berdonasi untuk aksi yang Anda buat sendiri.");
      return;
    }

    // Check status aksi
    if (aksi.status === "ditutup") {
      alert("Maaf, donasi untuk aksi ini sudah ditutup.");
      return;
    }
    if (aksi.status === "selesai") {
      alert("Donasi untuk aksi ini sudah selesai.");
      return;
    }

    // Navigate to donation page with aksi id
    navigate(`/donasi/${id}`);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  useEffect(() => {
    const fetchAksiDetail = async () => {
      try {
        setLoading(true);

        // Get user email for ownership check
        const userEmail = localStorage.getItem("userEmail");

        // Get from localStorage first
        const localAksi = JSON.parse(localStorage.getItem("aksiList") || "[]");
        const aksiFromLocal = localAksi.find((d) => d.id === parseInt(id));

        // Then try to get from API
        let aksiFromAPI = null;
        try {
          const data = await getDonations();
          aksiFromAPI = data?.find((d) => d.id === parseInt(id));
        } catch (err) {
          console.warn("Could not fetch from API:", err);
        }

        // Use localStorage data if available, otherwise API data
        const aksiData = aksiFromLocal || aksiFromAPI;

        if (aksiData) {
          setAksi(aksiData);
          
          // Check if this is user's own aksi
          if (userEmail && aksiData.createdByEmail === userEmail) {
            setIsOwnAksi(true);
          }

          // Ambil donatur terbaru dari localStorage
          const donations = JSON.parse(localStorage.getItem("donations") || "[]");
          const recent = donations
            .filter(d => d.aksiId === aksiData.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(d => ({
              name: d.namaLengkap || d.email || "Donatur",
              amount: d.tipeDonasi === "Uang"
                ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(parseInt(d.jumlahDonasi))
                : d.tipeDonasi === "Barang"
                  ? `${d.selectedBarang?.length || 0} Barang`
                  : d.tipeDonasi === "Jasa"
                    ? `${d.selectedJasa?.length || 0} Jasa`
                    : "-",
              date: new Date(d.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
            }));
          setRecentDonors(recent);
          setError("");
        } else {
          setError("Aksi tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal memuat detail aksi:", err);
        setError(err.message || "Gagal memuat data aksi");
      } finally {
        setLoading(false);
      }
    };

    fetchAksiDetail();
  }, [id]);

  if (loading) return <div className="pt-20 text-center text-gray-500">Memuat detail aksi...</div>;
  if (error) return <div className="pt-20 text-center text-red-500">{error}</div>;
  if (!aksi) return <div className="pt-20 text-center text-gray-500">Aksi tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Navbar />

      <div className="pt-0">
        {/* Hero Image */}
        <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-8xl relative">
          {aksi.image ? (
            <>
              <img src={aksi.image} alt={aksi.judul} className="w-full h-full object-cover" />
              {/* Gradient Overlay: hitam di atas, transparan di bawah */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent"></div>
            </>
          ) : (
            "🤝"
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Tombol Kembali */}
          <button
            onClick={() => navigate("/aksi-berjalan#list-aksi")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Kembali</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (3/4) - Content */}
            <div className="lg:col-span-2">
              {/* Category Badges - Multiple dengan warna berbeda */}
              {(() => {
                const tipe = aksi.tipe || aksi.category || "Umum";
                const kategoriRaw = aksi.kategori || tipe || "Umum";
                const kategoriArray = Array.isArray(kategoriRaw) 
                  ? kategoriRaw 
                  : (typeof kategoriRaw === 'string' ? kategoriRaw.split(',').map(k => k.trim()) : [String(kategoriRaw)]);

                const getBadgeColor = (type) => {
                  const normalizedType = type.toLowerCase();
                  if (normalizedType.includes('uang')) return 'bg-green-50 text-green-700 border border-green-700';
                  if (normalizedType.includes('barang')) return 'bg-blue-50 text-blue-700 border border-blue-700';
                  if (normalizedType.includes('jasa')) return 'bg-purple-50 text-purple-700 border border-purple-700';
                  return 'bg-gray-100 text-gray-700';
                };

                return (
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
                );
              })()}

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{aksi.judul || aksi.title}</h1>

              {/* Content (News Format) */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {aksi.deskripsi || aksi.description}
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tentang Aksi Ini</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Aksi sosial ini adalah bagian dari komitmen kami untuk memberikan dampak nyata
                  bagi masyarakat yang membutuhkan. Dengan dukungan dari berbagai pihak, kami
                  berusaha menciptakan perubahan positif di komunitas.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Bagaimana Caranya?</h2>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Pilih bentuk donasi (uang, barang, atau jasa)</li>
                  <li>Isi data diri dan detail donasi Anda</li>
                  <li>Selesaikan proses dan bagikan aksi ini</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dampak Nyata</h2>
                <p className="text-gray-700 leading-relaxed">
                  Setiap kontribusi Anda akan langsung berdampak pada kehidupan penerima bantuan.
                  Kami memastikan transparansi penuh dalam setiap proses sehingga Anda bisa melihat
                  hasil dari kebaikan yang Anda berikan.
                </p>
              </div>
            </div>

            {/* Right Column (1/4) - Donation Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border p-6 sticky top-24">
                {/* Target & Progress - Only if Uang kategori */}
                {(aksi.kategori?.includes("Uang") || aksi.tipe?.includes("Uang")) && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">Dana Terkumpul</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(aksi.donasiTerkumpul || 0)}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Target: {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(aksi.targetDonasi || 0)}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(((aksi.donasiTerkumpul || 0) / (aksi.targetDonasi || 1)) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {Math.min(((aksi.donasiTerkumpul || 0) / (aksi.targetDonasi || 1)) * 100, 100).toFixed(1)}% tercapai
                    </p>
                  </div>
                )}

                {/* Barang Dibutuhkan - Only if Barang kategori */}
                {aksi.barangDibutuhkan && (aksi.kategori?.includes("Barang") || aksi.tipe?.includes("Barang")) && (
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-bold text-gray-900 mb-3">Barang Dibutuhkan</h3>
                    <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
                      {(typeof aksi.barangDibutuhkan === 'string' 
                        ? aksi.barangDibutuhkan.split(", ")
                        : aksi.barangDibutuhkan
                      ).filter(b => b.trim()).map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="border border-gray-400 rounded-full py-1.5 px-4">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Jasa Dibutuhkan - Only if Jasa kategori */}
                {aksi.jasaDibutuhkan && (aksi.kategori?.includes("Jasa") || aksi.tipe?.includes("Jasa")) && (
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-bold text-gray-900 mb-3">Jasa Dibutuhkan</h3>
                    <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
                      {(typeof aksi.jasaDibutuhkan === 'string' 
                        ? aksi.jasaDibutuhkan.split(", ")
                        : aksi.jasaDibutuhkan
                      ).filter(j => j.trim()).map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="border border-gray-400 rounded-full py-1.5 px-4">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  {/* Tombol Donasi - Dinamis berdasarkan status */}
                  {aksi.status === "selesai" ? (
                    <button 
                      disabled
                      className="w-full bg-green-600 text-white py-2 rounded-full font-medium cursor-not-allowed opacity-90"
                    >
                      Donasi Selesai
                    </button>
                  ) : aksi.status === "ditutup" ? (
                    <button 
                      disabled
                      className="w-full bg-red-600 text-white py-2 rounded-full font-medium cursor-not-allowed opacity-90"
                    >
                      Donasi Ditutup
                    </button>
                  ) : isOwnAksi ? (
                    <button 
                      disabled
                      className="w-full bg-gray-400 text-white py-2 rounded-full font-medium cursor-not-allowed"
                      title="Anda tidak dapat berdonasi untuk aksi sendiri"
                    >
                      Aksi Milik Anda
                    </button>
                  ) : (
                    <button 
                      onClick={handleDonateClick}
                      className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition font-medium"
                    >
                      Ikut Berdonasi
                    </button>
                  )}
                  <div className="grid grid-cols-8 gap-3">
                    <button 
                      onClick={() => setShowTransparansi(true)}
                      className="w-full bg-white text-black py-2 rounded-full hover:bg-gray-50 border border-black transition font-medium col-span-7"
                    >
                      Progress Donasi
                    </button>
                    <button 
                      onClick={handleShareClick}
                      className="w-full flex text-blue-600 py-2 rounded-full hover:text-blue-700 transition font-medium"
                    >
                      <Share2 />
                    </button>
                  </div>
                </div>

                {/* Recent Donors */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Donatur Terbaru</h3>
                  <div className="space-y-3">
                    {recentDonors.map((donor, idx) => (
                      <div key={idx} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {donor.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{donor.name}</p>
                          <p className="text-xs text-gray-600">{donor.amount}</p>
                          <p className="text-xs text-gray-500">{donor.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Login Diperlukan</h3>
            <p className="text-gray-600 mb-6">
              Anda harus login terlebih dahulu untuk melakukan donasi.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Login Sekarang
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}

      {/* Transparansi Donasi Modal */}
      {showTransparansi && aksi && (
        <TransparansiDonasi 
          isOpen={showTransparansi} 
          onClose={() => setShowTransparansi(false)} 
          aksiId={aksi.id} 
        />
      )}
    </div>
  );
};

export default AksiDetail;
