import React, { useState } from "react";
import { loginUser } from "../api";

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      onLogin(response.user);
    } catch (err) {
      setError(err.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          onClick={() => console.log('Login button clicked', { loading, email })}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Masuk...' : 'Masuk'}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        Belum punya akun?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:text-blue-800 font-medium"
          disabled={loading}
        >
          Daftar di sini
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
