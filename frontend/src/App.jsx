import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [page, setPage] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (user) => {
    setLoggedInUser(user);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setPage("login");
  };

  return (
    <div className="app-container">
      {page === "login" && (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => setPage("register")}
        />
      )}
      {page === "register" && (
        <RegisterForm 
          onSwitchToLogin={() => setPage("login")}
          onRegisterSuccess={(user) => {
            setLoggedInUser(user);
            setPage("dashboard");
          }}
        />
      )}
      {page === "dashboard" && (
        <Dashboard user={loggedInUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
