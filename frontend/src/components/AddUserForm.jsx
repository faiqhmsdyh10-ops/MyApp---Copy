import React, { useState } from "react";

const AddUserForm = ({ onUserAdded }) => {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    no_hp: "",
    alamat: "",
    role: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Gagal menambah user");

      alert("✅ User berhasil ditambahkan!");
      setForm({
        nama: "",
        email: "",
        password: "",
        no_hp: "",
        alamat: "",
        role: "",
      });
      onUserAdded(); // refresh data di tabel
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("❌ Terjadi kesalahan saat menambah user");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "10px",
        background: "#f8f9fa",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Tambah User</h3>

      <input
        type="text"
        name="nama"
        placeholder="Nama"
        value={form.nama}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="no_hp"
        placeholder="No HP"
        value={form.no_hp}
        onChange={handleChange}
      />
      <input
        type="text"
        name="alamat"
        placeholder="Alamat"
        value={form.alamat}
        onChange={handleChange}
      />
      <input
        type="text"
        name="role"
        placeholder="Role (misal: admin/user)"
        value={form.role}
        onChange={handleChange}
      />

      <button
        type="submit"
        style={{
          padding: "10px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Tambah User
      </button>
    </form>
  );
};

export default AddUserForm;
