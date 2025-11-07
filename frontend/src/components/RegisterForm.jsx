import React, { useState } from "react";

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    no_hp: "",
    alamat: "",
    role: "donatur",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Akun berhasil dibuat!");
    onSwitchToLogin();
  };

  return (
    <div className="form-container">
      <h2>Daftar Akun</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="nama"
          placeholder="Nama lengkap..."
          value={formData.nama}
          onChange={handleChange}
          required
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

        <button type="submit">Selanjutnya</button>
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
