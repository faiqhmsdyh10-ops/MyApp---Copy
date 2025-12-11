import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to change navbar background
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    onScroll(); // initial
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Check login status
    const loggedIn = localStorage.getItem("isLoggedIn");
    const userDataStr = localStorage.getItem("userData");
    
    if (loggedIn && userDataStr) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(userDataStr));
    }
  }, [location]); // Re-check when location changes

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo(0, 0);
  }, [location]);

  // Add storage event listener to update userData when it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const userDataStr = localStorage.getItem("userData");
      if (userDataStr) {
        setUserData(JSON.parse(userDataStr));
      }
    };

    // Listen for custom event dispatched when userData is updated
    window.addEventListener("userDataUpdated", handleStorageChange);
    
    return () => {
      window.removeEventListener("userDataUpdated", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    setShowDropdown(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Beranda", path: "/" },
    { label: "Aksi Berjalan", path: "/aksi-berjalan" },
    { label: "Relawan", path: "/relawan" },
    { label: "Tentang Kami", path: "/tentang-kami" },
  ];

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
      <div className="flex items-center justify-between max-w-7xl px-0 mx-24 py-2">
        <div className="flex items-center">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className={`flex items-center bg-none space-x-2 font-inter text-sm font-medium ${isScrolled ? "text-gray-900" : "text-white"}`}
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
                className={`font-regular font-inter text-sm whitespace-nowrap transition-colors px-2 py-0 rounded ${
                  isActive(item.path)
                    ? isScrolled ? "text-blue-600" : "text-white"
                    : isScrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right side (login button or user menu) */}
        <div className="hidden md:flex items-center font-inter">
          {isLoggedIn && userData ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center text-sm space-x-2 ${isScrolled ? "bg-blue-50 text-blue-700" : "bg-white/20 text-white"} px-4 py-2 rounded-full hover:bg-white hover:text-black transition`}
              >
                {userData.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt="Profil"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userData.name?.charAt(0).toUpperCase() || userData.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="font-medium">
                  {userData.nickname || userData.email?.split('@')[0] || "User"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/profil");
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                  >
                    👤 Profil Saya
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/donasi-saya");
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                  >
                    💝 Donasi Saya
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                  >
                    🚪 Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className={`ml-4 ${isScrolled ? "bg-blue-600 text-white" : "bg-white/20 text-white"} px-4 py-2 rounded-full hover:bg-blue-700 transition`}
            >
              Masuk
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
