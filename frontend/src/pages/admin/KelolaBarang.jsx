import React, { useState, useEffect } from "react";

const KelolaBarang = () => {
  const [barangList, setBarangList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("semua");

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

  const handleTandaiDiterima = (id) => {
    const updatedList = barangList.map(b =>
      b.id === id
        ? { ...b, status: "diterima", tanggalDiterima: new Date().toLocaleDateString("id-ID") }
        : b
    );
    localStorage.setItem("donasiBarangList", JSON.stringify(updatedList));
    setBarangList(updatedList);
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

  const getFilteredBarang = () => {
    if (filterStatus === "semua") return barangList;
    return barangList.filter(b => b.status === filterStatus);
  };

  const filteredBarang = getFilteredBarang();
  const barangBelumDiterima = barangList.filter(b => b.status === "belum diterima").length;
  const barangSudahDiterima = barangList.filter(b => b.status === "diterima").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kelola Donasi Barang</h2>
        <p className="text-gray-600">Kelola dan track barang donasi yang telah dikirimkan</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Total Barang</p>
          <p className="text-4xl font-bold text-blue-600">{barangList.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Belum Diterima</p>
          <p className="text-4xl font-bold text-yellow-600">{barangBelumDiterima}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-2">Sudah Diterima</p>
          <p className="text-4xl font-bold text-green-600">{barangSudahDiterima}</p>
        </div>
      </div>

      {/* Filter */}
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
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
                  Tidak ada data barang donasi
                </td>
              </tr>
            ) : (
              filteredBarang.map((barang) => (
                <tr key={barang.id} className="hover:bg-gray-50">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {barang.status === "belum diterima" && (
                      <button
                        onClick={() => handleTandaiDiterima(barang.id)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Terima
                      </button>
                    )}
                    <button
                      onClick={() => handleHapus(barang.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
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
    </div>
  );
};

export default KelolaBarang;
