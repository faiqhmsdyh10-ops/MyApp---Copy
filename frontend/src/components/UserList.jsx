import React from "react";

const UserList = ({ users }) => {
  return (
    <div>
      <h3>Daftar User</h3>
      {users.length === 0 ? (
        <p>Tidak ada user.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead style={{ background: "#007bff", color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Email</th>
              <th>No HP</th>
              <th>Alamat</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.nama}</td>
                <td>{u.email}</td>
                <td>{u.no_hp}</td>
                <td>{u.alamat}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
