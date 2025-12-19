import React, { useState, useEffect, useMemo } from "react";
import { X, Download, Search } from "lucide-react";

const KelolaBarang = () => {
  const [barangList, setBarangList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModalTerima, setShowModalTerima] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [formDataTerima, setFormDataTerima] = useState({
    foto: null,
    fotoPreview: "",
    tanggalTerima: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchBarang();
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      fetchBarang();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchBarang = () => {
    const data = JSON.parse(localStorage.getItem("donasiBarangList") || "[]");
    setBarangList(data);
    console.log("Data barang dimuat:", data);
  };

  const handleOpenModalTerima = (barang) => {
    setSelectedBarang(barang);
    setFormDataTerima({
      foto: null,
      fotoPreview: "",
      tanggalTerima: new Date().toISOString().split("T")[0],
    });
    setShowModalTerima(true);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Hanya file gambar yang diperbolehkan (JPG, PNG, dll)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormDataTerima(prev => ({
          ...prev,
          foto: reader.result,
          fotoPreview: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTandaiDiterima = () => {
    if (!formDataTerima.foto) {
      alert("Silakan upload foto bukti barang diterima!");
      return;
    }
    if (!formDataTerima.tanggalTerima) {
      alert("Silakan pilih tanggal penerimaan!");
      return;
    }

    const updatedList = barangList.map(b =>
      b.id === selectedBarang.id
        ? { 
            ...b, 
            status: "diterima", 
            tanggalDiterima: formDataTerima.tanggalTerima,
            buktiTerima: {
              foto: formDataTerima.foto,
              tanggalTerima: formDataTerima.tanggalTerima,
            }
          }
        : b
    );
    localStorage.setItem("donasiBarangList", JSON.stringify(updatedList));
    setBarangList(updatedList);
    setShowModalTerima(false);
    alert("Barang berhasil ditandai sebagai diterima!");
  };

  const handleHapus = (id) => {
    if (window.confirm("Yakin ingin menghapus data barang ini?")) {
      const updatedList = barangList.filter(b => b.id !== id);
      localStorage.setItem("donasiBarangList", JSON.stringify(updatedList));
      setBarangList(updatedList);
      alert("Data barang berhasil dihapus!");
    }
  };

  const handleOpenDetail = (barang) => {
    setSelectedBarang(barang);
    setShowDetailModal(true);
  };

  // Filtered barang list berdasarkan search dan status
  const filteredBarang = useMemo(() => {
    let result = [...barangList];
    
    // Filter by status
    if (filterStatus !== "semua") {
      result = result.filter(b => b.status === filterStatus);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.jenisBarang?.toLowerCase().includes(query) ||
        b.judulAksi?.toLowerCase().includes(query) ||
        b.namaPendonasi?.toLowerCase().includes(query) ||
        b.noResi?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [barangList, filterStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3 transform text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari barang donasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-black bg-white pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setFilterStatus("semua")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "semua"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus("belum diterima")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "belum diterima"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Belum Diterima
          </button>
          <button
            onClick={() => setFilterStatus("diterima")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === "diterima"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sudah Diterima
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Barang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Aksi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pendonasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Resi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Dikirim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Diterima</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBarang.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  {searchQuery ? "Tidak ada barang donasi yang sesuai pencarian" : "Tidak ada data barang donasi"}
                </td>
              </tr>
            ) : (
              filteredBarang.map((barang) => (
                <tr key={barang.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOpenDetail(barang)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{barang.jenisBarang}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{barang.judulAksi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{barang.namaPendonasi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded">{barang.nomorResi}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{barang.tanggalDikirim}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {barang.tanggalDiterima || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        barang.status === "diterima"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {barang.status === "diterima" ? "Diterima" : "Belum Diterima"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2" onClick={(e) => e.stopPropagation()}>
                    {barang.status === "belum diterima" && (
                      <button
                        onClick={() => handleOpenModalTerima(barang)}
                        className="block w-full text-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium transition"
                      >
                        Terima
                      </button>
                    )}
                    <button
                      onClick={() => handleHapus(barang.id)}
                      className="block w-full text-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-medium transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Terima Barang */}
      {showModalTerima && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="sticky top-0 bg-white border-b flex items-center justify-between px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Konfirmasi Penerimaan Barang</h3>
              <button
                onClick={() => setShowModalTerima(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Info Barang */}
              <div className="bg-gray-50 border text-black text-sm rounded-lg p-4 space-y-2">
                <p><strong>Jenis Barang:</strong> {selectedBarang?.jenisBarang}</p>
                <p><strong>Judul Aksi:</strong> {selectedBarang?.judulAksi}</p>
                <p><strong>Pendonasi:</strong> {selectedBarang?.namaPendonasi}</p>
              </div>

              {/* Upload Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Bukti Penerimaan *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-4 text-center hover:border-blue-500 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="hidden"
                    id="fotoInput"
                  />
                  <label htmlFor="fotoInput" className="cursor-pointer block">
                    {formDataTerima.fotoPreview ? (
                      <div>
                        <p className="text-sm font-medium text-green-600">{formDataTerima.fotoPreview}</p>
                        {formDataTerima.foto && (
                          <img
                            src={formDataTerima.foto}
                            alt="Preview"
                            className="mt-3 max-h-32 mx-auto rounded"
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600">Klik untuk upload foto</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Tanggal Terima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Penerimaan *
                </label>
                <input
                  type="date"
                  value={formDataTerima.tanggalTerima}
                  onChange={(e) =>
                    setFormDataTerima(prev => ({
                      ...prev,
                      tanggalTerima: e.target.value
                    }))
                  }
                  className="w-full text-black bg-white px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModalTerima(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleTandaiDiterima}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Konfirmasi Terima
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Barang */}
      {showDetailModal && selectedBarang && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="sticky top-0 bg-white border-b flex items-center justify-between p-6">
              <h3 className="text-lg font-bold text-gray-900">Detail Barang Donasi</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info Umum */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">Informasi Barang</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Jenis Barang</p>
                    <p className="font-medium text-gray-900">{selectedBarang.jenisBarang}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedBarang.status === "diterima"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {selectedBarang.status === "diterima" ? "Diterima" : "Belum Diterima"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Pendonasi */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">Informasi Pendonasi</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nama</p>
                    <p className="font-medium text-gray-900">{selectedBarang.namaPendonasi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedBarang.emailPendonasi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">No. HP</p>
                    <p className="font-medium text-gray-900">{selectedBarang.nohpPendonasi}</p>
                  </div>
                </div>
              </div>

              {/* Info Aksi */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">Informasi Aksi</h4>
                <div>
                  <p className="text-sm text-gray-500">Judul Aksi</p>
                  <p className="font-medium text-gray-900">{selectedBarang.judulAksi}</p>
                </div>
              </div>

              {/* Info Pengiriman */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">Informasi Pengiriman</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">No. Resi</p>
                    <code className="bg-gray-100 text-black px-2 py-1 rounded font-medium">{selectedBarang.nomorResi}</code>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Dikirim</p>
                    <p className="font-medium text-gray-900">{selectedBarang.tanggalDikirim}</p>
                  </div>
                </div>
              </div>

              {/* Bukti Penerimaan */}
              {selectedBarang.buktiTerima && (
                <div className="space-y-3 border-t pt-6">
                  <h4 className="font-bold text-gray-900">Bukti Penerimaan</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Diterima</p>
                      <p className="font-medium text-gray-900">{selectedBarang.buktiTerima.tanggalTerima}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Foto Bukti</p>
                    {selectedBarang.buktiTerima.foto && (
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={selectedBarang.buktiTerima.foto}
                          alt="Bukti Penerimaan"
                          className="w-full max-h-80 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaBarang;
