import React, { useState } from "react";

const AddUserForm = ({ onUserAdded }) => {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    no_hp: "",
    alamat: "",
    role: "donatur",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Fitur tambah user belum diaktifkan sementara. Fokus tampilan dulu 😄");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <input
        type="text"
        name="nama"
        placeholder="Nama Lengkap"
        value={form.nama}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      />
      <input
        type="text"
        name="no_hp"
        placeholder="Nomor HP"
        value={form.no_hp}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      />
      <textarea
        name="alamat"
        placeholder="Alamat"
        value={form.alamat}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 md:col-span-2"
      ></textarea>
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
      >
        <option value="donatur">Donatur</option>
        <option value="penerima">Penerima</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all md:col-span-2"
      >
        Tambah User
      </button>
    </form>
  );
};

export default AddUserForm;
