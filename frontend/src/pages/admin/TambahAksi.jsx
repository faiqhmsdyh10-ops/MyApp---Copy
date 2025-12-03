import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TambahAksi = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    kategori: [],
    targetDonasi: "",
    image: null,
    imagePreview: "",
    barangDibutuhkan: [],
    jasaDibutuhkan: [],
    status: "aktif",
  });

  const [barangInput, setBarangInput] = useState("");
  const [jasaInput, setJasaInput] = useState("");

  // Handle kategori checkbox
  const handleKategoriChange = (kategori) => {
    const newKategori = form.kategori.includes(kategori)
      ? form.kategori.filter((k) => k !== kategori)
      : [...form.kategori, kategori];
    
    setForm({ ...form, kategori: newKategori });
    
    // Reset target donasi if "Uang" is unchecked
    if (kategori === "Uang" && form.kategori.includes("Uang")) {
      setForm({ ...form, kategori: newKategori, targetDonasi: "" });
    }
  };

  // Handle image upload with compression
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB. Silakan pilih gambar yang lebih kecil.");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Create canvas to resize image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          // Set max dimensions
          const maxWidth = 800;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
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

          // Convert to compressed base64
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          
          setForm({
            ...form,
            image: file,
            imagePreview: compressedBase64,
          });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding barang
  const handleAddBarang = (e) => {
    if (e.key === "Enter" && barangInput.trim()) {
      e.preventDefault();
      if (!form.barangDibutuhkan.includes(barangInput.trim())) {
        setForm({
          ...form,
          barangDibutuhkan: [...form.barangDibutuhkan, barangInput.trim()],
        });
      }
      setBarangInput("");
    }
  };

  const handleRemoveBarang = (item) => {
    setForm({
      ...form,
      barangDibutuhkan: form.barangDibutuhkan.filter((b) => b !== item),
    });
  };

  // Handle adding jasa
  const handleAddJasa = (e) => {
    if (e.key === "Enter" && jasaInput.trim()) {
      e.preventDefault();
      if (!form.jasaDibutuhkan.includes(jasaInput.trim())) {
        setForm({
          ...form,
          jasaDibutuhkan: [...form.jasaDibutuhkan, jasaInput.trim()],
        });
      }
      setJasaInput("");
    }
  };

  const handleRemoveJasa = (item) => {
    setForm({
      ...form,
      jasaDibutuhkan: form.jasaDibutuhkan.filter((j) => j !== item),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (form.kategori.length === 0) {
      alert("Pilih minimal 1 kategori!");
      return;
    }

    if (form.kategori.includes("Barang") && form.barangDibutuhkan.length === 0) {
      alert("Tambahkan minimal 1 barang yang dibutuhkan!");
      return;
    }

    if (form.kategori.includes("Jasa") && form.jasaDibutuhkan.length === 0) {
      alert("Tambahkan minimal 1 jasa yang dibutuhkan!");
      return;
    }

    const newAksi = {
      id: Date.now(),
      judul: form.judul,
      deskripsi: form.deskripsi,
      tipe: form.kategori.join(", "),
      kategori: form.kategori,
      targetDonasi: form.kategori.includes("Uang") ? parseInt(form.targetDonasi) || 0 : 0,
      image: form.imagePreview || "https://via.placeholder.com/400x300",
      barangDibutuhkan: form.barangDibutuhkan.join(", "),
      jasaDibutuhkan: form.jasaDibutuhkan.join(", "),
      status: form.status,
      donasiTerkumpul: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    // Save to localStorage with error handling
    try {
      const aksiList = JSON.parse(localStorage.getItem("aksiList") || "[]");
      aksiList.push(newAksi);
      localStorage.setItem("aksiList", JSON.stringify(aksiList));
      
      alert("Aksi berhasil ditambahkan!");
      navigate("/admin/kelola-aksi");
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        alert("Penyimpanan penuh! Silakan:\n1. Hapus beberapa aksi lama, atau\n2. Gunakan gambar yang lebih kecil (maksimal 2MB)");
      } else {
        alert("Terjadi kesalahan saat menyimpan: " + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tambah Aksi Baru</h2>
        <p className="text-gray-600">Buat aksi sosial baru untuk ditampilkan di halaman publik</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Judul */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Aksi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.judul}
            onChange={(e) => setForm({ ...form, judul: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Bantu Korban Banjir Jakarta"
            required
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
            placeholder="Jelaskan detail aksi sosial ini..."
            required
          />
        </div>

        {/* Kategori - Checkbox */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Kategori <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {["Uang", "Barang", "Jasa"].map((kategori) => (
              <label key={kategori} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.kategori.includes(kategori)}
                  onChange={() => handleKategoriChange(kategori)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{kategori}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Target Donasi - Only if "Uang" is checked */}
        {form.kategori.includes("Uang") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Donasi (Rp)
            </label>
            <input
              type="text"
              value={form.targetDonasi}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setForm({ ...form, targetDonasi: value });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan target donasi"
            />
            {form.targetDonasi && (
              <p className="mt-1 text-sm text-gray-500">
                Rp {parseInt(form.targetDonasi).toLocaleString("id-ID")}
              </p>
            )}
          </div>
        )}

        {/* Upload Gambar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Aksi
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {form.imagePreview && (
            <div className="mt-4">
              <img
                src={form.imagePreview}
                alt="Preview"
                className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Barang Dibutuhkan - Only if "Barang" is checked */}
        {form.kategori.includes("Barang") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barang yang Dibutuhkan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={barangInput}
              onChange={(e) => setBarangInput(e.target.value)}
              onKeyDown={handleAddBarang}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ketik nama barang dan tekan Enter"
            />
            <p className="mt-1 text-xs text-gray-500">Tekan Enter untuk menambahkan barang</p>
            
            {/* Chips Display */}
            <div className="flex flex-wrap gap-2 mt-3">
              {form.barangDibutuhkan.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBarang(item)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jasa Dibutuhkan - Only if "Jasa" is checked */}
        {form.kategori.includes("Jasa") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jasa yang Dibutuhkan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={jasaInput}
              onChange={(e) => setJasaInput(e.target.value)}
              onKeyDown={handleAddJasa}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ketik jasa yang dibutuhkan dan tekan Enter"
            />
            <p className="mt-1 text-xs text-gray-500">Tekan Enter untuk menambahkan jasa</p>
            
            {/* Chips Display */}
            <div className="flex flex-wrap gap-2 mt-3">
              {form.jasaDibutuhkan.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveJasa(item)}
                    className="text-green-600 hover:text-green-800 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
            <option value="ditutup">Ditutup</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Simpan Aksi
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/kelola-aksi")}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahAksi;
