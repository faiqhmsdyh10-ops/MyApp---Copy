import React from "react";
import Navbar from "../components/Navbar";

const TentangKami = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">Tentang RuangBerbagi</h1>
          <p className="mt-4 text-purple-100 max-w-2xl mx-auto">
            Kami adalah platform yang menghubungkan hati nurani untuk menciptakan perubahan sosial
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {/* Visi & Misi */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Menciptakan ekosistem sosial yang inklusif, transparan, dan berkelanjutan di mana
              setiap individu dapat berkontribusi sesuai dengan kemampuan mereka untuk membangun
              masyarakat yang lebih baik.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>Mempermudah akses informasi tentang kebutuhan sosial di komunitas</li>
              <li>Menghubungkan donatur dengan penerima manfaat secara transparan</li>
              <li>Memberdayakan masyarakat melalui program-program berkelanjutan</li>
              <li>Membangun kepercayaan dan akuntabilitas dalam setiap transaksi sosial</li>
            </ul>
          </div>

          {/* Nilai-Nilai */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nilai-Nilai Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Integritas", desc: "Kami berkomitmen pada kejujuran dan transparansi" },
                { title: "Dampak", desc: "Setiap aksi kami dirancang untuk menciptakan perubahan nyata" },
                { title: "Inklusivitas", desc: "Kami membuka peluang bagi semua orang untuk berkontribusi" },
                { title: "Keberlanjutan", desc: "Kami fokus pada solusi jangka panjang, bukan bantuan sesaat" },
              ].map((value, idx) => (
                <div key={idx} className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-blue-600 mb-2">{value.title}</h3>
                  <p className="text-gray-700 text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tim */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tim Kami</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Kami adalah tim yang berdedikasi terdiri dari profesional sosial, teknolog, dan penggerak
              perubahan yang percaya bahwa teknologi dapat menjadi alat untuk kebaikan. Setiap anggota
              tim membawa passion dan expertise mereka untuk mewujudkan visi RuangBerbagi.
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium">
              Bergabung Dengan Tim Kami
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TentangKami;
