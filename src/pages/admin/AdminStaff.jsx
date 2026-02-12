import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");
  const [loading, setLoading] = useState(true);

  // ======================
  // Load Staff
  // ======================
  const loadStaff = async () => {
    try {
      setLoading(true);

      const res = await api.get("staff/", {
        withCredentials: true, // ✅ FORCE SESSION
      });

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

  // ======================
  // Add Staff
  // ======================
  const addStaff = async () => {
    if (!username || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.post(
        "staff/",
        { username, password, role },
        { withCredentials: true }
      );

      setUsername("");
      setPassword("");
      setRole("STAFF");

      loadStaff();
    } catch {
      alert("Failed to add staff");
    }
  };

  // ======================
  // Activate / Deactivate ✅ FIXED
  // ======================
  const toggleActive = async (user) => {
    try {
      const action = user.is_active
        ? "deactivate"
        : "activate";

      // 🔹 Call backend
      await api.post(
        `staff/${user.id}/status/`,
        { action },
        { withCredentials: true }
      );

      // 🔹 Update UI instantly (IMPORTANT)
      setStaff((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, is_active: !u.is_active }
            : u
        )
      );

      // 🔹 Sync again (safety)
      setTimeout(loadStaff, 300);

    } catch (err) {
      alert(
        err.response?.data?.detail ||
        "Failed to update user"
      );
    }
  };

  // ======================
  // Delete Staff
  // ======================
  const deleteStaff = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await api.delete(`staff/${id}/`, {
        withCredentials: true,
      });

      loadStaff();
    } catch {
      alert("Cannot delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-purple-50 to-purple-100 p-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-purple-700 tracking-tight">
          Staff Management
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage staff accounts and access control
        </p>
      </div>

      {/* ADD STAFF */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-8">

        <h2 className="text-lg font-semibold text-purple-700 mb-4">
          Add New Staff
        </h2>

        <div className="flex flex-wrap gap-4">

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="px-4 py-2 rounded-lg border border-purple-200"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-4 py-2 rounded-lg border border-purple-200"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2 rounded-lg border border-purple-200"
          >
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            onClick={addStaff}
            className="px-6 py-2 rounded-lg text-white
                       bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            Add Staff
          </button>
        </div>
      </div>

      {/* STAFF TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">

        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading staff...
          </p>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-purple-50 text-purple-700">
              <tr>
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((u) => (
                <tr key={u.id} className="border-t">

                  <td className="p-4">{u.username}</td>

                  <td className="p-4">{u.role}</td>

                  <td className="p-4">
                    {u.is_active ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4 space-x-4">

                    <button
                      onClick={() => toggleActive(u)}
                      className="text-purple-600 hover:underline"
                    >
                      {u.is_active
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteStaff(u.id)}
                      className="text-red-500 hover:underline"
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
