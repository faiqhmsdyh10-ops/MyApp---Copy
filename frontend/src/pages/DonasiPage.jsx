import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createNotification } from "../utils/notificationHelper";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DonasiPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [aksi, setAksi] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [donationType, setDonationType] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 menit = 900 detik (sesuai Midtrans)
  const [timerActive, setTimerActive] = useState(false);
  
  // Midtrans Payment States
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  
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
    pengalaman: "", // Untuk donasi Jasa
    cvFile: null, // Untuk donasi Jasa
    cvPreview: "", // Untuk preview nama file CV
    
    // Step 3: Konfirmasi
    buktiPembayaran: null,
    buktiPreview: "",
    nomorResi: "",
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("userToken") || localStorage.getItem("isLoggedIn");
    const userEmail = localStorage.getItem("userEmail");
    
    if (!isLoggedIn) {
      navigate(`/aksi/${id}`);
      return;
    }

    // Load aksi data
    const localAksi = JSON.parse(localStorage.getItem("aksiList") || "[]");
    const aksiData = localAksi.find((a) => a.id === parseInt(id));
    
    if (aksiData) {
      // Cek apakah ini aksi milik user sendiri
      if (aksiData.createdByEmail === userEmail) {
        alert("Anda tidak dapat berdonasi untuk aksi yang Anda buat sendiri.");
        navigate(`/aksi/${id}`);
        return;
      }
      
      // Cek status aksi
      if (aksiData.status === "ditutup") {
        alert("Maaf, donasi untuk aksi ini sudah ditutup.");
        navigate(`/aksi/${id}`);
        return;
      }
      if (aksiData.status === "selesai") {
        alert("Donasi untuk aksi ini sudah selesai.");
        navigate(`/aksi/${id}`);
        return;
      }
      setAksi(aksiData);
    } else {
      alert("Aksi tidak ditemukan");
      navigate("/aksi-berjalan");
    }
  }, [id, navigate]);

  // Timer countdown untuk donasi uang di step 3
  useEffect(() => {
    if (currentStep === 3 && donationType === "Uang" && timerActive) {
      if (timeRemaining <= 0) {
        alert("Waktu pembayaran habis! Anda akan diarahkan kembali ke halaman aksi.");
        navigate(`/aksi/${id}`);
        return;
      }

      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep, donationType, timerActive, timeRemaining, navigate, id]);

  // Generate QR Code from Midtrans when entering step 3 with Uang donation
  const generateQrisPayment = useCallback(async () => {
    if (!aksi || !formData.jumlahDonasi) return;
    
    setIsGeneratingQR(true);
    setPaymentError("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/create-qris`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseInt(formData.jumlahDonasi),
          donorName: formData.namaLengkap,
          donorEmail: formData.email,
          donorPhone: formData.noHp,
          aksiId: aksi.id,
          aksiTitle: aksi.judul,
        }),
      });

      const result = await response.json();
      console.log("📦 Full API Response:", result);

      if (result.success) {
        console.log("🔗 QR Code URL:", result.data.qrCodeUrl);
        setQrCodeUrl(result.data.qrCodeUrl);
        setOrderId(result.data.orderId);
        setPaymentStatus("pending");
        setTimerActive(true);
        setTimeRemaining(900); // 15 menit sesuai expiry Midtrans
        console.log("✅ QRIS Payment created:", result.data);
      } else {
        setPaymentError(result.message || "Gagal membuat pembayaran");
        console.error("❌ Failed to create QRIS:", result);
      }
    } catch (error) {
      console.error("❌ Error creating QRIS payment:", error);
      setPaymentError("Gagal terhubung ke server pembayaran. Pastikan backend berjalan.");
    } finally {
      setIsGeneratingQR(false);
    }
  }, [aksi, formData.jumlahDonasi, formData.namaLengkap, formData.email, formData.noHp]);

  // Handle successful payment from Midtrans (auto-called when payment detected)
  const handleSuccessfulPayment = useCallback(() => {
    if (!aksi) return;
    
    // Save donation
    const donation = {
      id: Date.now(),
      aksiId: aksi.id,
      aksiJudul: aksi.judul,
      namaLengkap: formData.namaLengkap,
      email: formData.email,
      noHp: formData.noHp,
      jumlahDonasi: formData.jumlahDonasi,
      tipeDonasi: "Uang",
      orderId: orderId,
      paymentMethod: "QRIS Midtrans",
      paymentStatus: "success",
      createdAt: new Date().toISOString(),
    };

    const donations = JSON.parse(localStorage.getItem("donations") || "[]");
    donations.push(donation);
    localStorage.setItem("donations", JSON.stringify(donations));

    // Update progress donasi uang pada aksi terkait
    const aksiList = JSON.parse(localStorage.getItem("aksiList") || "[]");
    const aksiIndex = aksiList.findIndex(a => a.id === aksi.id);
    if (aksiIndex !== -1) {
      const jumlahDonasi = parseInt(formData.jumlahDonasi) || 0;
      const currentDonasi = aksiList[aksiIndex].donasiTerkumpul || 0;
      const newTotal = currentDonasi + jumlahDonasi;
      const targetDonasi = aksiList[aksiIndex].targetDonasi || 0;
      
      aksiList[aksiIndex].donasiTerkumpul = newTotal;
      
      // Auto-update status jika mencapai 100%
      if (targetDonasi > 0 && newTotal >= targetDonasi) {
        aksiList[aksiIndex].status = "selesai";
      }
      
      localStorage.setItem("aksiList", JSON.stringify(aksiList));
    }

    // Create notification for successful donation
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(number || 0);
      };
      createNotification(
        userEmail,
        "donation_success",
        "Pembayaran Berhasil! 🎉",
        `Donasi uang sebesar ${formatRupiah(formData.jumlahDonasi)} untuk aksi "${aksi.judul}" berhasil diterima. Terima kasih atas kebaikan Anda!`
      );
    }

    // Redirect to success page or aksi detail
    setTimeout(() => {
      alert("🎉 Pembayaran berhasil! Terima kasih atas donasi Anda.");
      navigate(`/aksi/${id}`);
    }, 500);
  }, [aksi, formData.namaLengkap, formData.email, formData.noHp, formData.jumlahDonasi, orderId, navigate, id]);

  // Check payment status from Midtrans
  const checkPaymentStatus = useCallback(async () => {
    if (!orderId) return;
    
    setIsCheckingPayment(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/status/${orderId}`);
      const result = await response.json();

      if (result.success) {
        const status = result.data.transactionStatus;
        console.log("📊 Payment status:", status);
        
        if (status === "settlement" || status === "capture") {
          setPaymentStatus("success");
          // Auto submit donation when payment successful
          handleSuccessfulPayment();
        } else if (status === "pending") {
          setPaymentStatus("pending");
        } else if (status === "expire" || status === "cancel" || status === "deny") {
          setPaymentStatus("failed");
          setPaymentError("Pembayaran gagal atau kadaluarsa. Silakan coba lagi.");
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    } finally {
      setIsCheckingPayment(false);
    }
  }, [orderId, handleSuccessfulPayment]);

  // Polling untuk cek status pembayaran setiap 5 detik
  useEffect(() => {
    let interval;
    if (currentStep === 3 && donationType === "Uang" && orderId && paymentStatus === "pending") {
      interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000); // Check every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep, donationType, orderId, paymentStatus, checkPaymentStatus]);

  // Generate QR when entering step 3 with Uang donation
  useEffect(() => {
    if (currentStep === 3 && donationType === "Uang" && !qrCodeUrl && !isGeneratingQR) {
      generateQrisPayment();
    }
  }, [currentStep, donationType, qrCodeUrl, isGeneratingQR, generateQrisPayment]);

  // Scroll to form when step changes
  useEffect(() => {
    if (formRef.current && currentStep > 1) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("File harus dalam format PDF!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          cvFile: reader.result,
          cvPreview: file.name,
        });
      };
      reader.readAsArrayBuffer(file);
    }
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

      if (donationType === "Jasa" && !formData.pengalaman.trim()) {
        alert("Tuliskan pengalaman Anda!");
        return;
      }

      if (donationType === "Jasa" && !formData.cvFile) {
        alert("Upload file CV terlebih dahulu!");
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

    // Handle donasi Barang - simpan ke donasiBarangList
    if (donationType === "Barang") {
      const barangData = {
        id: Date.now(),
        jenisBarang: formData.selectedBarang.join(", "),
        deskripsiBarang: formData.selectedBarang.join(", "),
        judulAksi: aksi.judul,
        namaPendonasi: formData.namaLengkap,
        emailPendonasi: formData.email,
        nohpPendonasi: formData.noHp,
        nomorResi: formData.nomorResi,
        status: "belum diterima",
        tanggalDikirim: new Date().toLocaleDateString("id-ID"),
        tanggalDiterima: null,
      };
      const barangList = JSON.parse(localStorage.getItem("donasiBarangList") || "[]");
      barangList.push(barangData);
      localStorage.setItem("donasiBarangList", JSON.stringify(barangList));
      console.log("✅ Donasi barang berhasil dicatat:", barangData);
    }

    // Handle donasi Jasa - simpan ke pengajuanJasaList
    if (donationType === "Jasa") {
      const jasaData = {
        id: Date.now(),
        aksi_id: aksi.id, // Tambahkan aksi_id
        nama: formData.namaLengkap,
        email: formData.email,
        noHp: formData.noHp,
        deskripsi: formData.selectedJasa.join(", "),
        pengalaman: formData.pengalaman, // Tambahkan pengalaman
        cv: formData.cvFile, // Tambahkan CV file (base64 atau binary)
        status: "pending",
        tanggalPengajuan: new Date().toLocaleDateString("id-ID"),
      };
      const jасаList = JSON.parse(localStorage.getItem("pengajuanJasaList") || "[]");
      jасаList.push(jasaData);
      localStorage.setItem("pengajuanJasaList", JSON.stringify(jасаList));
      console.log("✅ Pengajuan jasa berhasil dicatat:", jasaData);
    }

    // Update progress donasi uang pada aksi terkait
    if (donationType === "Uang") {
      const aksiList = JSON.parse(localStorage.getItem("aksiList") || "[]");
      const aksiIndex = aksiList.findIndex(a => a.id === aksi.id);
      if (aksiIndex !== -1) {
        const jumlahDonasi = parseInt(formData.jumlahDonasi) || 0;
        const currentDonasi = aksiList[aksiIndex].donasiTerkumpul || 0;
        const newTotal = currentDonasi + jumlahDonasi;
        const targetDonasi = aksiList[aksiIndex].targetDonasi || 0;
        
        aksiList[aksiIndex].donasiTerkumpul = newTotal;
        
        // Auto-update status jika mencapai 100%
        if (targetDonasi > 0 && newTotal >= targetDonasi) {
          aksiList[aksiIndex].status = "selesai";
          alert("🎉 Selamat! Aksi donasi telah mencapai 100% dan statusnya diubah menjadi SELESAI.");
        }
        
        localStorage.setItem("aksiList", JSON.stringify(aksiList));
      }
    }

    // Create notification for successful donation
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      if (donationType === "Uang") {
        const formatRupiah = (number) => {
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(number || 0);
        };
        createNotification(
          userEmail,
          "donation_success",
          "Donasi Berhasil",
          `Donasi uang sebesar ${formatRupiah(formData.jumlahDonasi)} untuk aksi "${aksi.judul}" berhasil dicatat. Terima kasih atas kebaikan Anda!`
        );
      } else if (donationType === "Barang") {
        createNotification(
          userEmail,
          "donation_success",
          "Donasi Barang Berhasil",
          `Donasi barang (${formData.selectedBarang.join(", ")}) untuk aksi "${aksi.judul}" berhasil dicatat. Terima kasih atas kebaikan Anda!`
        );
      } else if (donationType === "Jasa") {
        createNotification(
          userEmail,
          "pengajuan_jasa",
          "Pengajuan Relawan Terkirim",
          `Pengajuan relawan Anda untuk aksi "${aksi.judul}" telah dikirim dan sedang menunggu persetujuan admin.`
        );
      }
    }

    alert("Terima kasih! Donasi Anda berhasil dicatat.");
    navigate(`/aksi/${id}`);
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
    <div className="min-h-screen bg-white font-inter">
      <Navbar />

      {/* Hero Background yang memanjang */}
      <div className="relative">
        {/* Hero Section sebagai Background - Extended */}
        <div 
          className="absolute top-0 left-0 w-full bg-gradient-to-br from-blue-400 to-blue-600 bg-cover bg-center"
          style={{ 
            backgroundImage: aksi.image ? `url(${aksi.image})` : 'none',
            height: '800px' // Tinggi hero yang memanjang
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
              {aksi.image ? (
                <>
                  <h1 className="text-5xl font-bold text-white mb-6" style={{ textShadow: "0 0px 10px rgba(0,0,0,0.5)" }}>
                    {aksi.judul || aksi.title || "Aksi Kebaikan"}
                  </h1>
                </>
              ) : (
                <div className="text-8xl">🤝</div>
              )}
            </div>
          </div>
        
        {/* Form Content */}
        <div ref={formRef} className="max-w-4xl bg-white mx-auto px-6 pb-1 border rounded-3xl">
          <div className="bg-white rounded-lg p-8">
                                <button
                      onClick={() => navigate(`/aksi/${id}`)}
                      className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition font-medium"
                    >
                      Ke Halaman Aksi
                    </button>
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
                        Donasi
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
                    value={formData.namaLengkap}
                    onChange={(e) =>
                      setFormData({ ...formData, namaLengkap: e.target.value })
                    }
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
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

            {/* Step 2: Donasi */}
            {currentStep === 2 && (
              <div className="space-y-6 px-6 mt-8">

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
                        className={`px-4 py-2 border-2 rounded-full transition ${
                          donationType === tipe
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-3xl">
                          {tipe === "Uang" ? "" : tipe === "Barang" ? "" : ""}
                        </div>
                        <div className="font-medium text-black">{tipe}</div>
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
                      className="w-full bg-white px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <strong>Metode Pembayaran:</strong> QRIS
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
                            className="flex items-center gap-3 px-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedBarang.includes(item)}
                              onChange={() => handleBarangToggle(item)}
                              className="custom-checkbox mt-3"
                            />
                            <span className="text-gray-700 text-base">{item}</span>
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
                    <div className="space-y-2 mb-6">
                      {(typeof aksi.jasaDibutuhkan === "string"
                        ? aksi.jasaDibutuhkan.split(", ")
                        : aksi.jasaDibutuhkan || []
                      )
                        .filter((j) => j.trim())
                        .map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-center gap-3 px-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedJasa.includes(item)}
                              onChange={() => handleJasaToggle(item)}
                              className="custom-checkbox mt-3"
                            />
                            <span className="text-gray-700 text-base">{item}</span>
                          </label>
                        ))}
                    </div>

                    {/* Pengalaman Textarea */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pengalaman <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.pengalaman}
                        onChange={(e) => setFormData({ ...formData, pengalaman: e.target.value })}
                        placeholder="Tuliskan pengalaman Anda dalam memberikan jasa ini..."
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                      />
                    </div>

                    {/* CV Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload CV (PDF) <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleCVUpload}
                          className="hidden"
                          id="cv-upload"
                        />
                        <label htmlFor="cv-upload" className="cursor-pointer block">
                          {formData.cvPreview ? (
                            <div className="space-y-2">
                              <p className="text-sm text-green-600 font-medium">✓ File terpilih</p>
                              <p className="text-xs text-gray-600">{formData.cvPreview}</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-gray-600 font-medium">Klik atau drag file PDF di sini</p>
                              <p className="text-xs text-gray-400">Max 5MB. Format: PDF</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="border border-gray-300 text-black px-6 py-2 rounded-full hover:bg-gray-50 transition font-medium"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="bg-blue-600 text-white px-6 rounded-full hover:bg-blue-700 transition font-medium"
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
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Ringkasan Donasi</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nama:</span>
                      <span className="font-medium text-black">{formData.namaLengkap}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-black">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipe Donasi:</span>
                      <span className="font-medium text-black">{donationType}</span>
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
                    {/* Timer Countdown */}
                    <div className={`mb-4 p-4 rounded-lg border-2 ${
                      timeRemaining <= 60 
                        ? 'bg-red-50 border-red-500' 
                        : 'bg-yellow-50 border-yellow-500'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-gray-700">Sisa Waktu Pembayaran:</span>
                        </div>
                        <span className={`text-2xl font-bold ${
                          timeRemaining <= 60 ? 'text-red-600' : 'text-yellow-700'
                        }`}>
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                      {timeRemaining <= 60 && (
                        <p className="text-sm text-red-600 mt-2">
                          ⚠️ Waktu hampir habis! Segera selesaikan pembayaran.
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                      <h4 className="font-bold text-blue-900 mb-4 text-lg">Scan QRIS untuk Pembayaran</h4>
                      <div className="bg-white p-6 rounded-lg">
                        <div className="flex flex-col items-center">
                          {/* Dynamic QR Code from Midtrans */}
                          <div className="w-64 h-64 bg-white border-4 border-blue-500 rounded-xl shadow-lg overflow-hidden flex items-center justify-center">
                            {isGeneratingQR ? (
                              <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <p className="text-sm text-gray-500 mt-3">Generating QR Code...</p>
                              </div>
                            ) : paymentError ? (
                              <div className="flex flex-col items-center p-4 text-center">
                                <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-600">{paymentError}</p>
                                <button
                                  onClick={generateQrisPayment}
                                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                >
                                  Coba Lagi
                                </button>
                              </div>
                            ) : paymentStatus === "success" ? (
                              <div className="flex flex-col items-center p-4 text-center">
                                <svg className="w-16 h-16 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-lg font-bold text-green-600">Pembayaran Berhasil!</p>
                                <p className="text-sm text-gray-500 mt-1">Terima kasih atas donasi Anda</p>
                              </div>
                            ) : qrCodeUrl ? (
                              <img 
                                src={qrCodeUrl} 
                                alt="QR Code Payment" 
                                className="w-full h-full object-contain p-2"
                              />
                            ) : (
                              <div className="flex flex-col items-center">
                                <div className="animate-pulse bg-gray-200 w-48 h-48 rounded"></div>
                                <p className="text-sm text-gray-400 mt-2">Loading QR...</p>
                              </div>
                            )}
                          </div>
                          
                          {qrCodeUrl && paymentStatus === "pending" && (
                            <>
                              <p className="text-sm text-gray-600 mt-4 text-center max-w-xs">
                                Scan QR code dengan aplikasi pembayaran Anda (GoPay, OVO, DANA, ShopeePay, dll)
                              </p>
                              
                              {/* Payment Status Indicator */}
                              <div className="mt-4 flex items-center gap-2 text-sm">
                                {isCheckingPayment ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    <span className="text-gray-500">Memeriksa status pembayaran...</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    <span className="text-yellow-600">Menunggu pembayaran</span>
                                  </>
                                )}
                              </div>
                              
                              {orderId && (
                                <p className="text-xs text-gray-400 mt-2">
                                  Order ID: {orderId}
                                </p>
                              )}
                            </>
                          )}
                          
                          <div className="mt-4 px-5 py-2 bg-blue-50 rounded-full border border-blue-600">
                            <p className="text-sm font-semibold text-blue-800">
                              Total: {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(formData.jumlahDonasi || 0)}
                            </p>
                          </div>
                          
                          {/* Manual Check Button */}
                          {qrCodeUrl && paymentStatus === "pending" && (
                            <button
                              onClick={checkPaymentStatus}
                              disabled={isCheckingPayment}
                              className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
                            >
                              {isCheckingPayment ? "Memeriksa..." : "Cek Status Pembayaran"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info: Tidak perlu upload bukti lagi karena otomatis terdeteksi */}
                    {paymentStatus === "pending" && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-green-800">Pembayaran Otomatis Terdeteksi</p>
                            <p className="text-xs text-green-600 mt-1">
                              Setelah Anda melakukan pembayaran, sistem akan otomatis mendeteksi dan memproses donasi Anda. Tidak perlu upload bukti pembayaran.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
                        className="w-full bg-white text-black px-4 py-2 mb-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan nomor resi setelah mengirim barang"
                      />
                      <p className="mt-0 text-xs text-gray-500">
                        Silakan kirim barang terlebih dahulu, kemudian masukkan nomor resi di sini
                      </p>
                    </div>
                  </div>
                )}

                {/* Konfirmasi Jasa */}
                {donationType === "Jasa" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-bold text-green-900 mb-3">Menunggu Konfirmasi</h4>
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
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        // Reset payment states when going back
                        if (donationType === "Uang") {
                          setQrCodeUrl("");
                          setOrderId("");
                          setPaymentStatus("pending");
                          setTimerActive(false);
                          setPaymentError("");
                        }
                        setCurrentStep(2);
                      }}
                      className="border border-gray-300 px-6 py-2 text-black rounded-full hover:bg-gray-50 transition font-medium"
                    >
                      Kembali
                    </button>
                  </div>
                  
                  {/* Tombol konfirmasi hanya untuk Barang dan Jasa, tidak untuk Uang (otomatis) */}
                  {donationType !== "Uang" && (
                    <button
                      onClick={handleSubmit}
                      className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition font-medium"
                    >
                      Konfirmasi Donasi
                    </button>
                  )}
                  
                  {/* Info untuk donasi Uang */}
                  {donationType === "Uang" && paymentStatus === "pending" && (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menunggu pembayaran...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        </div> {/* Close relative z-10 div */}
      </div> {/* Close relative wrapper div */}

      {/* Footer */}
    </div>
  );
};

export default DonasiPage;
