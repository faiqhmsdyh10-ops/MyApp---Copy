import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { X } from "lucide-react";

const GalangDana = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1: Data Diri
    namaLengkap: "",
    email: "",
    noHp: "",

    // Step 2: Detail Aksi
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

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }
    setFormData(prev => ({ ...prev, email }));
  }, [navigate]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKategoriChange = (kategori) => {
    const newKategori = formData.kategori.includes(kategori)
      ? formData.kategori.filter((k) => k !== kategori)
      : [...formData.kategori, kategori];
    setFormData(prev => ({ ...prev, kategori: newKategori }));
  };

  const handleImageUpload = (e) => {
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
          setFormData(prev => ({
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

  const handleAddBarang = (e) => {
    if (e.key === "Enter" && barangInput.trim()) {
      e.preventDefault();
      if (!formData.barangDibutuhkan.includes(barangInput.trim())) {
        setFormData(prev => ({
          ...prev,
          barangDibutuhkan: [...prev.barangDibutuhkan, barangInput.trim()],
        }));
      }
      setBarangInput("");
    }
  };

  const handleRemoveBarang = (item) => {
    setFormData(prev => ({
      ...prev,
      barangDibutuhkan: prev.barangDibutuhkan.filter((b) => b !== item),
    }));
  };

  const handleAddJasa = (e) => {
    if (e.key === "Enter" && jasaInput.trim()) {
      e.preventDefault();
      if (!formData.jasaDibutuhkan.includes(jasaInput.trim())) {
        setFormData(prev => ({
          ...prev,
          jasaDibutuhkan: [...prev.jasaDibutuhkan, jasaInput.trim()],
        }));
      }
      setJasaInput("");
    }
  };

  const handleRemoveJasa = (item) => {
    setFormData(prev => ({
      ...prev,
      jasaDibutuhkan: prev.jasaDibutuhkan.filter((j) => j !== item),
    }));
  };

  const validateStep1 = () => {
    if (!formData.namaLengkap.trim()) {
      alert("Nama lengkap harus diisi!");
      return false;
    }
    if (!formData.email.trim()) {
      alert("Email harus diisi!");
      return false;
    }
    if (!formData.noHp.trim()) {
      alert("Nomor HP harus diisi!");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.judul.trim()) {
      alert("Judul aksi harus diisi!");
      return false;
    }
    if (!formData.deskripsi.trim()) {
      alert("Deskripsi harus diisi!");
      return false;
    }
    if (formData.kategori.length === 0) {
      alert("Pilih minimal 1 kategori!");
      return false;
    }
    if (formData.kategori.includes("Uang") && !formData.targetDonasi) {
      alert("Target donasi harus diisi!");
      return false;
    }
    if (formData.kategori.includes("Barang") && formData.barangDibutuhkan.length === 0) {
      alert("Tambahkan minimal 1 barang yang dibutuhkan!");
      return false;
    }
    if (formData.kategori.includes("Jasa") && formData.jasaDibutuhkan.length === 0) {
      alert("Tambahkan minimal 1 jasa yang dibutuhkan!");
      return false;
    }
    if (!formData.imagePreview) {
      alert("Upload gambar untuk aksi!");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    const newAksi = {
      id: Date.now(),
      judul: formData.judul,
      deskripsi: formData.deskripsi,
      kategori: formData.kategori,
      targetDonasi: formData.kategori.includes("Uang") ? parseInt(formData.targetDonasi) || 0 : 0,
      image: formData.imagePreview || "https://via.placeholder.com/400x300",
      barangDibutuhkan: formData.barangDibutuhkan.join(", "),
      jasaDibutuhkan: formData.jasaDibutuhkan.join(", "),
      createdBy: formData.namaLengkap,
      createdByEmail: formData.email,
      createdByPhone: formData.noHp,
      status: "pending_approval",
      donasiTerkumpul: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      // Save to user's pengajuan aksi list
      const pengajuanList = JSON.parse(localStorage.getItem("pengajuanAksiList") || "[]");
      pengajuanList.push(newAksi);
      localStorage.setItem("pengajuanAksiList", JSON.stringify(pengajuanList));

      alert("✅ Aksi Anda telah dikirimkan ke admin untuk ditinjau. Terima kasih!");
      navigate("/donasi-saya");
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <Navbar />

      {/* Hero Background yang memanjang */}
      <div className="relative">
        {/* Hero Section sebagai Background - Extended */}
        <div 
          className="absolute top-0 left-0 w-full bg-gradient-to-br from-blue-400 to-blue-600 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/images/hero.jpg')",
            height: '800px'
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent"></div>
        </div>

        {/* Content di atas hero background */}
        <div className="relative z-10 pt-0 pb-16">
          {/* Hero Title Section */}
          <div className="w-full h-96 flex items-end justify-center">
            <div className="max-w-6xl mb-12 text-center px-6">
              <h1 className="text-5xl font-bold text-white mb-6" style={{ textShadow: "0 0px 10px rgba(0,0,0,0.5)" }}>
                Mulai Galang Dana untuk Aksi Sosialmu
              </h1>
              <p className="text-gray-200 text-lg max-w-2xl mx-auto" style={{ textShadow: "0 0px 5px rgba(0,0,0,0.5)" }}>
                Punya ide untuk membantu sesama? Buat aksi galang dana sendiri dan ajak komunitas untuk berkontribusi bersama.
              </p>
            </div>
          </div>
        
          {/* Form Content */}
          <div className="max-w-4xl bg-white mx-auto px-6 pb-12 border rounded-3xl">
            <div className="bg-white rounded-lg p-8">
              {/* Progress Steps - Custom Modern Stepper */}
              <div className="bg-white py-8">
                <div className="max-w-4xl mx-auto px-6">
                  <div className="flex items-center justify-between">
                    {/* Step 1 */}
                    <div className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all ${
                          currentStep >= 1 
                            ? "bg-blue-100 border-blue-600 text-blue-600" 
                            : "bg-white border-gray-300 text-gray-400"
                        }`}>
                          {currentStep > 1 ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-lg">1</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 text-center">
                        <p className={`font-medium text-sm ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                          Data Diri
                        </p>
                      </div>
                      <div className={`flex-1 h-1 mx-4 transition-all ${
                        currentStep > 1 ? "bg-blue-600" : "bg-gray-200"
                      }`}></div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all ${
                          currentStep >= 2 
                            ? "bg-blue-100 border-blue-600 text-blue-600" 
                            : "bg-white border-gray-300 text-gray-400"
                        }`}>
                          {currentStep > 2 ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-lg">2</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 text-center">
                        <p className={`font-medium text-sm ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                          Detail Aksi
                        </p>
                      </div>
                      <div className={`flex-1 h-1 mx-4 transition-all ${
                        currentStep > 2 ? "bg-blue-600" : "bg-gray-200"
                      }`}></div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all ${
                          currentStep >= 3 
                            ? "bg-blue-100 border-blue-600 text-blue-600" 
                            : "bg-white border-gray-300 text-gray-400"
                        }`}>
                          {currentStep > 3 ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-lg">3</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 text-center">
                        <p className={`font-medium text-sm ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
                          Konfirmasi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1: Data Diri */}
              {currentStep === 1 && (
                <div className="space-y-6 px-6 mt-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleInputChange}
                      className="w-full bg-white px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan nama lengkap Anda"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No. HP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="noHp"
                      value={formData.noHp}
                      onChange={handleInputChange}
                      className="w-full bg-white text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="08123456789"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleNextStep}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium"
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Detail Aksi */}
              {currentStep === 2 && (
                <div className="space-y-6 px-6 mt-8">
                  {/* Judul */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Aksi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="judul"
                      value={formData.judul}
                      onChange={handleInputChange}
                      className="w-full bg-white px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Bantu Korban Banjir Jakarta"
                    />
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      className="w-full bg-white px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="5"
                      placeholder="Jelaskan detail aksi sosial ini..."
                    />
                  </div>

                  {/* Gambar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Aksi <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageInput"
                      />
                      <label htmlFor="imageInput" className="cursor-pointer block">
                        {formData.imagePreview ? (
                          <div>
                            <p className="text-sm font-medium text-green-600">✓ Gambar sudah dipilih</p>
                            <img
                              src={formData.imagePreview}
                              alt="Preview"
                              className="mt-3 max-h-48 mx-auto rounded"
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
                      Kategori Donasi <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {["Uang", "Barang", "Jasa"].map((kategori) => (
                        <button
                          key={kategori}
                          type="button"
                          onClick={() => handleKategoriChange(kategori)}
                          className={`px-4 py-3 border-2 rounded-full transition ${
                            formData.kategori.includes(kategori)
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-blue-300"
                          }`}
                        >
                          <div className="font-medium text-black">{kategori}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Donasi - hanya jika Uang dipilih */}
                  {formData.kategori.includes("Uang") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Donasi (Rp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="targetDonasi"
                        value={formData.targetDonasi}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setFormData(prev => ({ ...prev, targetDonasi: value }));
                        }}
                        className="w-full bg-white px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: 10000000 untuk Rp 10.000.000"
                      />
                      {formData.targetDonasi && (
                        <p className="mt-2 text-sm text-gray-600">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(parseInt(formData.targetDonasi))}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Barang yang Dibutuhkan - hanya jika Barang dipilih */}
                  {formData.kategori.includes("Barang") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Barang yang Dibutuhkan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={barangInput}
                        onChange={(e) => setBarangInput(e.target.value)}
                        onKeyPress={handleAddBarang}
                        className="w-full bg-white px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ketik barang lalu tekan Enter"
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.barangDibutuhkan.map((barang) => (
                          <span
                            key={barang}
                            className="bg-blue-100 text-sm border border-blue-600 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
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

                  {/* Jasa yang Dibutuhkan - hanya jika Jasa dipilih */}
                  {formData.kategori.includes("Jasa") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jasa yang Dibutuhkan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={jasaInput}
                        onChange={(e) => setJasaInput(e.target.value)}
                        onKeyPress={handleAddJasa}
                        className="w-full bg-white px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ketik jasa lalu tekan Enter"
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.jasaDibutuhkan.map((jasa) => (
                          <span
                            key={jasa}
                            className="bg-purple-100 text-sm border border-purple-600 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2"
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

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={handlePrevStep}
                      className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition font-medium"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium"
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Konfirmasi */}
              {currentStep === 3 && (
                <div className="space-y-6 px-6 mt-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      ✅ Aksi Anda telah siap untuk dikirimkan ke admin untuk direview.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Ringkasan Data:</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Nama</p>
                        <p className="font-medium text-gray-900">{formData.namaLengkap}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Nomor HP</p>
                        <p className="font-medium text-gray-900">{formData.noHp}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Judul Aksi</p>
                        <p className="font-medium text-gray-900">{formData.judul}</p>
                      </div>
                    </div>

                    {formData.kategori.includes("Uang") && formData.targetDonasi && (
                      <div className="text-sm">
                        <p className="text-gray-600">Target Donasi</p>
                        <p className="font-medium text-gray-900">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(parseInt(formData.targetDonasi))}
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Deskripsi:</p>
                      <p className="text-gray-900">{formData.deskripsi}</p>
                    </div>

                    {formData.imagePreview && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Gambar Aksi:</p>
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          className="max-h-48 rounded-lg border"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {formData.kategori.map((kat) => (
                        <span
                          key={kat}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            kat === "Uang"
                              ? "bg-green-100 text-green-800"
                              : kat === "Barang"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {kat}
                        </span>
                      ))}
                    </div>

                    {formData.kategori.includes("Barang") && formData.barangDibutuhkan.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Barang yang Dibutuhkan:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.barangDibutuhkan.map((barang) => (
                            <span key={barang} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {barang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.kategori.includes("Jasa") && formData.jasaDibutuhkan.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Jasa yang Dibutuhkan:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.jasaDibutuhkan.map((jasa) => (
                            <span key={jasa} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                              {jasa}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Catatan:</strong> Aksi Anda akan direview oleh admin dalam 1-2 hari kerja. 
                      Anda akan menerima notifikasi via email tentang status persetujuan.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={handlePrevStep}
                      className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition font-medium"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition font-medium"
                    >
                      Kirim Pengajuan ✓
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalangDana;
