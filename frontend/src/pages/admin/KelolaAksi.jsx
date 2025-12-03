import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const KelolaAksi = () => {
  const navigate = useNavigate();
  const [aksiList, setAksiList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
  }, []);

  const loadAksi = () => {
    const stored = JSON.parse(localStorage.getItem("aksiList") || "[]");
    setAksiList(stored);
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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kelola Aksi</h2>
          <p className="text-gray-600">Kelola semua aksi sosial yang sedang berjalan</p>
        </div>
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
        <div className="grid grid-cols-1 gap-6">
          {aksiList.map((aksi) => (
            <div key={aksi.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{aksi.judul}</h3>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          aksi.status === "aktif"
                            ? "bg-green-100 text-green-700"
                            : aksi.status === "selesai"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {aksi.status === "aktif" ? "🟢 Sedang Berjalan" : aksi.status === "selesai" ? "✅ Selesai" : "⏸️ Ditutup"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{aksi.deskripsi}</p>
                    <div className="flex flex-wrap gap-2">
                      {(aksi.kategori || aksi.tipe?.split(", ") || []).map((kat, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {kat}
                        </span>
                      ))}
                    </div>
                  </div>
                  {aksi.image && (
                    <img
                      src={aksi.image}
                      alt={aksi.judul}
                      className="w-32 h-32 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>

                {/* Donasi Progress */}
                {(aksi.kategori?.includes("Uang") || aksi.tipe?.includes("Uang")) && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Dana Terkumpul</span>
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

                {/* Barang Dibutuhkan */}
                {aksi.barangDibutuhkan && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">📦 Barang yang Dibutuhkan:</p>
                    <div className="flex flex-wrap gap-2">
                      {(typeof aksi.barangDibutuhkan === 'string' 
                        ? aksi.barangDibutuhkan.split(", ")
                        : aksi.barangDibutuhkan
                      ).filter(b => b.trim()).map((item, idx) => (
                        <span key={idx} className="px-3 py-1 text-sm bg-orange-50 text-orange-700 rounded-full border border-orange-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Jasa Dibutuhkan */}
                {aksi.jasaDibutuhkan && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">🛠️ Jasa yang Dibutuhkan:</p>
                    <div className="flex flex-wrap gap-2">
                      {(typeof aksi.jasaDibutuhkan === 'string' 
                        ? aksi.jasaDibutuhkan.split(", ")
                        : aksi.jasaDibutuhkan
                      ).filter(j => j.trim()).map((item, idx) => (
                        <span key={idx} className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(aksi)}
                    className="flex-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
                  >
                    ✏️ Edit Detail
                  </button>
                  <button
                    onClick={() => handleStatusToggle(aksi)}
                    className={`flex-1 px-4 py-2 rounded-lg transition font-medium ${
                      aksi.status === "aktif"
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    {aksi.status === "aktif" ? "✓ Tandai Selesai" : "↻ Aktifkan Kembali"}
                  </button>
                  <button
                    onClick={() => handleDelete(aksi.id)}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium"
                  >
                    🗑️ Hapus
                  </button>
                </div>
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
              <h3 className="text-2xl font-bold">Edit Aksi</h3>
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
            
            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">

              <div className="space-y-6">
                {/* Judul */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Aksi</label>
                  <input
                    type="text"
                    value={editForm.judul}
                    onChange={(e) => setEditForm({ ...editForm, judul: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    value={editForm.deskripsi}
                    onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Donasi Terkumpul (Rp)</label>
                      <input
                        type="text"
                        value={editForm.donasiTerkumpul}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setEditForm({ ...editForm, donasiTerkumpul: value });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditutup">Ditutup</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex space-x-3 rounded-b-lg">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Simpan Perubahan
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Batal
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
