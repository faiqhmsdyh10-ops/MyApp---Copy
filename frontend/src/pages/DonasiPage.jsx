import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const DonasiPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aksi, setAksi] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [donationType, setDonationType] = useState("");
  
  const [formData, setFormData] = useState({
    // Step 1: Data Diri
    namaLengkap: "",
    email: "",
    noHp: "",
    
    // Step 2: Donasi Info
    tipeDonasi: "",
    jumlahDonasi: "",
    selectedBarang: [],
    selectedJasa: [],
    
    // Step 3: Konfirmasi
    buktiPembayaran: null,
    buktiPreview: "",
    nomorResi: "",
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("userToken") || localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate(`/aksi/${id}`);
      return;
    }

    // Load aksi data
    const localAksi = JSON.parse(localStorage.getItem("aksiList") || "[]");
    const aksiData = localAksi.find((a) => a.id === parseInt(id));
    
    if (aksiData) {
      setAksi(aksiData);
    } else {
      alert("Aksi tidak ditemukan");
      navigate("/aksi-berjalan");
    }
  }, [id, navigate]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          buktiPembayaran: file,
          buktiPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBarangToggle = (item) => {
    const isSelected = formData.selectedBarang.includes(item);
    setFormData({
      ...formData,
      selectedBarang: isSelected
        ? formData.selectedBarang.filter((b) => b !== item)
        : [...formData.selectedBarang, item],
    });
  };

  const handleJasaToggle = (item) => {
    const isSelected = formData.selectedJasa.includes(item);
    setFormData({
      ...formData,
      selectedJasa: isSelected
        ? formData.selectedJasa.filter((j) => j !== item)
        : [...formData.selectedJasa, item],
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.namaLengkap || !formData.email || !formData.noHp) {
        alert("Mohon lengkapi data diri Anda!");
        return;
      }
    }

    if (currentStep === 2) {
      if (!donationType) {
        alert("Pilih tipe donasi terlebih dahulu!");
        return;
      }

      if (donationType === "Uang" && !formData.jumlahDonasi) {
        alert("Masukkan jumlah donasi!");
        return;
      }

      if (donationType === "Barang" && formData.selectedBarang.length === 0) {
        alert("Pilih minimal 1 barang!");
        return;
      }

      if (donationType === "Jasa" && formData.selectedJasa.length === 0) {
        alert("Pilih minimal 1 jasa!");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = () => {
    if (donationType === "Uang" && !formData.buktiPembayaran) {
      alert("Upload bukti pembayaran terlebih dahulu!");
      return;
    }

    if (donationType === "Barang" && !formData.nomorResi) {
      alert("Masukkan nomor resi pengiriman!");
      return;
    }

    // Save donation
    const donation = {
      id: Date.now(),
      aksiId: aksi.id,
      aksiJudul: aksi.judul,
      ...formData,
      tipeDonasi: donationType,
      createdAt: new Date().toISOString(),
    };

    const donations = JSON.parse(localStorage.getItem("donations") || "[]");
    donations.push(donation);
    localStorage.setItem("donations", JSON.stringify(donations));

    alert("Terima kasih! Donasi Anda berhasil dicatat.");
    navigate("/");
  };

  if (!aksi) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 text-center text-gray-500">Memuat data aksi...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-6">
              {aksi.image && (
                <img
                  src={aksi.image}
                  alt={aksi.judul}
                  className="w-32 h-32 object-cover rounded-lg shadow-lg"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold mb-2">{aksi.judul}</h1>
                <p className="text-blue-100">
                  Mari bersama membantu mewujudkan perubahan positif
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentStep >= step
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    <span
                      className={`ml-3 font-medium ${
                        currentStep >= step ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {step === 1 ? "Data Diri" : step === 2 ? "Donasi" : "Konfirmasi"}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        currentStep > step ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Step 1: Data Diri */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Diri</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaLengkap}
                    onChange={(e) =>
                      setFormData({ ...formData, namaLengkap: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="08123456789"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleNextStep}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Lanjutkan
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Donasi */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Donasi</h2>

                {/* Donation Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Tipe Donasi <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {(aksi.kategori || aksi.tipe?.split(", ") || []).map((tipe) => (
                      <button
                        key={tipe}
                        onClick={() => setDonationType(tipe)}
                        className={`p-4 border-2 rounded-lg transition ${
                          donationType === tipe
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-3xl mb-2">
                          {tipe === "Uang" ? "💰" : tipe === "Barang" ? "📦" : "🛠️"}
                        </div>
                        <div className="font-semibold">{tipe}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Donation Amount - Uang */}
                {donationType === "Uang" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Donasi (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.jumlahDonasi}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, jumlahDonasi: value });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan jumlah donasi"
                    />
                    {formData.jumlahDonasi && (
                      <p className="mt-2 text-sm text-gray-600">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(parseInt(formData.jumlahDonasi))}
                      </p>
                    )}
                    
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💳 <strong>Metode Pembayaran:</strong> QRIS (Midtrans)
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Anda akan mendapatkan kode QRIS di step konfirmasi
                      </p>
                    </div>
                  </div>
                )}

                {/* Barang Selection */}
                {donationType === "Barang" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Pilih Barang yang Akan Didonasikan <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {(typeof aksi.barangDibutuhkan === "string"
                        ? aksi.barangDibutuhkan.split(", ")
                        : aksi.barangDibutuhkan || []
                      )
                        .filter((b) => b.trim())
                        .map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedBarang.includes(item)}
                              onChange={() => handleBarangToggle(item)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700">{item}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}

                {/* Jasa Selection */}
                {donationType === "Jasa" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Pilih Jasa yang Akan Diberikan <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {(typeof aksi.jasaDibutuhkan === "string"
                        ? aksi.jasaDibutuhkan.split(", ")
                        : aksi.jasaDibutuhkan || []
                      )
                        .filter((j) => j.trim())
                        .map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedJasa.includes(item)}
                              onChange={() => handleJasaToggle(item)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700">{item}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Lanjutkan
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Konfirmasi */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Konfirmasi Donasi</h2>

                {/* Ringkasan Donasi */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Ringkasan Donasi</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nama:</span>
                      <span className="font-medium">{formData.namaLengkap}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipe Donasi:</span>
                      <span className="font-medium">{donationType}</span>
                    </div>
                    {donationType === "Uang" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jumlah:</span>
                        <span className="font-medium text-blue-600">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(parseInt(formData.jumlahDonasi))}
                        </span>
                      </div>
                    )}
                    {donationType === "Barang" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Barang:</span>
                        <span className="font-medium">{formData.selectedBarang.join(", ")}</span>
                      </div>
                    )}
                    {donationType === "Jasa" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jasa:</span>
                        <span className="font-medium">{formData.selectedJasa.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Konfirmasi Uang */}
                {donationType === "Uang" && (
                  <div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                      <h4 className="font-bold text-blue-900 mb-3">📱 Scan QRIS untuk Pembayaran</h4>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-sm">QRIS Code</span>
                          {/* In real app, integrate with Midtrans QRIS API */}
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                          Scan QR code dengan aplikasi pembayaran Anda
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Bukti Pembayaran <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {formData.buktiPreview && (
                        <img
                          src={formData.buktiPreview}
                          alt="Preview"
                          className="mt-4 w-full max-w-md h-48 object-cover rounded-lg border"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Konfirmasi Barang */}
                {donationType === "Barang" && (
                  <div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-4">
                      <h4 className="font-bold text-orange-900 mb-3">📮 Alamat Pengiriman</h4>
                      <div className="text-sm text-orange-800 space-y-1">
                        <p className="font-semibold">RuangBerbagi</p>
                        <p>Jl. Mawar No. 123, Kelurahan Sukamaju</p>
                        <p>Kecamatan Cibiru, Kota Bandung</p>
                        <p>Jawa Barat 40393</p>
                        <p className="mt-2">Telp: 0812-3456-7890</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Resi Pengiriman <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nomorResi}
                        onChange={(e) =>
                          setFormData({ ...formData, nomorResi: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan nomor resi setelah mengirim barang"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Silakan kirim barang terlebih dahulu, kemudian masukkan nomor resi di sini
                      </p>
                    </div>
                  </div>
                )}

                {/* Konfirmasi Jasa */}
                {donationType === "Jasa" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-bold text-green-900 mb-3">✉️ Menunggu Konfirmasi</h4>
                    <p className="text-sm text-green-800 mb-4">
                      Terima kasih telah menawarkan jasa Anda! Tim RuangBerbagi akan menghubungi
                      Anda melalui email <strong>{formData.email}</strong> dalam 1x24 jam untuk
                      koordinasi lebih lanjut.
                    </p>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Jasa yang Anda tawarkan:</strong>
                      </p>
                      <ul className="mt-2 space-y-1">
                        {formData.selectedJasa.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Konfirmasi Donasi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600 border-t mt-12">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-600">RuangBerbagi</span> — Semua hak
        dilindungi.
      </footer>
    </div>
  );
};

export default DonasiPage;
