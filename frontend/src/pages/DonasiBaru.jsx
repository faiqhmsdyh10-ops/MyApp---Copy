import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FormUpdateTransparansi from "../components/FormUpdateTransparansi";
import { Edit2, Trash2, CheckCircle, Eye, X, FileText } from "lucide-react";

const DonasiBaru = () => {
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("donasi-saya");
  
  // Donasi Saya (Aksi user) state
  const [userAksis, setUserAksis] = useState([]);
  const [selectedAksiDetail, setSelectedAksiDetail] = useState(null);
  const [showAksiDetailModal, setShowAksiDetailModal] = useState(false);
  const [showEditAksiModal, setShowEditAksiModal] = useState(false);
  const [editingAksi, setEditingAksi] = useState(null);
  
  // Riwayat Donasi state
  const [donationHistory, setDonationHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Transparansi state
  const [showTransparansiForm, setShowTransparansiForm] = useState(false);
  const [selectedAksiId, setSelectedAksiId] = useState(null);
  
  // Form states untuk edit aksi
  const [editFormData, setEditFormData] = useState({
    judul: "",
    deskripsi: "",
    kategori: [],
    targetDonasi: "",
    image: null,
    imagePreview: "",
    barangDibutuhkan: [],
    jasaDibutuhkan: [],
  });
  
  const [barangInput, setBarangInput] = useState("");
  const [jasaInput, setJasaInput] = useState("");

  // Helper functions
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number || 0);
  };

  const getBadgeColor = (kategori) => {
    switch (kategori) {
      case "Uang":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Barang":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Jasa":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userToken") || localStorage.getItem("isLoggedIn");
    const userEmail = localStorage.getItem("userEmail");
    
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Load user's aksis (pengajuan yang sudah diapprove)
    const aksiList = JSON.parse(localStorage.getItem("aksiList") || "[]");
    
    // Filter aksi milik user yang sudah approved
    const userCreatedAksis = aksiList.filter(a => a.createdByEmail === userEmail && a.status === "aktif");
    setUserAksis(userCreatedAksis);

    // Load riwayat donasi user
    const donationList = JSON.parse(localStorage.getItem("donations") || "[]");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    
    // Filter donasi by user email atau nama
    const userDonations = donationList.filter(
      (d) => d.email === userEmail || d.namaLengkap === userData.nama_lengkap
    );
    
    // Sort by newest first
    userDonations.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    setDonationHistory(userDonations);
  }, [navigate]);

  // ============= DONASI SAYA (AKSI USER) FUNCTIONS =============
  const handleOpenAksiDetail = (aksi) => {
    setSelectedAksiDetail(aksi);
    setShowAksiDetailModal(true);
  };

  const handleOpenEditAksi = (aksi) => {
    setEditingAksi(aksi);
    setEditFormData({
      judul: aksi.judul,
      deskripsi: aksi.deskripsi,
      kategori: aksi.kategori || [],
      targetDonasi: aksi.targetDonasi ? aksi.targetDonasi.toString() : "",
      image: null,
      imagePreview: aksi.image,
      barangDibutuhkan: aksi.barangDibutuhkan ? aksi.barangDibutuhkan.split(", ") : [],
      jasaDibutuhkan: aksi.jasaDibutuhkan ? aksi.jasaDibutuhkan.split(", ") : [],
    });
    setShowEditAksiModal(true);
  };

  const handleEditAksiSubmit = () => {
    if (!editFormData.judul.trim()) {
      alert("Judul aksi harus diisi!");
      return;
    }
    if (!editFormData.deskripsi.trim()) {
      alert("Deskripsi harus diisi!");
      return;
    }
    if (editFormData.kategori.length === 0) {
      alert("Pilih minimal 1 kategori!");
      return;
    }

    const updatedAksis = userAksis.map(a => 
      a.id === editingAksi.id
        ? {
            ...a,
            judul: editFormData.judul,
            deskripsi: editFormData.deskripsi,
            kategori: editFormData.kategori,
            targetDonasi: editFormData.kategori.includes("Uang") ? parseInt(editFormData.targetDonasi) || 0 : 0,
            image: editFormData.imagePreview,
            barangDibutuhkan: editFormData.barangDibutuhkan.join(", "),
            jasaDibutuhkan: editFormData.jasaDibutuhkan.join(", "),
            lastUpdated: new Date().toISOString(),
          }
        : a
    );

    // Update in main aksiList
    const allAksis = JSON.parse(localStorage.getItem("aksiList") || "[]");
    const updatedAllAksis = allAksis.map(a =>
      a.id === editingAksi.id ? updatedAksis.find(ua => ua.id === a.id) : a
    );
    localStorage.setItem("aksiList", JSON.stringify(updatedAllAksis));
    
    setUserAksis(updatedAksis);
    setShowEditAksiModal(false);
    alert("Aksi berhasil diperbarui!");
  };

  const handleDeleteAksi = (aksiId) => {
    if (!window.confirm("Yakin ingin menghapus aksi ini?")) return;

    const updatedAksis = userAksis.filter(a => a.id !== aksiId);
    setUserAksis(updatedAksis);

    // Update in main aksiList
    const allAksis = JSON.parse(localStorage.getItem("aksiList") || "[]");
    const updatedAllAksis = allAksis.filter(a => a.id !== aksiId);
    localStorage.setItem("aksiList", JSON.stringify(updatedAllAksis));

    alert("Aksi berhasil dihapus!");
  };

  const handleCompleteAksi = (aksiId) => {
    if (!window.confirm("Tandai aksi ini sebagai selesai?")) return;

    const updatedAksis = userAksis.map(a =>
      a.id === aksiId ? { ...a, status: "selesai" } : a
    );
    setUserAksis(updatedAksis);

    // Update in main aksiList
    const allAksis = JSON.parse(localStorage.getItem("aksiList") || "[]");
    const updatedAllAksis = allAksis.map(a =>
      a.id === aksiId ? { ...a, status: "selesai" } : a
    );
    localStorage.setItem("aksiList", JSON.stringify(updatedAllAksis));

    alert("Aksi berhasil ditandai sebagai selesai!");
  };

  const handleAddBarang = (e) => {
    if (e.key === "Enter" && barangInput.trim()) {
      e.preventDefault();
      if (!editFormData.barangDibutuhkan.includes(barangInput.trim())) {
        setEditFormData(prev => ({
          ...prev,
          barangDibutuhkan: [...prev.barangDibutuhkan, barangInput.trim()],
        }));
      }
      setBarangInput("");
    }
  };

  const handleRemoveBarang = (item) => {
    setEditFormData(prev => ({
      ...prev,
      barangDibutuhkan: prev.barangDibutuhkan.filter((b) => b !== item),
    }));
  };

  const handleAddJasa = (e) => {
    if (e.key === "Enter" && jasaInput.trim()) {
      e.preventDefault();
      if (!editFormData.jasaDibutuhkan.includes(jasaInput.trim())) {
        setEditFormData(prev => ({
          ...prev,
          jasaDibutuhkan: [...prev.jasaDibutuhkan, jasaInput.trim()],
        }));
      }
      setJasaInput("");
    }
  };

  const handleRemoveJasa = (item) => {
    setEditFormData(prev => ({
      ...prev,
      jasaDibutuhkan: prev.jasaDibutuhkan.filter((j) => j !== item),
    }));
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB.");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          const maxWidth = 800;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setEditFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: compressedBase64,
          }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditKategoriChange = (kategori) => {
    const newKategori = editFormData.kategori.includes(kategori)
      ? editFormData.kategori.filter((k) => k !== kategori)
      : [...editFormData.kategori, kategori];
    setEditFormData(prev => ({ ...prev, kategori: newKategori }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-inter">
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
        <div className="max-w-6xl mx-auto px-4" style={{ position: "relative", marginTop: "-600px" }}>
          {/* Main Content Card */}
          <div className="bg-white rounded-2xl border overflow-hidden p-8">
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("donasi-saya")}
                className={`pb-3 font-semibold transition ${
                  activeTab === "donasi-saya"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Aksi Milik Saya
              </button>
              <button
                onClick={() => setActiveTab("riwayat-donasi")}
                className={`pb-3 font-semibold transition ${
                  activeTab === "riwayat-donasi"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Riwayat Donasi
              </button>
            </div>

            {/* TAB 1: DONASI SAYA (AKSI MILIK USER) */}
            {activeTab === "donasi-saya" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Aksi Galang Dana Saya</h2>
                  <button
                    onClick={() => navigate("/galang-dana")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    + Tambah Aksi Baru
                  </button>
                </div>

                {userAksis.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-4">Anda belum memiliki aksi galang dana</p>
                    <button
                      onClick={() => navigate("/galang-dana")}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Buat Aksi Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userAksis.map((aksi) => (
                      <div
                        key={aksi.id}
                        className="bg-white rounded-xl border overflow-hidden cursor-pointer transition hover:bg-gray-50"
                        onClick={() => handleOpenAksiDetail(aksi)}
                      >
                        <div className="p-6">
                          {/* Title Section */}
                          <div className="mb-4">
                            <div className="flex items-start gap-3 mb-2 min-h-[60px]">
                              <h3 className="text-md font-semibold text-gray-900 flex-1 line-clamp-2">{aksi.judul}</h3>
                            </div>
                            {/* Kategori & Status Badges */}
                            <div className="flex flex-wrap gap-1 justify-between">
                              <div className="flex flex-wrap gap-1">
                                {(aksi.kategori || aksi.tipe?.split(", ") || []).map((kat, idx) => (
                                  <span key={idx} className={`px-2 py-1 text-xs rounded-full ${getBadgeColor(kat)}`}>
                                    {kat}
                                  </span>
                                ))}
                              </div>
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                                  aksi.status === "aktif"
                                    ? "bg-green-50 text-green-600 border border-green-600"
                                    : aksi.status === "selesai"
                                    ? "bg-blue-50 text-blue-600 border border-blue-600"
                                    : "bg-red-50 text-red-600 border border-red-600"
                                }`}
                              >
                                {aksi.status === "aktif" ? "Aktif" : aksi.status === "selesai" ? "Selesai" : "Ditutup"}
                              </span>
                            </div>
                          </div>

                          {/* Image */}
                          {aksi.image && (
                            <img
                              src={aksi.image}
                              alt={aksi.judul}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                          )}

                          {/* Donasi Progress */}
                          {(aksi.kategori?.includes("Uang") || aksi.tipe?.includes("Uang")) && (
                            <div className="mb-4">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600">Terkumpul</span>
                                <span className="font-semibold text-gray-900">
                                  {formatRupiah(aksi.donasiTerkumpul)} / {formatRupiah(aksi.targetDonasi)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      ((aksi.donasiTerkumpul || 0) / (aksi.targetDonasi || 1)) * 100,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* TAB 2: RIWAYAT DONASI */}
          {activeTab === "riwayat-donasi" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Riwayat Donasi Saya</h2>

              {donationHistory.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">Anda belum melakukan donasi</p>
                  <button
                    onClick={() => navigate("/aksi-berjalan")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Lihat Aksi Berjalan
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aksi</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipe Donasi</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Jumlah/Detail</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {donationHistory
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((donation) => (
                        <tr key={donation.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{donation.aksiJudul || "Aksi"}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {donation.tipeDonasi || donation.donationType || "Uang"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {donation.tipeDonasi === "Uang" || donation.donationType === "Uang"
                              ? `Rp ${parseInt(donation.jumlahDonasi || 0).toLocaleString("id-ID")}`
                              : donation.selectedBarang?.join(", ") ||
                                donation.selectedJasa?.join(", ") ||
                                "Detail"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {donation.createdAt 
                              ? new Date(donation.createdAt).toLocaleDateString("id-ID")
                              : ""}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              Tercatat
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {donationHistory.length > itemsPerPage && (
                    <div className="bg-gray-50 border-t px-6 py-4 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, donationHistory.length)} dari {donationHistory.length} data
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            currentPage === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          ← Sebelumnya
                        </button>
                        
                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.ceil(donationHistory.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(donationHistory.length / itemsPerPage)))}
                          disabled={currentPage === Math.ceil(donationHistory.length / itemsPerPage)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            currentPage === Math.ceil(donationHistory.length / itemsPerPage)
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Selanjutnya →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Detail Aksi User */}
      {showAksiDetailModal && selectedAksiDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">Detail Aksi</h3>
              <button
                onClick={() => setShowAksiDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Judul */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Judul</h4>
                <p className="text-lg font-semibold text-gray-900">{selectedAksiDetail.judul}</p>
              </div>

              {/* Deskripsi */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Deskripsi</h4>
                <p className="text-gray-700 max-h-[10vh] whitespace-pre-wrap line-clamp-3">{selectedAksiDetail.deskripsi}</p>
              </div>

              {/* Kategori & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Kategori</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedAksiDetail.kategori || selectedAksiDetail.tipe?.split(", ") || []).map((kat, idx) => (
                      <span key={idx} className={`px-3 py-1 rounded-full text-sm ${getBadgeColor(kat)}`}>
                        {kat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedAksiDetail.status === "aktif"
                      ? "bg-green-100 text-green-700"
                      : selectedAksiDetail.status === "selesai"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {selectedAksiDetail.status === "aktif" ? "Aktif" : selectedAksiDetail.status === "selesai" ? "Selesai" : "Ditutup"}
                  </span>
                </div>
              </div>

              {/* Gambar */}
              {selectedAksiDetail.image && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Gambar</h4>
                  <img src={selectedAksiDetail.image} alt={selectedAksiDetail.judul} className="w-full h-64 object-cover rounded-lg" />
                </div>
              )}

              {/* Donasi Info */}
              {(selectedAksiDetail.kategori?.includes("Uang") || selectedAksiDetail.tipe?.includes("Uang")) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Donasi</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-semibold text-blue-600">{formatRupiah(selectedAksiDetail.targetDonasi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Terkumpul:</span>
                      <span className="font-semibold text-gray-500">{formatRupiah(selectedAksiDetail.donasiTerkumpul)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            ((selectedAksiDetail.donasiTerkumpul || 0) / (selectedAksiDetail.targetDonasi || 1)) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Barang */}
              {(selectedAksiDetail.kategori?.includes("Barang") || selectedAksiDetail.tipe?.includes("Barang")) && selectedAksiDetail.barangDibutuhkan?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Barang Dibutuhkan</h4>
                  <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
                    {(typeof selectedAksiDetail.barangDibutuhkan === 'string' 
                      ? selectedAksiDetail.barangDibutuhkan.split(", ") 
                      : selectedAksiDetail.barangDibutuhkan).map((barang, idx) => (
                      <li key={idx} className="border border-gray-400 rounded-full py-1.5 px-4">{barang}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Jasa */}
              {(selectedAksiDetail.kategori?.includes("Jasa") || selectedAksiDetail.tipe?.includes("Jasa")) && selectedAksiDetail.jasaDibutuhkan?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Jasa Dibutuhkan</h4>
                  <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
                    {(typeof selectedAksiDetail.jasaDibutuhkan === 'string' 
                      ? selectedAksiDetail.jasaDibutuhkan.split(", ") 
                      : selectedAksiDetail.jasaDibutuhkan).map((jasa, idx) => (
                      <li key={idx} className="border border-gray-400 rounded-full py-1.5 px-4">{jasa}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 grid grid-cols-4 gap-3 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowAksiDetailModal(false);
                  handleOpenEditAksi(selectedAksiDetail);
                }}
                className="bg-blue-50 text-blue-700 border border-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition font-medium text-sm"
              >
                Edit Detail
              </button>
              <button
                onClick={() => {
                  setShowAksiDetailModal(false);
                  setSelectedAksiId(selectedAksiDetail.id);
                  setShowTransparansiForm(true);
                }}
                className="bg-purple-50 text-purple-700 border border-purple-700 px-4 py-2 rounded-full hover:bg-purple-100 transition font-medium text-sm"
              >
                Transparansi
              </button>
              <button
                onClick={() => {
                  setShowAksiDetailModal(false);
                  handleCompleteAksi(selectedAksiDetail.id);
                }}
                className={`px-4 py-2 rounded-full transition font-medium text-sm ${
                  selectedAksiDetail.status === "aktif"
                    ? "bg-green-50 text-green-700 border border-green-700 hover:bg-green-100"
                    : "bg-blue-50 text-blue-700 border border-blue-700 hover:bg-blue-100"
                }`}
              >
                {selectedAksiDetail.status === "aktif" ? "Selesaikan" : "Aktifkan"}
              </button>
              <button
                onClick={() => {
                  setShowAksiDetailModal(false);
                  handleDeleteAksi(selectedAksiDetail.id);
                }}
                className="bg-red-50 text-red-700 border border-red-700 px-4 py-2 rounded-full hover:bg-red-100 transition font-medium text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Aksi */}
      {showEditAksiModal && editingAksi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="sticky top-0 bg-white border-b flex items-center justify-between p-6">
              <h3 className="text-lg font-bold text-gray-900">Edit Aksi</h3>
              <button
                onClick={() => setShowEditAksiModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Aksi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.judul}
                  onChange={(e) =>
                    setEditFormData(prev => ({ ...prev, judul: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Bantu Korban Banjir"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editFormData.deskripsi}
                  onChange={(e) =>
                    setEditFormData(prev => ({ ...prev, deskripsi: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  placeholder="Jelaskan detail aksi..."
                />
              </div>

              {/* Gambar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Aksi
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    className="hidden"
                    id="editImageInput"
                  />
                  <label htmlFor="editImageInput" className="cursor-pointer block">
                    {editFormData.imagePreview ? (
                      <div>
                        <p className="text-sm font-medium text-green-600">✓ Gambar dipilih</p>
                        <img
                          src={editFormData.imagePreview}
                          alt="Preview"
                          className="mt-3 max-h-32 mx-auto rounded"
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600">Klik untuk upload gambar</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {["Uang", "Barang", "Jasa"].map((kat) => (
                    <label key={kat} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editFormData.kategori.includes(kat)}
                        onChange={() => handleEditKategoriChange(kat)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{kat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Donasi */}
              {editFormData.kategori.includes("Uang") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Donasi (Rp)
                  </label>
                  <input
                    type="text"
                    value={editFormData.targetDonasi}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setEditFormData(prev => ({ ...prev, targetDonasi: value }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: 10000000"
                  />
                </div>
              )}

              {/* Barang */}
              {editFormData.kategori.includes("Barang") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barang Dibutuhkan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={barangInput}
                    onChange={(e) => setBarangInput(e.target.value)}
                    onKeyPress={handleAddBarang}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ketik barang lalu tekan Enter"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editFormData.barangDibutuhkan.map((barang) => (
                      <span
                        key={barang}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {barang}
                        <button
                          type="button"
                          onClick={() => handleRemoveBarang(barang)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Jasa */}
              {editFormData.kategori.includes("Jasa") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jasa Dibutuhkan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={jasaInput}
                    onChange={(e) => setJasaInput(e.target.value)}
                    onKeyPress={handleAddJasa}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ketik jasa lalu tekan Enter"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editFormData.jasaDibutuhkan.map((jasa) => (
                      <span
                        key={jasa}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {jasa}
                        <button
                          type="button"
                          onClick={() => handleRemoveJasa(jasa)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditAksiModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleEditAksiSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transparansi Form Modal */}
      {showTransparansiForm && selectedAksiId && (
        <FormUpdateTransparansi 
          aksiId={selectedAksiId}
          onClose={() => {
            setShowTransparansiForm(false);
            setSelectedAksiId(null);
          }}
          onSuccess={() => {
            setShowTransparansiForm(false);
            setSelectedAksiId(null);
          }}
        />
      )}
      </div>
    </>
  );
};

export default DonasiBaru;
