import React from "react";
import Navbar from "../components/Navbar";

const TentangKami = () => {
  const values = [
    {
      title: "Donasi Uang",
      description: "Melalui RuangBerbagi, setiap donasi dapat disalurkan dengan aman dan transparan melalui metode pembayaran digital."
    },
    {
      title: "Donasi Barang",
      description: "Ruang Berbagi juga memfasilitasi donasi barang untuk memenuhi kebutuhan seperti pakaian, makanan, dan lainnya."
    },
    {
      title: "Donasi Jasa",
      description: "Kami menyediakan ruang bagi siapa pun yang ingin menyumbangkan keterampilan, tenaga, atau keahlian mereka untuk kegiatan sosial."
    }
  ];

  const milestones = [
    {
      year: "2025",
      title: "Peluncuran Platform",
      description: "RuangBerbagi dirilis, menjadi wadah inovatif untuk aksi sosial.",
      image: null
    },
    {
      year: "2025",
      title: "Program Nasional",
      description: "Ekspansi program ke 10 kota besar di Indonesia dengan 500+ aksi sosial.",
      image: "/images/profile.jpg"
    },
    {
      year: "2025",
      title: "Penghargaan Sosial",
      description: "Menerima penghargaan sebagai Platform Sosial Terbaik dari Kementerian Sosial.",
      image: "/images/about.jpg"
    },
    {
      year: "2025",
      title: "Kemitraan Strategis",
      description: "Menjalin kemitraan dengan 50+ organisasi sosial dan perusahaan untuk dampak lebih besar.",
      image: null
    }
  ];

  const faqs = [
    {
      question: "Apa visi dan misi RuangBerbagi?",
      answer: "Visi kami adalah membangun ekosistem sosial yang transparan dan berkelanjutan. Misi kami adalah menghubungkan donatur, relawan, dan penerima manfaat dalam satu platform yang aman dan mudah diakses."
    },
    {
      question: "Bagaimana cara RuangBerbagi memastikan transparansi?",
      answer: "Setiap donasi dan aksi sosial dapat dilacak secara real-time melalui dashboard kami. Kami juga rutin menerbitkan laporan dampak yang menunjukkan bagaimana dana digunakan untuk membantu masyarakat."
    },
    {
      question: "Apakah donasi saya aman di RuangBerbagi?",
      answer: "Ya. Kami menggunakan sistem pembayaran digital yang terenkripsi dan bekerja sama dengan lembaga keuangan terpercaya. Setiap transaksi tercatat dengan aman dan transparan."
    },
    {
      question: "Siapa yang bisa bergabung dengan RuangBerbagi?",
      answer: "Siapa saja bisa bergabung! Baik sebagai donatur, relawan, atau penerima manfaat. Kami terbuka untuk individu, organisasi, dan perusahaan yang ingin berkontribusi pada perubahan sosial positif."
    },
    {
      question: "Bagaimana cara mengukur dampak dari program RuangBerbagi?",
      answer: "Kami menggunakan metrik yang jelas untuk mengukur dampak setiap program, termasuk jumlah penerima manfaat, durasi dampak, dan feedback dari komunitas. Hasil ini dilaporkan secara berkala kepada semua stakeholder."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-inter">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 relative bg-cover bg-center min-h-[100vh]" style={{ backgroundImage: "url('/images/tentang.jpg')" }}>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-none pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="items-center text-center py-20">
              {/* Left Content */}
              <div className="text-center justify-center items-center">
                <div className="inline-block bg-none text-white border border-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  Berdiri sejak 2025 • Dipercaya 10.000+ Pengguna
                </div>
                <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                  Membangun Ekosistem Sosial yang <span className="pl-2 pb-2 border-r-2 text-yellow-50 rounded-l-md px-1 border-yellow-400 bg-yellow-500/40">Transparan dan Berkelanjutan</span>
                </h1>
                <p className="text-white mb-8 leading-relaxed">
                  RuangBerbagi adalah platform inovatif yang menghubungkan donatur, relawan, dan 
                  penerima manfaat dalam satu ekosistem yang transparan. Kami percaya bahwa setiap 
                  orang memiliki potensi untuk menciptakan perubahan positif di masyarakat.
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-medium shadow-lg">
                    Baca Selengkapnya
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - Pengertian RuangBerbagi */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Apa itu RuangBerbagi?
                </h2>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  RuangBerbagi adalah platform digital inovatif yang menghubungkan individu yang peduli sosial 
                  dengan mereka yang membutuhkan bantuan. Kami menciptakan ruang inklusif di mana setiap orang 
                  dapat berkontribusi sesuai kemampuannya, baik melalui donasi, keahlian, waktu, atau dedikasi.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Dengan teknologi transparan dan sistem terstruktur, kami memastikan setiap donasi dan kontribusi 
                  mencapai penerima manfaat dengan dampak maksimal. RuangBerbagi adalah gerakan bersama untuk 
                  membangun masyarakat yang lebih baik, lebih adil, dan lebih sejahtera.
                </p>
              </div>

              {/* Right Content - Image/Visual */}
              <div className="relative">
                <div className="h-[40vh] rounded-2xl p-8 bg-cover bg-center" style={{ backgroundImage: "url('/images/about.jpg')" }}>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[400px]">
              {/* Left Column - Static */}
              <div className="flex flex-col justify-start lg:sticky lg:top-0 lg:h-screen lg:pt-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Building a <span className="text-blue-600">Better Way</span> to Collaborate, One Milestone at a Time
                </h2>
                <p className="text-gray-600 text-sm max-w-xl leading-relaxed mb-8">
                  Dari awal hingga sekarang, kami terus berinovasi dan berkembang untuk memberikan 
                  dampak sosial yang lebih baik. Setiap milestone adalah bukti komitmen kami kepada 
                  masyarakat dan semua stakeholder yang percaya pada visi kami.
                </p>
              </div>

              {/* Right Column - Scrollable */}
              <div className="lg:pr-4 space-y-0 max-h-[400px] overflow-y-auto hide-scrollbar">
                {milestones.map((milestone, index) => (
                  <div key={index} className="transition flex-shrink-0 relative pb-8">
                    {/* Vertical connector line */}
                    {index < milestones.length - 1 && (
                      <div className="absolute left-2.5 top-6 w-1 h-96 bg-gray-100"></div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className="w-6 h-6 bg-blue-100 border-2 border-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 relative z-10"></div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-0">
                        <div className="text-blue-600 font-bold text-md mb-2">{milestone.year}</div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{milestone.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{milestone.description}</p>
                        
                        {/* Image below description - optional */}
                        {milestone.image && (
                          <div className="mt-4 rounded-lg overflow-hidden h-64 bg-gray-200">
                            <img 
                              src={milestone.image} 
                              alt={milestone.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Title and Image */}
              <div className="items-start">
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Cara Kami Berdonasi
                </h2>
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  RuangBerbagi memudahkan Anda untuk berdonasi dengan cara yang transparan dan terstruktur. 
                  Pilih metode donasi yang sesuai dengan Anda, pantau penggunaan dana secara real-time, 
                  dan lihat dampak positif yang Anda ciptakan di masyarakat.
                </p>
                
                {/* Image Placeholder */}
                <div className="relative">
                  <div className="h-[45vh] rounded-2xl p-8 bg-cover bg-center" style={{ backgroundImage: "url('/images/about.jpg')" }}>
                  </div>
                </div>
              </div>

              {/* Right Column - Values Cards (Variable Height, Right Aligned) */}
              <div className="space-y-2 pt-16">
                {/* First Row */}
                <div className="flex justify-end">
                  <div className="bg-green-50 border border-green-600 rounded-2xl p-6 transition max-w-lg">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{values[0]?.title || "Integritas"}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{values[0]?.description || ""}</p>
                  </div>
                </div>

                {/* Second Row */}
                <div className="flex justify-end">
                  <div className="bg-blue-50 border border-blue-600 rounded-2xl p-6 transition max-w-md">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{values[1]?.title || "Empati"}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{values[1]?.description || ""}</p>
                  </div>
                </div>

                {/* Third Row */}
                <div className="flex justify-end">
                  <div className="bg-purple-50 border border-purple-600 rounded-2xl p-6 transition max-w-lg">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{values[2]?.title || "Kolaborasi"}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{values[2]?.description || ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Partner Kami</h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
              Bekerja sama dengan berbagai organisasi dan perusahaan untuk dampak yang lebih besar
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-bold">Partner 1</span>
              </div>
              <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-bold">Partner 2</span>
              </div>
              <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-bold">Partner 3</span>
              </div>
              <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-bold">Partner 4</span>
              </div>
              <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-bold">Partner 5</span>
              </div>
            </div>
          </div>
        </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan Yang Sering Ditanyakan
            </h2>
            <p className="text-gray-600 text-lg">
              Temukan jawaban atas pertanyaan umum tentang RuangBerbagi dan bagaimana kami bekerja.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition group cursor-pointer">
                <summary className="font-semibold text-gray-900 flex justify-between items-center select-none">
                  {faq.question}
                  <svg
                    className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform duration-300 flex-shrink-0 ml-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left - Text & CTA */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Yuk, Jadi Bagian dari Perubahan!</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Mulai langkah kecilmu hari ini. Karena kebaikan gak harus nungguin kaya, cukup niat dan tik aja.
              </p>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition font-medium">
                  Mulai Donasi Sekarang
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition font-medium">
                  Gabung Jadi Relawan
                </button>
              </div>
            </div>

            {/* Right - Charity Image */}
            <div className="flex justify-center">
              <div 
                className="w-full h-96 bg-gray-300 rounded-3xl bg-cover bg-center"
                style={{ backgroundImage: "url('/images/charity.jpg')" }}
              >
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default TentangKami;
