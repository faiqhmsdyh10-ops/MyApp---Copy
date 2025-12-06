import React from "react";
import Navbar from "../components/Navbar";

const Relawan = () => {
  const steps = [
    {
      number: "01",
      title: "Pilih Program Relawan",
      description: "Telusuri daftar aksi yang sedang berjalan dan pilih program yang sesuai minat, keahlian, atau lokasi kamu."
    },
    {
      number: "02",
      title: "Ajukan Diri",
      description: "Ajukan dirimu menjadi relawan yang dibutuhkan. Perlu diingat, kamu perlu mengisi data diri terlebih dahulu."
    },
    {
      number: "03",
      title: "Tunggu Verifikasi Tim Ruang Berbagi",
      description: "Tim kami akan meninjau pendaftaran kamu dan melakukan konfirmasi melalui email atau WhatsApp."
    },
    {
      number: "04",
      title: "Ikuti Briefing dan Pelatihan",
      description: "Kamu akan mendapatkan pengarahan terkait peran, tugas, dan jadwal kegiatan sebelum turun ke lapangan."
    },
    {
      number: "05",
      title: "Mulai Berdampak",
      description: "Bergabunglah dengan relawan lain di lokasi kegiatan, berkolaborasi, dan salurkan energi positif untuk membantu sesama."
    }
  ];

  const testimonials = [
    {
      name: "Salsabila Azzahra",
      date: "Mei 2024",
      text: "Bergabung sebagai relawan di RuangBerbagi memberikan saya pengalaman yang luar biasa. Saya bisa berkontribusi untuk masyarakat sambil mengembangkan skill saya.",
      rating: 5
    },
    {
      name: "Daftar Fauzan Firdaus",
      date: "April 2024",
      text: "Program relawan yang terstruktur dengan mentoring yang sangat membantu. Saya mendapat banyak teman baru dan pengalaman berharga.",
      rating: 5
    },
    {
      name: "Bella Handayani",
      date: "Maret 2024",
      text: "Fleksibilitas waktu dan pilihan program yang beragam membuat saya bisa tetap berkontribusi meski memiliki kesibukan lain. Sangat recommended!",
      rating: 5
    },
    {
      name: "Reyhan Saputro",
      date: "Februari 2024",
      text: "Pelatihan yang diberikan sangat berkualitas. Saya merasa lebih siap untuk terjun ke dunia profesional setelah menjadi relawan di sini.",
      rating: 5
    },
    {
      name: "Amalia Pramudita",
      date: "Januari 2024",
      text: "Mentor-mentornya sangat supportive dan program yang ada benar-benar memberi dampak nyata ke masyarakat. Bangga bisa jadi bagian dari RuangBerbagi.",
      rating: 5
    },
    {
      name: "Ardy Kresna",
      date: "Desember 2023",
      text: "Sistem pembelajaran yang modern dan interaktif. Saya bisa belajar banyak hal baru sambil membantu sesama. Win-win solution!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Apakah menjadi relawan dikenakan biaya?",
      answer: "Tidak. Semua proses pendaftaran sebagai relawan Ruang Berbagi gratis tanpa biaya apa pun."
    },
    {
      question: "Apakah saya harus memiliki keahlian khusus?",
      answer: "Tidak selalu. Beberapa aksi membutuhkan keahlian tertentu, tetapi sebagian besar kegiatan terbuka untuk siapa saja yang memiliki kemauan untuk membantu."
    },
    {
      question: "Berapa lama durasi waktu yang harus saya sediakan?",
      answer: "Durasi kegiatan bervariasi tergantung program. Informasi lengkap waktu dan lokasi akan tercantum pada halaman detail program."
    },
    {
      question: "Apakah relawan mendapatkan sertifikat?",
      answer: "Ya. Setiap relawan yang mengikuti kegiatan hingga selesai berhak mendapatkan sertifikat apresiasi dari Ruang Berbagi."
    },
    {
      question: "Apakah saya bisa ikut lebih dari satu program?",
      answer: "Tentu. Kamu dipersilakan mengikuti beberapa program selama waktunya tidak saling bertabrakan."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-inter">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 relative bg-cover bg-center min-h-[100vh]" style={{ backgroundImage: "url('/images/relawan.jpg')" }}>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-none pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center items-center pt-20 pb-10">
              {/* Left Content */}
              <div>
                <div className="inline-block bg-none text-white border border-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  Bersama sejak 2023 • Lebih dari 1.000 Relawan
                </div>
                <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                  Tingkatkan Potensi dan Peluang Berkontribusi di Masyarakat!
                </h1>
                <p className="text-white leading-relaxed mb-8">
                  Bergabunglah dengan program relawan RuangBerbagi dan dapatkan pengalaman berharga, 
                  pelatihan gratis, serta kesempatan untuk membuat dampak nyata di komunitas. Mulai 
                  perjalanan Anda sebagai agen perubahan sosial hari ini!
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="border-2 border-gray-300 text-white px-8 py-3 rounded-full hover:bg-white hover:text-gray-900 transition font-medium">
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
                  Mengenai Program Relawan Kami
                </h2>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Menjadi relawan di Ruang Berbagi berarti menjadi bagian dari gerakan kebaikan yang bertujuan memperkuat solidaritas sosial. Program ini hadir untuk menghubungkan individu yang ingin membantu dengan berbagai aksi yang membutuhkan dukungan nyata—baik berupa tenaga, keahlian, maupun waktu.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kami percaya bahwa perubahan besar selalu dimulai dari langkah sederhana: kepedulian. Dengan bergabung sebagai relawan, kamu ikut mendorong terciptanya dampak positif bagi masyarakat yang membutuhkan, sekaligus berperan dalam membangun ekosistem kolaboratif yang berkelanjutan.
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

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Content */}
              <div className="grid grid-rows-2 gap-6">
                <div className="rounded-xl pr-6 mb-6">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Benefit yang Kamu Dapatkan Sebagai Relawan
                </h2>
                  <div className="flex items-start gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">
                        Menjadi relawan bukan hanya tentang memberi, tetapi juga tentang bertumbuh. Di Ruang Berbagi, setiap relawan mendapatkan kesempatan untuk memperluas wawasan, mengasah empati, dan memperkuat kemampuan bekerja dalam tim.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="rounded-xl pr-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-50 border border-green-600 rounded-xl p-4">
                        <h3 className="font-bold text-gray-900 mb-2 text-sm">Dampak Nyata di Masyarakat</h3>
                        <p className="text-gray-600 text-sm">
                          Dengan menjadi relawan, kamu berkontribusi langsung dalam membantu sesama. Setiap aksi yang kamu lakukanakan membawa perubahan yang dirasakan oleh mereka yang membutuhkan.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl pr-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 border border-blue-600 rounded-xl p-4">
                        <h3 className="font-bold text-gray-900 mb-2 text-sm">Pengembangan Skill Kepemimpinan</h3>
                        <p className="text-gray-600 text-sm">
                          Relawan sering terlibat dalam koordinasi kegiatan, pengambilan keputusan, dan pemecahan masalah. Sehingga, membentuk kemampuan leadership yang tidak hanya berguna dalam aksi sosial, juga di dunia kerja.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 border border-purple-600 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-sm">Memperluas Relasi</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Bergabung sebagai relawan membuka kesempatan untuk bertemu orang baru dari berbagai latar belakang. Kamu akan terhubung dengan komunitas positif yang memiliki tujuan dan semangat yang sama.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-600 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-sm">Belajar Empati</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Berinteraksi langsung dengan masyarakat membuat kamu lebih memahami realitas sosial. Kamu belajar melihat dunia dari perspektif berbeda, sehingga rasa empati dan kepedulianmu semakin berkembang.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-600 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-sm">Pengalaman Berharga</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Kegiatan kerelawanan menunjukkan inisiatif, tanggung jawab, dan kemampuan bekerja sama—nilai-nilai yang sangat dihargai di dunia profesional. Ini menjadi nilai tambah kuat di CV maupun portofolio kamu.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-600 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-sm">Memberi Arti Baru pada Waktu Luang</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Daripada hanya menghabiskan waktu tanpa arah, menjadi relawan memberi makna dan tujuan yang lebih besar. Kamu bisa merasakan kepuasan batin karena tahu waktumu dipakai untuk kebaikan.</p>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Langkah Mendaftar Menjadi Relawan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="bg-gradient-to-br border from-blue-50 to-green-50 rounded-xl p-6 transition">
                  <div className="text-5xl font-bold text-blue-300 mb-4">{step.number}</div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-8 bg-blue-50 border border-blue-600 rounded-full px-6 py-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-600">Relawan Aktif</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Program Selesai</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Mereka yang Pernah Menjadi Relawan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border transition">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{testimonial.text}</p>
                </div>
              ))}
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
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="bg-white border border-gray-200 rounded-xl px-6 py-4 hover:border-blue-300 transition group cursor-pointer">
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

export default Relawan;
