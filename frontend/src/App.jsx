import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./pages/Home";
import AksiBerjalan from "./pages/AksiBerjalan";
import AksiDetail from "./pages/AksiDetail";
import Relawan from "./pages/Relawan";
import TentangKami from "./pages/TentangKami";

const App = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // navigate to home after successful login
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/aksi-berjalan" element={<AksiBerjalan />} />
        <Route path="/aksi/:id" element={<AksiDetail />} />
        <Route path="/relawan" element={<Relawan />} />
        <Route path="/tentang-kami" element={<TentangKami />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={<LoginForm onLogin={handleLogin} onSwitchToRegister={() => navigate('/register')} />}
        />

        <Route
          path="/register"
          element={<RegisterForm onSwitchToLogin={() => navigate('/login')} onRegisterSuccess={() => navigate("/")} />}
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
