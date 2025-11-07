import React from "react";

const UserList = ({ users }) => {
  if (users.length === 0) {
    return (
      <div className="text-center text-gray-500 italic py-8">
        Tidak ada user yang terdaftar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Nama</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">No HP</th>
            <th className="py-3 px-4 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr
              key={i}
              className={`border-b hover:bg-indigo-50 ${
                i % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-3 px-4 font-medium text-gray-800">{u.nama}</td>
              <td className="py-3 px-4">{u.email}</td>
              <td className="py-3 px-4">{u.no_hp}</td>
              <td className="py-3 px-4 capitalize text-indigo-700 font-semibold">
                {u.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
