import React from "react";
import Navbar from "../components/Navbar";

const Relawan = () => {
  const benefits = [
    {
      icon: "📚",
      title: "Kelas Relawan",
      description: "Akses gratis ke berbagai kelas dan pelatihan untuk mengembangkan keterampilan sosial dan kepemimpinan Anda."
    },
    {
      icon: "🎯",
      title: "Visi on Demand",
      description: "Pilih program relawan sesuai passion dan jadwal Anda. Fleksibilitas penuh untuk berkontribusi."
    },
    {
      icon: "🌐",
      title: "Jaringan Luas",
      description: "Bergabung dengan komunitas relawan dari berbagai latar belakang dan bangun network yang berharga."
    },
    {
      icon: "📋",
      title: "Latihan Interview Dengan Mentor Kelas",
      description: "Bimbingan langsung dari mentor berpengalaman untuk mengasah kemampuan dan mempersiapkan diri Anda."
    },
    {
      icon: "✅",
      title: "VISA",
      description: "Mendapatkan sertifikat dan pengakuan resmi atas kontribusi Anda sebagai relawan aktif."
    },
    {
      icon: "💼",
      title: "Jaminan Ekspektasi",
      description: "Program relawan terstruktur dengan target dan pencapaian yang jelas untuk setiap kegiatan."
    },
    {
      icon: "🎓",
      title: "Pelatihan Skill Teknis",
      description: "Pelatihan berbasis kompetensi untuk meningkatkan keahlian yang berguna di dunia profesional."
    },
    {
      icon: "🚀",
      title: "Ujian Simulasi Jarak Aplikasi EPS",
      description: "Simulasi dan evaluasi berkala untuk mengukur progress dan dampak kontribusi Anda."
    }
  ];

  const learningSystem = [
    {
      title: "Ubiquitous Based Tests (UBT)",
      description: "Sistem pembelajaran berbasis tes yang fleksibel dan dapat diakses kapan saja, memungkinkan relawan belajar sesuai kecepatan mereka sendiri."
    },
    {
      title: "Ubiquitous Based Learning (UBL)",
      description: "Platform pembelajaran yang dapat diakses dari mana saja dengan materi yang disesuaikan dengan kebutuhan dan tingkat kemampuan setiap relawan."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Pendaftaran",
      description: "Daftar sebagai relawan melalui formulir online dan lengkapi profil Anda."
    },
    {
      number: "02",
      title: "Ujian EPS TOPIK",
      description: "Ikuti tes kompetensi untuk mengetahui keterampilan dan bidang yang sesuai dengan Anda."
    },
    {
      number: "03",
      title: "Tes Praktik",
      description: "Praktikkan keterampilan Anda melalui simulasi dan proyek percobaan."
    },
    {
      number: "04",
      title: "Review Hasil",
      description: "Dapatkan feedback dan evaluasi dari mentor untuk meningkatkan kemampuan Anda."
    },
    {
      number: "05",
      title: "Wawancara VISA",
      description: "Interview untuk memastikan kesiapan Anda bergabung dalam program relawan aktif."
    },
    {
      number: "06",
      title: "Seminar & Webinar",
      description: "Ikuti seminar dan webinar untuk memperluas wawasan tentang isu sosial terkini."
    },
    {
      number: "07",
      title: "Mengunjungi ke Komunitas",
      description: "Terjun langsung ke komunitas untuk memberikan dampak nyata dan membantu mereka yang membutuhkan."
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
      question: "Apa itu LETI?",
      answer: "LETI (Learn, Engage, Transform, Impact) adalah metode pembelajaran RuangBerbagi yang dirancang untuk mengembangkan kompetensi relawan secara menyeluruh."
    },
    {
      question: "Apa Itu EPS TOPIK?",
      answer: "EPS TOPIK adalah sistem evaluasi kompetensi yang digunakan untuk mengukur kemampuan dan kesiapan relawan dalam berkontribusi pada program-program sosial."
    },
    {
      question: "Kapan dan Dimana tes EPS TOPIK diselenggarakan?",
      answer: "Tes EPS TOPIK diselenggarakan secara online setiap bulan dan dapat diakses dari mana saja melalui platform RuangBerbagi."
    },
    {
      question: "Apa saja syarat pendaftaran mengikuti EPS TOPIK?",
      answer: "Syarat pendaftaran meliputi: minimal usia 18 tahun, memiliki KTP/identitas valid, mengisi formulir pendaftaran lengkap, dan memiliki komitmen untuk berkontribusi minimal 3 bulan."
    },
    {
      question: "Bagaimana jika tidak lulus mengikuti seleksi tahap kedua maupun tahap ketiga?",
      answer: "Anda dapat mengikuti tes ulang setelah 1 bulan dan kami akan memberikan feedback serta rekomendasi untuk persiapan yang lebih baik."
    },
    {
      question: "Bagaimana mekanisme pembelanjaan biaya di LETI?",
      answer: "Seluruh biaya pelatihan LETI ditanggung oleh RuangBerbagi. Relawan tidak perlu mengeluarkan biaya apapun untuk mengikuti program."
    },
    {
      question: "Apakah mesti bisa memahami bahasa asing dengan lancar?",
      answer: "Tidak wajib. Kemampuan bahasa Indonesia yang baik sudah cukup. Namun, kemampuan bahasa asing akan menjadi nilai tambah."
    },
    {
      question: "Apa Formulir suka bulak sukak validasi pergantian bisa?",
      answer: "Ya, formulir dapat divalidasi dan diperbaiki jika ada kesalahan data. Anda bisa menghubungi tim kami untuk melakukan perubahan."
    },
    {
      question: "Bila kami memiliki anak baik makakah validasi pergantian bisa?",
      answer: "Program relawan kami fleksibel dan memahami komitmen keluarga. Anda dapat menyesuaikan jadwal volunteer dengan kondisi pribadi."
    },
    {
      question: "Bila ingin mengubah program EPS di 5 harus simp yang harus dilakukan?",
      answer: "Anda dapat mengajukan perubahan program melalui dashboard relawan atau menghubungi koordinator program untuk panduan lebih lanjut."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 relative bg-cover bg-center min-h-[90vh]" style={{ backgroundImage: "url('/images/aksi.jpg')" }}>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  Bersama sejak 2023 • Lebih dari 1.000 Relawan
                </div>
                <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                  Tingkatkan Potensi dan Peluang Berkontribusi di Masyarakat!
                </h1>
                <p className="text-white text-lg mb-8">
                  Bergabunglah dengan program relawan RuangBerbagi dan dapatkan pengalaman berharga, 
                  pelatihan gratis, serta kesempatan untuk membuat dampak nyata di komunitas. Mulai 
                  perjalanan Anda sebagai agen perubahan sosial hari ini!
                </p>
                <div className="flex gap-4">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-lg">
                    Daftar Sekarang
                  </button>
                  <button className="border-2 border-gray-300 text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition font-medium">
                    ▶ Tonton Video
                  </button>
                </div>
                <div className="mt-8 text-sm text-gray-300">
                  Didukung oleh:
                </div>
                <div className="flex gap-8 mt-4 items-center opacity-80">
                  <div className="text-gray-200 font-semibold">Partner 1</div>
                  <div className="text-gray-200 font-semibold">Partner 2</div>
                  <div className="text-gray-200 font-semibold">Partner 3</div>
                </div>
              </div>

              {/* Right Content - Illustration */}
              <div className="relative hidden lg:block">
                <div className="bg-white/10 backdrop-blur rounded-3xl p-8 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-white font-medium">Ilustrasi Relawan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Free Class Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                ✨ Kelas Spesial
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Jadwal Kelas Online Gratis</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ikuti kelas online gratis kami dan tingkatkan kompetensi Anda sebagai relawan
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    RB
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Kelas: Dasar-dasar Relawan</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>📅 Sabtu, 20 Jun 2025</span>
                      <span className="mx-2">•</span>
                      <span>🕐 14:00 WIB</span>
                    </div>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap">
                  Daftar Sekarang
                </button>
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Lihat seluruh jadwal →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Dari Persiapan Hingga Berangkat Kerja di Komunitas, Semua yang Anda Butuhkan Ada Disini!
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600">📝</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Pelatihan Gratis</h3>
                      <p className="text-gray-600 text-sm">
                        Dapatkan akses ke berbagai pelatihan dan workshop untuk meningkatkan 
                        kemampuan dan kesiapan Anda sebagai relawan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{benefit.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-sm">{benefit.title}</h3>
                        <p className="text-gray-600 text-xs leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Learning System Section */}
        <section className="py-16 px-4 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Sistem Pembelajaran</h2>
              <p className="text-blue-200 max-w-2xl mx-auto">
                Metode pembelajaran modern yang disesuaikan dengan kebutuhan relawan masa kini
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {learningSystem.map((system, index) => (
                <div key={index} className="bg-white/10 backdrop-blur rounded-2xl p-8 hover:bg-white/20 transition">
                  <div className="bg-yellow-100 rounded-xl p-6 mb-6 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📚</div>
                      <p className="text-gray-700 font-medium">{system.title}</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{system.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{system.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tahapan Menuju Kerja di Komunitas
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ikuti 7 tahapan sistematis untuk menjadi relawan profesional yang siap berkontribusi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="text-5xl font-bold text-blue-200 mb-4">{step.number}</div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full px-8 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-600">Relawan Aktif</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">500+</div>
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
                Apa Kata Mereka Tentang LETI
              </h2>
              <p className="text-gray-600">Pengalaman nyata dari para relawan kami</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
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
              <p className="text-gray-600">Temukan jawaban untuk pertanyaan umum tentang program relawan</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition cursor-pointer group">
                  <summary className="font-semibold text-gray-900 flex justify-between items-center">
                    {faq.question}
                    <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-4 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Siap Menjadi Bagian dari Perubahan?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Daftar sekarang dan mulai perjalanan Anda sebagai relawan RuangBerbagi
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-bold text-lg shadow-xl">
              Daftar Sebagai Relawan →
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Relawan;
