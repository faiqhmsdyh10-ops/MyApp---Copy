import React, { useState, useEffect } from "react";
import AddUserForm from "./components/AddUserForm";
import UserList from "./components/UserList";

const App = () => {
  const [users, setUsers] = useState([]);

  // Ambil data user dari backend Express
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Gagal memuat data user:", error);
    }
  };

  // Ambil data saat halaman pertama kali dimuat
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Manajemen User</h1>
      <div style={{ marginTop: "30px" }}>
        <AddUserForm onUserAdded={fetchUsers} />
      </div>
      <hr style={{ margin: "30px 0" }} />
      <UserList users={users} />
    </div>
  );
};

export default App;
