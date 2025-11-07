import React from "react";

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard">
      <h2>Selamat datang, {user?.email || "Pengguna"}!</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
