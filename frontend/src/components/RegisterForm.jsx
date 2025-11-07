import React, { useState } from "react";
import { registerUser } from "../api";

const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    no_hp: "",
    alamat: "",
    role: "donatur",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Reset error when user types
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await registerUser(formData);
      if (response.success && response.user) {
        // Jika registrasi berhasil, langsung arahkan ke dashboard
        setLoading(false);
        onRegisterSuccess(response.user);
      } else {
        throw new Error("Gagal mendaftar: Data tidak valid");
      }
    } catch (err) {
      setError(err.message || "Gagal mendaftar. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Daftar Akun</h2>
      <form onSubmit={handleRegister}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        <input
          type="text"
          name="nama"
          placeholder="Nama lengkap..."
          value={formData.nama}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          placeholder="Email..."
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password..."
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="no_hp"
          placeholder="Nomor HP..."
          value={formData.no_hp}
          onChange={handleChange}
        />
        <textarea
          name="alamat"
          placeholder="Alamat..."
          value={formData.alamat}
          onChange={handleChange}
        ></textarea>

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="donatur">Donatur</option>
          <option value="penerima">Penerima</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          onClick={() => console.log('Register button clicked', { loading, formData })}
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Mendaftar...' : 'Selanjutnya'}
        </button>
      </form>

      <p className="switch-text">
        Sudah punya akun?{" "}
        <span onClick={onSwitchToLogin} className="link">
          Masuk di sini
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;
