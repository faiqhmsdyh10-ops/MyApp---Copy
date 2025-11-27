import React from "react";
import Navbar from "../components/Navbar";

const Relawan = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">Bergabung Sebagai Relawan</h1>
          <p className="mt-4 text-green-100 max-w-2xl mx-auto">
            Jadilah bagian dari gerakan sosial kami dan buat perbedaan di komunitas Anda
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Apa itu Program Relawan?</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Program relawan kami memberikan kesempatan bagi individu yang passionate untuk
              berkontribusi langsung dalam berbagai aksi sosial. Baik itu melalui bantuan
              penyelenggaraan event, pelatihan, atau pendampingan komunitas.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Cara Bergabung</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
              <li>Isi formulir pendaftaran relawan</li>
              <li>Verifikasi data dan background check</li>
              <li>Ikuti orientasi dan pelatihan</li>
              <li>Pilih program yang sesuai dengan minat Anda</li>
              <li>Mulai berkontribusi dalam aksi sosial</li>
            </ol>

            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium">
              Daftar Sebagai Relawan
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600 border-t mt-12">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-600">RuangBerbagi</span> — Semua hak dilindungi.
      </footer>
    </div>
  );
};

export default Relawan;
