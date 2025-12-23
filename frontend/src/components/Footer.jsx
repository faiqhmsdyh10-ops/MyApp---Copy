import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-gray-300 pt-10 pb-4 font-inter">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left: Services */}
        <div>
          <h4 className="text-xs font-semibold mb-4 tracking-widest text-gray-400">Layanan</h4>
          <ul className="space-y-2 text-sm">
            <li>Donasi Uang</li>
            <li>Donasi Barang</li>
            <li>Program Relawan</li>
          </ul>
        </div>
        {/* Center: About & Contact */}
        <div className="flex flex-col items-center">
          <ul className="flex flex-wrap justify-center gap-4 text-sm mb-3">
            <li>Mulai Donasi</li>
            <li>Aksi Berjalan</li>
            <li>Relawan</li>
            <li>Tentang Kami</li>
            <li>Kontak</li>
          </ul>
          <div className="text-center text-sm mb-2">
            <div>+62 858 7040 2536</div>
            <div>hello@ruangberbagi.com</div>
          </div>
        </div>
        {/* Right: Call Me Back */}
        <div className="flex flex-col items-end justify-between h-full">
          <button className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition mb-6">Hubungi Kami</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center mt-8 text-xs text-gray-400">
        <div className="mb-2 md:mb-0">© 2025 — Copyright.</div>
        <div className="flex gap-2 items-center">
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
