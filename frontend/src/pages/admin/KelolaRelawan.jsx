import React, { useState, useEffect } from "react";

const KelolaRelawan = () => {
  const [activeTab, setActiveTab] = useState("relawan");
  const [relawanList, setRelawanList] = useState([]);
  const [pengajuanJasaList, setPengajuanJasaList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noHp: "",
    keahlian: "",
    status: "aktif",
  });

  useEffect(() => {
    fetchRelawan();
    fetchPengajuanJasa();
    
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      fetchRelawan();
      fetchPengajuanJasa();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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
      status: "aktif",
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
    setFormData({ nama: "", email: "", noHp: "", keahlian: "", status: "aktif" });
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kelola Relawan & Pengajuan Jasa</h2>
        <p className="text-gray-600">Kelola data relawan dan review pengajuan donasi jasa</p>
      </div>

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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          relawan.status === "aktif"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
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
                🗑️ Bersihkan Semua Data
              </button>
            </div>
          )}
          {pengajuanJasaList.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">Tidak ada pengajuan jasa</p>
            </div>
          ) : (
            pengajuanJasaList.map((pengajuan) => (
              <div key={pengajuan.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Nama</p>
                    <p className="text-lg font-semibold text-gray-900">{pengajuan.nama}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-lg font-semibold text-gray-900">{pengajuan.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">No HP</p>
                    <p className="text-lg font-semibold text-gray-900">{pengajuan.noHp}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                    <p className={`text-lg font-semibold ${
                      pengajuan.status === "pending" ? "text-yellow-600" :
                      pengajuan.status === "diterima" ? "text-green-600" :
                      "text-red-600"
                    }`}>
                      {pengajuan.status === "pending" ? "Menunggu Review" :
                       pengajuan.status === "diterima" ? "Diterima" : "Ditolak"}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Deskripsi Jasa</p>
                  <p className="text-gray-700">{pengajuan.deskripsi}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Ketersediaan</p>
                  <p className="text-gray-700">{pengajuan.ketersediaan}</p>
                </div>

                {pengajuan.status === "ditolak" && pengajuan.alasanPenolakan && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-xs text-red-600 uppercase tracking-wide mb-1">Alasan Penolakan</p>
                    <p className="text-red-700">{pengajuan.alasanPenolakan}</p>
                  </div>
                )}

                {pengajuan.status === "pending" && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleApprovePengajuanJasa(pengajuan.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => handleRejectPengajuanJasa(pengajuan.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      Tolak
                    </button>
                  </div>
                )}

                {pengajuan.status !== "pending" && (
                  <div className="text-sm text-gray-500 mt-4">
                    {pengajuan.status === "diterima" && `Diterima pada: ${pengajuan.tanggalDisetujui}`}
                    {pengajuan.status === "ditolak" && `Ditolak pada: ${pengajuan.tanggalDitolak}`}
                  </div>
                )}
              </div>
            ))
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
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
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
    </div>
  );
};

export default KelolaRelawan;
