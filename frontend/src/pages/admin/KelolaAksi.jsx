import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormUpdateTransparansi from "../../components/FormUpdateTransparansi";

const KelolaAksi = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("aksi-berjalan");
  const [aksiList, setAksiList] = useState([]);
  const [pengajuanAksiList, setPengajuanAksiList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAksiId, setSelectedAksiId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAksi, setSelectedAksi] = useState(null);
  const [showTransparansiForm, setShowTransparansiForm] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [showPengajuanDetailModal, setShowPengajuanDetailModal] = useState(false);
  const [editForm, setEditForm] = useState({
    judul: "",
    deskripsi: "",
    kategori: [],
    targetDonasi: "",
    donasiTerkumpul: "",
    barangDibutuhkan: [],
    jasaDibutuhkan: [],
    status: "aktif",
  });
  const [barangInput, setBarangInput] = useState("");
  const [jasaInput, setJasaInput] = useState("");

  useEffect(() => {
    loadAksi();
    loadPengajuanAksi();
  }, []);

  const loadAksi = () => {
    const stored = JSON.parse(localStorage.getItem("aksiList") || "[]");
    setAksiList(stored);
  };

  const loadPengajuanAksi = () => {
    const stored = JSON.parse(localStorage.getItem("pengajuanAksiList") || "[]");
    // Filter hanya yang pending approval
    const pending = stored.filter(p => p.status === "pending_approval");
    setPengajuanAksiList(pending);
  };

  // Helper function untuk warna badge kategori
  const getBadgeColor = (kategori) => {
    const normalizedType = kategori.toLowerCase();
    if (normalizedType.includes('uang')) return 'bg-green-50 text-green-700 border border-green-700';
    if (normalizedType.includes('barang')) return 'bg-blue-50 text-blue-700 border border-blue-700';
    if (normalizedType.includes('jasa')) return 'bg-purple-50 text-purple-700 border border-purple-700';
    return 'bg-gray-100 text-gray-700';
  };
  const handleEdit = (aksi) => {
    setEditingId(aksi.id);
    
    // Parse kategori
    const kategoriArray = aksi.kategori || (aksi.tipe ? aksi.tipe.split(", ") : []);
    
    // Parse barang dan jasa
    const barangArray = aksi.barangDibutuhkan 
      ? (typeof aksi.barangDibutuhkan === 'string' 
          ? aksi.barangDibutuhkan.split(", ").filter(b => b.trim()) 
          : aksi.barangDibutuhkan)
      : [];
    
    const jasaArray = aksi.jasaDibutuhkan 
      ? (typeof aksi.jasaDibutuhkan === 'string' 
          ? aksi.jasaDibutuhkan.split(", ").filter(j => j.trim()) 
          : aksi.jasaDibutuhkan)
      : [];

    setEditForm({
      judul: aksi.judul || "",
      deskripsi: aksi.deskripsi || "",
      kategori: kategoriArray,
      targetDonasi: aksi.targetDonasi?.toString() || "",
      donasiTerkumpul: aksi.donasiTerkumpul?.toString() || "0",
      barangDibutuhkan: barangArray,
      jasaDibutuhkan: jasaArray,
      status: aksi.status || "aktif",
    });
    setShowModal(true);
  };

  const handleKategoriChange = (kategori) => {
    const newKategori = editForm.kategori.includes(kategori)
      ? editForm.kategori.filter((k) => k !== kategori)
      : [...editForm.kategori, kategori];
    
    setEditForm({ ...editForm, kategori: newKategori });
  };

  const handleAddBarang = (e) => {
    if (e.key === "Enter" && barangInput.trim()) {
      e.preventDefault();
      if (!editForm.barangDibutuhkan.includes(barangInput.trim())) {
        setEditForm({
          ...editForm,
          barangDibutuhkan: [...editForm.barangDibutuhkan, barangInput.trim()],
        });
      }
      setBarangInput("");
    }
  };

  const handleRemoveBarang = (item) => {
    setEditForm({
      ...editForm,
      barangDibutuhkan: editForm.barangDibutuhkan.filter((b) => b !== item),
    });
  };

  const handleAddJasa = (e) => {
    if (e.key === "Enter" && jasaInput.trim()) {
      e.preventDefault();
      if (!editForm.jasaDibutuhkan.includes(jasaInput.trim())) {
        setEditForm({
          ...editForm,
          jasaDibutuhkan: [...editForm.jasaDibutuhkan, jasaInput.trim()],
        });
      }
      setJasaInput("");
    }
  };

  const handleRemoveJasa = (item) => {
    setEditForm({
      ...editForm,
      jasaDibutuhkan: editForm.jasaDibutuhkan.filter((j) => j !== item),
    });
  };

  const handleSave = () => {
    const updated = aksiList.map((aksi) =>
      aksi.id === editingId
        ? {
            ...aksi,
            judul: editForm.judul,
            deskripsi: editForm.deskripsi,
            kategori: editForm.kategori,
            tipe: editForm.kategori.join(", "),
            targetDonasi: editForm.kategori.includes("Uang") ? parseInt(editForm.targetDonasi) || 0 : 0,
            donasiTerkumpul: parseInt(editForm.donasiTerkumpul) || 0,
            barangDibutuhkan: editForm.barangDibutuhkan.join(", "),
            jasaDibutuhkan: editForm.jasaDibutuhkan.join(", "),
            status: editForm.status,
            lastUpdated: new Date().toISOString(),
          }
        : aksi
    );
    setAksiList(updated);
    localStorage.setItem("aksiList", JSON.stringify(updated));
    setShowModal(false);
    setEditingId(null);
    alert("Aksi berhasil diupdate!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus aksi ini?")) {
      const updated = aksiList.filter((aksi) => aksi.id !== id);
      setAksiList(updated);
      localStorage.setItem("aksiList", JSON.stringify(updated));
      alert("Aksi berhasil dihapus!");
    }
  };

  const handleStatusToggle = (aksi) => {
    const newStatus = aksi.status === "aktif" ? "selesai" : "aktif";
    const updated = aksiList.map((a) =>
      a.id === aksi.id
        ? { ...a, status: newStatus, lastUpdated: new Date().toISOString() }
        : a
    );
    setAksiList(updated);
    localStorage.setItem("aksiList", JSON.stringify(updated));
  };

  const handleApprovePengajuan = (pengajuan) => {
    if (!window.confirm("Setujui pengajuan aksi ini?")) return;

    // Ubah status pengajuan menjadi approved
    const allPengajuan = JSON.parse(localStorage.getItem("pengajuanAksiList") || "[]");
    const updatedAllPengajuan = allPengajuan.map(p => 
      p.id === pengajuan.id 
        ? { ...p, status: "approved", approvalDate: new Date().toISOString() }
        : p
    );
    localStorage.setItem("pengajuanAksiList", JSON.stringify(updatedAllPengajuan));

    // Tambahkan ke aksiList sebagai aksi aktif
    const aksiToAdd = {
      ...pengajuan,
      status: "aktif",
      createdAt: new Date().toISOString(),
    };
    const allAksi = JSON.parse(localStorage.getItem("aksiList") || "[]");
    allAksi.push(aksiToAdd);
    localStorage.setItem("aksiList", JSON.stringify(allAksi));

    setAksiList(allAksi);
    loadPengajuanAksi(); // Reload pengajuan list
    setShowPengajuanDetailModal(false);
    alert("✅ Pengajuan aksi berhasil disetujui! Aksi telah ditambahkan ke daftar aksi berjalan.");
  };

  const handleRejectPengajuan = (pengajuan) => {
    if (!window.confirm("Tolak pengajuan aksi ini?")) return;

    // Ubah status pengajuan menjadi rejected
    const allPengajuan = JSON.parse(localStorage.getItem("pengajuanAksiList") || "[]");
    const updatedAllPengajuan = allPengajuan.map(p => 
      p.id === pengajuan.id 
        ? { ...p, status: "rejected", rejectionDate: new Date().toISOString() }
        : p
    );
    localStorage.setItem("pengajuanAksiList", JSON.stringify(updatedAllPengajuan));

    loadPengajuanAksi(); // Reload pengajuan list
    setShowPengajuanDetailModal(false);
    alert("❌ Pengajuan aksi telah ditolak.");
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number || 0);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("aksi-berjalan")}
          className={`pb-3 font-semibold transition ${
            activeTab === "aksi-berjalan"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Aksi Berjalan
        </button>
        <button
          onClick={() => setActiveTab("permintaan-persetujuan")}
          className={`pb-3 font-semibold transition ${
            activeTab === "permintaan-persetujuan"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Permintaan Persetujuan ({pengajuanAksiList.length})
        </button>
      </div>

      {/* TAB 1: AKSI BERJALAN */}
      {activeTab === "aksi-berjalan" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/admin/tambah-aksi")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Tambah Aksi
            </button>
          </div>

      {/* Aksi List */}
      {aksiList.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 mb-4">Belum ada aksi. Tambahkan aksi baru.</p>
          <button
            onClick={() => navigate("/admin/tambah-aksi")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Tambah Aksi Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aksiList.map((aksi) => (
            <div 
              key={aksi.id} 
              className="bg-white rounded-xl border overflow-hidden cursor-pointer transition hover:shadow-lg"
              onClick={() => {
                setSelectedAksi(aksi);
                setShowDetailModal(true);
              }}
            >
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-start gap-3 mb-2 h-[10vh]">
                    <h3 className="text-md font-semibold text-gray-900 flex-1">{aksi.judul}</h3>
                  </div>
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

                {aksi.image && (
                  <img
                    src={aksi.image}
                    alt={aksi.judul}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                {/* Donasi Progress */}
                {(aksi.kategori?.includes("Uang") || aksi.tipe?.includes("Uang")) && (
                  <div className="mb-3">
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

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-3xl my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h3 className="text-2xl text-black font-bold">Edit Aksi</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto hide-scrollbar">

              <div className="space-y-6">
                {/* Judul */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Aksi</label>
                  <input
                    type="text"
                    value={editForm.judul}
                    onChange={(e) => setEditForm({ ...editForm, judul: e.target.value })}
                    className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    value={editForm.deskripsi}
                    onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })}
                    className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Kategori</label>
                  <div className="space-y-2">
                    {["Uang", "Barang", "Jasa"].map((kategori) => (
                      <label key={kategori} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.kategori.includes(kategori)}
                          onChange={() => handleKategoriChange(kategori)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{kategori}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Target & Donasi Terkumpul - Only if Uang */}
                {editForm.kategori.includes("Uang") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Donasi (Rp)</label>
                      <input
                        type="text"
                        value={editForm.targetDonasi}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setEditForm({ ...editForm, targetDonasi: value });
                        }}
                        className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Donasi Terkumpul (Rp)</label>
                      <input
                        type="text"
                        value={editForm.donasiTerkumpul}
                        disabled
                        className="w-full text-gray-500 bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Barang Dibutuhkan */}
                {editForm.kategori.includes("Barang") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Barang yang Dibutuhkan
                    </label>
                    <input
                      type="text"
                      value={barangInput}
                      onChange={(e) => setBarangInput(e.target.value)}
                      onKeyDown={handleAddBarang}
                      className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ketik nama barang dan tekan Enter"
                    />
                    <p className="mt-1 text-xs text-gray-500">Tekan Enter untuk menambahkan barang</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {editForm.barangDibutuhkan.map((item, index) => (
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

                {/* Jasa Dibutuhkan */}
                {editForm.kategori.includes("Jasa") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jasa yang Dibutuhkan
                    </label>
                    <input
                      type="text"
                      value={jasaInput}
                      onChange={(e) => setJasaInput(e.target.value)}
                      onKeyDown={handleAddJasa}
                      className="w-full text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ketik jasa yang dibutuhkan dan tekan Enter"
                    />
                    <p className="mt-1 text-xs text-gray-500">Tekan Enter untuk menambahkan jasa</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {editForm.jasaDibutuhkan.map((item, index) => (
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full cursor-pointer text-black bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditutup">Ditutup</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className=" bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex space-x-3 rounded-b-lg">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
                >
                  Simpan Perubahan
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="px-6 text-black py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Batal
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

      {/* Detail Modal */}
      {showDetailModal && selectedAksi && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">Detail Aksi</h3>
              <button
                onClick={() => setShowDetailModal(false)}
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
                <p className="text-lg font-semibold text-gray-900">{selectedAksi.judul}</p>
              </div>

              {/* Deskripsi */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Deskripsi</h4>
                <p className="text-gray-700 max-h-[10vh] whitespace-pre-wrap line-clamp-3">{selectedAksi.deskripsi}</p>
              </div>

              {/* Kategori & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Kategori</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedAksi.kategori || selectedAksi.tipe?.split(", ") || []).map((kat, idx) => (
                      <span key={idx} className={`px-3 py-1 rounded-full text-sm ${getBadgeColor(kat)}`}>
                        {kat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedAksi.status === "aktif"
                      ? "bg-green-100 text-green-700"
                      : selectedAksi.status === "selesai"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {selectedAksi.status === "aktif" ? "Aktif" : selectedAksi.status === "selesai" ? "Selesai" : "Ditutup"}
                  </span>
                </div>
              </div>

              {/* Gambar */}
              {selectedAksi.image && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Gambar</h4>
                  <img src={selectedAksi.image} alt={selectedAksi.judul} className="w-full h-64 object-cover rounded-lg" />
                </div>
              )}

              {/* Donasi Info */}
              {(selectedAksi.kategori?.includes("Uang") || selectedAksi.tipe?.includes("Uang")) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Donasi</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="font-semibold text-blue-600">{formatRupiah(selectedAksi.targetDonasi)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Terkumpul:</span>
                      <span className="font-semibold text-gray-500">{formatRupiah(selectedAksi.donasiTerkumpul)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            ((selectedAksi.donasiTerkumpul || 0) / (selectedAksi.targetDonasi || 1)) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Barang */}
              {(selectedAksi.kategori?.includes("Barang") || selectedAksi.tipe?.includes("Barang")) && selectedAksi.barangDibutuhkan?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Barang Dibutuhkan</h4>
                  <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
                    {(typeof selectedAksi.barangDibutuhkan === 'string' 
                      ? selectedAksi.barangDibutuhkan.split(", ") 
                      : selectedAksi.barangDibutuhkan).map((barang, idx) => (
                      <li key={idx} className="border border-gray-400 rounded-full py-1.5 px-4">{barang}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Jasa */}
              {(selectedAksi.kategori?.includes("Jasa") || selectedAksi.tipe?.includes("Jasa")) && selectedAksi.jasaDibutuhkan?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Jasa Dibutuhkan</h4>
                  <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
                    {(typeof selectedAksi.jasaDibutuhkan === 'string' 
                      ? selectedAksi.jasaDibutuhkan.split(", ") 
                      : selectedAksi.jasaDibutuhkan).map((jasa, idx) => (
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
                  setShowDetailModal(false);
                  handleEdit(selectedAksi);
                }}
                className="bg-blue-50 text-blue-700 border border-blue-700 px-4 py-2 rounded-full hover:bg-blue-100 transition font-medium text-sm"
              >
                Edit Detail
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedAksiId(selectedAksi.id);
                  setShowTransparansiForm(true);
                }}
                className="bg-purple-50 text-purple-700 border border-purple-700 px-4 py-2 rounded-full hover:bg-purple-100 transition font-medium text-sm"
              >
                Transparansi
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleStatusToggle(selectedAksi);
                }}
                className={`px-4 py-2 rounded-full transition font-medium text-sm ${
                  selectedAksi.status === "aktif"
                    ? "bg-green-50 text-green-700 border border-green-700 hover:bg-green-100"
                    : "bg-blue-50 text-blue-700 border border-blue-700 hover:bg-blue-100"
                }`}
              >
                {selectedAksi.status === "aktif" ? "Selesaikan" : "Aktifkan"}
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleDelete(selectedAksi.id);
                }}
                className="bg-red-50 text-red-700 border border-red-700 px-4 py-2 rounded-full hover:bg-red-100 transition font-medium text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      )}

      {/* TAB 2: PERMINTAAN PERSETUJUAN */}
      {activeTab === "permintaan-persetujuan" && (
        <div className="space-y-6">
          {pengajuanAksiList.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500">Tidak ada permintaan persetujuan aksi saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pengajuanAksiList.map((pengajuan) => (
                <div 
                  key={pengajuan.id} 
                  className="bg-white rounded-xl border overflow-hidden cursor-pointer transition hover:shadow-lg"
                  onClick={() => {
                    setSelectedPengajuan(pengajuan);
                    setShowPengajuanDetailModal(true);
                  }}
                >
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-start gap-3 mb-2 h-[10vh]">
                        <h3 className="text-md font-semibold text-gray-900 flex-1">{pengajuan.judul}</h3>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-between">
                        <div className="flex flex-wrap gap-1">
                          {(pengajuan.kategori || pengajuan.tipe?.split(", ") || []).map((kat, idx) => (
                            <span key={idx} className={`px-2 py-1 text-xs rounded-full ${getBadgeColor(kat)}`}>
                              {kat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 text-sm text-gray-600">
                      <p><strong>Pengusul:</strong> {pengajuan.createdBy}</p>
                      <p><strong>Email:</strong> {pengajuan.createdByEmail}</p>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pengajuan.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: Detail Pengajuan Aksi */}
      {showPengajuanDetailModal && selectedPengajuan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
            <div className="sticky top-0 bg-white border-b flex items-center justify-between p-6">
              <h3 className="text-lg font-bold text-gray-900">Detail Pengajuan Aksi</h3>
              <button
                onClick={() => setShowPengajuanDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              {/* Pengusul Info */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-gray-900">Informasi Pengusul</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Nama</p>
                    <p className="font-medium text-gray-900">{selectedPengajuan.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedPengajuan.createdByEmail}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Nomor HP</p>
                    <p className="font-medium text-gray-900">{selectedPengajuan.createdByPhone}</p>
                  </div>
                </div>
              </div>

              {/* Aksi Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Detail Aksi</h4>
                <div>
                  <p className="text-sm text-gray-600">Judul</p>
                  <p className="font-medium text-gray-900">{selectedPengajuan.judul}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deskripsi</p>
                  <p className="text-gray-700">{selectedPengajuan.deskripsi}</p>
                </div>
              </div>

              {/* Kategori */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Kategori</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedPengajuan.kategori || []).map((kat) => (
                    <span
                      key={kat}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(kat)}`}
                    >
                      {kat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Target Donasi */}
              {selectedPengajuan.kategori?.includes("Uang") && (
                <div>
                  <p className="text-sm text-gray-600">Target Donasi</p>
                  <p className="font-medium text-gray-900">{formatRupiah(selectedPengajuan.targetDonasi)}</p>
                </div>
              )}

              {/* Barang */}
              {selectedPengajuan.kategori?.includes("Barang") && selectedPengajuan.barangDibutuhkan && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Barang Dibutuhkan</p>
                  <p className="text-gray-700">{selectedPengajuan.barangDibutuhkan}</p>
                </div>
              )}

              {/* Jasa */}
              {selectedPengajuan.kategori?.includes("Jasa") && selectedPengajuan.jasaDibutuhkan && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Jasa Dibutuhkan</p>
                  <p className="text-gray-700">{selectedPengajuan.jasaDibutuhkan}</p>
                </div>
              )}

              {/* Gambar */}
              {selectedPengajuan.image && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Gambar Aksi</p>
                  <img
                    src={selectedPengajuan.image}
                    alt={selectedPengajuan.judul}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPengajuanDetailModal(false);
                    handleRejectPengajuan(selectedPengajuan);
                  }}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Tolak Pengajuan
                </button>
                <button
                  onClick={() => {
                    setShowPengajuanDetailModal(false);
                    handleApprovePengajuan(selectedPengajuan);
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Setujui Pengajuan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaAksi;
