import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Beranda", path: "/" },
    { label: "Aksi Berjalan", path: "/aksi-berjalan" },
    { label: "Relawan", path: "/relawan" },
    { label: "Tentang Kami", path: "/tentang-kami" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-md border-b border-gray-200">
      <div className="mx-auto flex items-center justify-between max-w-7xl px-6 py-4">
        <div className="flex items-center">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center bg-white space-x-2 text-lg font-bold text-gray-800 hover:bg-white"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              RB
            </span>
            <span>RuangBerbagi</span>
          </button>

          {/* Menu Items (immediately to the right of logo) */}
          <div className="hidden md:flex items-center space-x-6 ml-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`font-medium whitespace-nowrap transition-colors px-2 py-1 rounded ${
                  isActive(item.path)
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right side (login button) */}
        <div className="hidden md:flex items-center">
          <button onClick={() => navigate('/login')} className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
            Masuk
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
