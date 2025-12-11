import React, { useState, useEffect } from "react";

const KelolaRelawan = () => {
  const [activeTab, setActiveTab] = useState("relawan");
  const [relawanList, setRelawanList] = useState([]);
  const [pengajuanJasaList, setPengajuanJasaList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [aksiList, setAksiList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noHp: "",
    keahlian: "",
    status: "Aktif",
  });

  useEffect(() => {
    fetchRelawan();
    fetchPengajuanJasa();
    fetchAksi();
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      fetchRelawan();
      fetchPengajuanJasa();
      fetchAksi();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchAksi = () => {
    const data = JSON.parse(localStorage.getItem("aksiList") || "[]");
    setAksiList(data);
  };

  const fetchRelawan = () => {
    const data = JSON.parse(localStorage.getItem("relawanList") || "[]");
    setRelawanList(data);
  };

  const fetchPengajuanJasa = () => {
    const data = JSON.parse(localStorage.getItem("pengajuanJasaList") || "[]");
    setPengajuanJasaList(data);
    console.log("Data pengajuan jasa dimuat:", data);
  };

  const handleApprovePengajuanJasa = (id) => {
    const pengajuan = pengajuanJasaList.find(p => p.id === id);
    if (!pengajuan) return;

    // Hapus dari pengajuanJasaList
    const updatedList = pengajuanJasaList.filter(p => p.id !== id);
    localStorage.setItem("pengajuanJasaList", JSON.stringify(updatedList));
    setPengajuanJasaList(updatedList);

    // Tambahkan ke relawan list
    const newRelawan = {
      id: pengajuan.id,
      nama: pengajuan.nama,
      email: pengajuan.email,
      noHp: pengajuan.noHp,
      keahlian: pengajuan.deskripsi,
      status: "Aktif",
      dariPengajuanJasa: true,
      tanggalDibuatRelawan: new Date().toLocaleDateString("id-ID"),
    };
    
    const updatedRelawanList = [...relawanList, newRelawan];
    localStorage.setItem("relawanList", JSON.stringify(updatedRelawanList));
    setRelawanList(updatedRelawanList);

    console.log(`✅ Pengajuan jasa diterima dan relawan baru ditambahkan:`, newRelawan);
    alert(`Pengajuan diterima! Data relawan telah ditambahkan.\nEmail notifikasi dikirim ke ${pengajuan.email}`);
  };

  const handleRejectPengajuanJasa = (id) => {
    const pengajuan = pengajuanJasaList.find(p => p.id === id);
    if (!pengajuan) return;

    const reason = prompt("Alasan penolakan:");
    if (reason === null) return;

    // Hapus dari pengajuanJasaList
    const updatedList = pengajuanJasaList.filter(p => p.id !== id);
    localStorage.setItem("pengajuanJasaList", JSON.stringify(updatedList));
    setPengajuanJasaList(updatedList);

    console.log(`✅ Pengajuan jasa ditolak. Email dikirim ke ${pengajuan.email}: Pengajuan jasa Anda telah DITOLAK. Alasan: ${reason}`);
    alert(`Pengajuan ditolak! Email notifikasi dikirim ke ${pengajuan.email}`);
  };

  const handleEdit = (relawan) => {
    setIsEditing(true);
    setCurrentId(relawan.id);
    setFormData({
      nama: relawan.nama,
      email: relawan.email,
      noHp: relawan.noHp,
      keahlian: relawan.keahlian,
      status: relawan.status,
    });
  };

  const handleSave = () => {
    const updatedList = relawanList.map((r) =>
      r.id === currentId ? { ...r, ...formData } : r
    );
    localStorage.setItem("relawanList", JSON.stringify(updatedList));
    setRelawanList(updatedList);
    handleCancel();
    alert("Data relawan berhasil diupdate!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus relawan ini?")) {
      const updatedList = relawanList.filter((r) => r.id !== id);
      localStorage.setItem("relawanList", JSON.stringify(updatedList));
      setRelawanList(updatedList);
      alert("Relawan berhasil dihapus!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ nama: "", email: "", noHp: "", keahlian: "", status: "Aktif" });
  };

  const handleClearAllPengajuanJasa = () => {
    if (window.confirm("Yakin ingin menghapus SEMUA data pengajuan jasa? Tindakan ini tidak dapat dibatalkan!")) {
      localStorage.setItem("pengajuanJasaList", JSON.stringify([]));
      setPengajuanJasaList([]);
      alert("Semua data pengajuan jasa berhasil dihapus!");
    }
  };

  const pendingCount = pengajuanJasaList.filter(p => p.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("relawan")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "relawan"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Data Relawan
        </button>
        <button
          onClick={() => setActiveTab("pengajuanJasa")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "pengajuanJasa"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Pengajuan Jasa {pendingCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingCount}</span>}
        </button>
      </div>

      {/* Tab: Data Relawan */}
      {activeTab === "relawan" && (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No HP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keahlian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {relawanList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Belum ada relawan terdaftar</td>
                </tr>
              ) : (
                relawanList.map((relawan) => (
                  <tr key={relawan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{relawan.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{relawan.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{relawan.noHp}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{relawan.keahlian}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          relawan.status === "Aktif"
                            ? "bg-green-50 border border-green-600 text-green-800"
                            : "bg-red-100 border border-red-600 text-red-800"
                        }`}
                      >
                        {relawan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(relawan)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(relawan.id)}
                        className="text-red-600 hover:text-red-900"
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
      )}

      {/* Tab: Pengajuan Jasa */}
      {activeTab === "pengajuanJasa" && (
        <div className="space-y-4">
          {pengajuanJasaList.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClearAllPengajuanJasa}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Bersihkan Semua Data
              </button>
            </div>
          )}
          {pengajuanJasaList.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">Tidak ada pengajuan jasa</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {pengajuanJasaList.map((pengajuan, index) => {
                const aksiName = aksiList.find(a => a.id === parseInt(pengajuan.aksi_id) || a.id === pengajuan.aksi_id)?.judul || "Aksi Tidak Ditemukan";
                return (
                  <div
                    key={pengajuan.id}
                    onClick={() => {
                      setSelectedPengajuan(pengajuan);
                      setShowDetailModal(true);
                    }}
                    className={`px-4 py-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition flex items-center gap-4 ${
                      index === 0 ? "" : ""
                    }`}
                  >
                    {/* Status dot */}
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        pengajuan.status === "pending" ? "bg-yellow-500" :
                        pengajuan.status === "diterima" ? "bg-green-500" :
                        "bg-red-500"
                      }`}></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 truncate">{pengajuan.nama}</p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                          pengajuan.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          pengajuan.status === "diterima" ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {pengajuan.status === "pending" ? "Menunggu" :
                           pengajuan.status === "diterima" ? "Diterima" : "Ditolak"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{pengajuan.email} • {aksiName}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{pengajuan.deskripsi}</p>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                      {pengajuan.tanggalPengajuan}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Relawan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
                <input
                  type="tel"
                  value={formData.noHp}
                  onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keahlian</label>
                <input
                  type="text"
                  value={formData.keahlian}
                  onChange={(e) => setFormData({ ...formData, keahlian: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal untuk Pengajuan Jasa */}
      {showDetailModal && selectedPengajuan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">Detail Pengajuan Jasa</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Nama & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Nama</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedPengajuan.nama}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedPengajuan.email}</p>
                </div>
              </div>

              {/* No HP & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">No HP</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedPengajuan.noHp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedPengajuan.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    selectedPengajuan.status === "diterima" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {selectedPengajuan.status === "pending" ? "Menunggu Review" :
                     selectedPengajuan.status === "diterima" ? "Diterima" : "Ditolak"}
                  </span>
                </div>
              </div>

              {/* Deskripsi Jasa */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Jasa yang Ditawarkan</label>
                <p className="text-gray-700">{selectedPengajuan.deskripsi}</p>
              </div>

              {/* Pengalaman */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Pengalaman</label>
                <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedPengajuan.pengalaman}</p>
                </div>
              </div>

              {/* CV Download */}
              {selectedPengajuan.cv && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">CV</label>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedPengajuan.cv;
                      link.download = `${selectedPengajuan.nama}_CV.pdf`;
                      link.click();
                    }}
                    className="px-4 py-2 bg-blue-50 border border-blue-600 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                  >
                    Download CV
                  </button>
                </div>
              )}

              {/* Aksi */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Aksi yang Dipilih</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-900 font-medium">
                    {aksiList.find(a => a.id === parseInt(selectedPengajuan.aksi_id) || a.id === selectedPengajuan.aksi_id)?.judul || "Aksi Tidak Ditemukan"}
                  </p>
                </div>
              </div>

              {/* Tanggal Pengajuan */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Pengajuan</label>
                <p className="text-gray-700">{selectedPengajuan.tanggalPengajuan}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedPengajuan.status === "pending" && (
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 grid grid-cols-2 gap-3 rounded-b-2xl">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleRejectPengajuanJasa(selectedPengajuan.id);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Tolak
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleApprovePengajuanJasa(selectedPengajuan.id);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Terima
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaRelawan;
