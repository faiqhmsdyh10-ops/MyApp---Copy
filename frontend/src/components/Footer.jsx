import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-gray-300 pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left: Services */}
        <div>
          <h4 className="text-xs font-semibold mb-4 tracking-widest text-gray-400">SERVICES</h4>
          <ul className="space-y-2 text-sm">
            <li>Postural correction</li>
            <li>Pain rehabilitation</li>
            <li>Functional analysis</li>
          </ul>
        </div>
        {/* Center: About & Contact */}
        <div className="flex flex-col items-center">
          <img src="/logoipsum.svg" alt="Logoipsum" className="h-8 mb-3" />
          <ul className="flex flex-wrap justify-center gap-4 text-sm mb-3">
            <li>Experts</li>
            <li>Pricing</li>
            <li>News</li>
            <li>About</li>
            <li>Contacts</li>
          </ul>
          <div className="text-center text-sm mb-2">
            <div>+1 891 989-11-91</div>
            <div>hello@logoipsum.com</div>
          </div>
          <div className="flex gap-3 justify-center mt-2 mb-2">
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222] hover:bg-[#333] transition"><span className="text-xl">🟢</span></a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222] hover:bg-[#333] transition"><span className="text-xl">✈️</span></a>
            <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222] hover:bg-[#333] transition"><span className="text-xl">▶️</span></a>
          </div>
        </div>
        {/* Right: Call Me Back */}
        <div className="flex flex-col items-end justify-between h-full">
          <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-700 transition mb-6">CALL ME BACK</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center mt-8 text-xs text-gray-400">
        <div className="mb-2 md:mb-0">© 2023 — Copyright.</div>
        <div className="flex gap-2 items-center">
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
