import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);

  // New staff
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");

  const [loading, setLoading] = useState(true);

  // Load staff
  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get("staff/");
      setStaff(res.data);
    } catch {
      alert("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // Add staff
  const addStaff = async () => {
    if (!username || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.post("staff/", {
        username,
        password,
        role,
      });

      setUsername("");
      setPassword("");
      setRole("STAFF");

      loadStaff();
    } catch {
      alert("Failed to add staff");
    }
  };

  // Toggle active
  const toggleActive = async (user) => {
    try {
      await api.put(`staff/${user.id}/`, {
        is_active: !user.is_active,
      });

      loadStaff();
    } catch {
      alert("Failed to update user");
    }
  };

  // Delete
  const deleteStaff = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await api.delete(`staff/${id}/`);
      loadStaff();
    } catch {
      alert("Cannot delete user");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Staff Management
      </h1>

      {/* Add Staff */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="font-semibold mb-3">Add Staff</h2>

        <div className="flex flex-wrap gap-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border px-2 py-1 rounded"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border px-2 py-1 rounded"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            onClick={addStaff}
            className="bg-black text-white px-4 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading staff...
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.username}</td>

                  <td className="p-3">{u.role}</td>

                  <td className="p-3">
                    {u.is_active ? (
                      <span className="text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => toggleActive(u)}
                      className="text-blue-600"
                    >
                      {u.is_active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteStaff(u.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
