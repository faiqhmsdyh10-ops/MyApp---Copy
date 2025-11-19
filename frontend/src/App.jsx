import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setLoggedInUser(user);
    // navigate to dashboard after successful login
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={<LoginForm onLogin={handleLogin} onSwitchToRegister={() => navigate('/register')} />}
        />

        <Route
          path="/register"
          element={<RegisterForm onSwitchToLogin={() => navigate('/login')} onRegisterSuccess={(user) => { setLoggedInUser(user); navigate('/dashboard'); }} />}
        />

        <Route
          path="/dashboard"
          element={
            loggedInUser ? (
              <Dashboard user={loggedInUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
