import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./pages/Home";
import AksiBerjalan from "./pages/AksiBerjalan";
import AksiDetail from "./pages/AksiDetail";
import DonasiPage from "./pages/DonasiPage";
import Relawan from "./pages/Relawan";
import TentangKami from "./pages/TentangKami";
import ProfilSaya from "./pages/ProfilSaya";
import DonasiSaya from "./pages/DonasiSaya";
import Layout from "./components/Layout";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import KelolaAksi from "./pages/admin/KelolaAksi";
import TambahAksi from "./pages/admin/TambahAksi";
import KelolaRelawan from "./pages/admin/KelolaRelawan";
import LaporanAksi from "./pages/admin/LaporanAksi";
import KelolaBarang from "./pages/admin/KelolaBarang";

const App = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // navigate to home after successful login
    navigate("/");
  };

  return (
    <Routes>
      {/* Public Routes - wrapped in Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/aksi-berjalan" element={<AksiBerjalan />} />
        <Route path="/aksi/:id" element={<AksiDetail />} />
        <Route path="/donasi/:id" element={<DonasiPage />} />
        <Route path="/relawan" element={<Relawan />} />
        <Route path="/tentang-kami" element={<TentangKami />} />
        <Route path="/profil" element={<ProfilSaya />} />
        <Route path="/donasi-saya" element={<DonasiSaya />} />
        <Route
          path="/login"
          element={<LoginForm onLogin={handleLogin} onSwitchToRegister={() => navigate('/register')} />}
        />
        <Route
          path="/register"
          element={<RegisterForm onSwitchToLogin={() => navigate('/login')} onRegisterSuccess={() => navigate("/")} />}
        />
      </Route>

      {/* Admin Routes - NOT wrapped in Layout */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="kelola-aksi" element={<KelolaAksi />} />
        <Route path="tambah-aksi" element={<TambahAksi />} />
        <Route path="kelola-relawan" element={<KelolaRelawan />} />
        <Route path="kelola-barang" element={<KelolaBarang />} />
        <Route path="laporan" element={<LaporanAksi />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
