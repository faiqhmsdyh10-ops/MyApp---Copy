import React, { useState } from "react";

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Contoh login sederhana (belum ke backend)
    if (email && password) {
      onLogin({ email });
    } else {
      alert("Mohon isi email dan password!");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Masuk</button>
      </form>

      <p className="switch-text">
        Belum punya akun?{" "}
        <span onClick={onSwitchToRegister} className="link">
          Daftar di sini
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
