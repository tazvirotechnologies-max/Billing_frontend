import { useEffect, useState } from "react";

import Login from "./pages/login";
import Billing from "./pages/billing";
import BillHistory from "./pages/BillHistory";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminBills from "./pages/admin/AdminBills";
import AdminReports from "./pages/admin/AdminReports";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminStaff from "./pages/admin/AdminStaff";


export default function App() {
  const [user, setUser] = useState(null);

  // Pages:
  // staff: "pos", "history"
  // admin: "admin-dashboard", "admin-bills"
  const [page, setPage] = useState(null);

  // 🔁 Restore session
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);

      // 🔐 Redirect based on role
      if (parsed.role === "ADMIN") {
        setPage("admin-dashboard");
      } else {
        setPage("pos");
      }
    }
  }, []);

  // ✅ After login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // 🔐 Role-based redirect
    if (userData.role === "ADMIN") {
      setPage("admin-dashboard");
    } else {
      setPage("pos");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPage(null);
  };

  // 🔐 NOT LOGGED IN
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // =========================
  // ADMIN AREA
  // =========================
  if (user.role === "ADMIN") {
  return (
    <AdminLayout
      user={user}
      onLogout={logout}
      onNavigate={setPage}   // 🔥 THIS LINE
    >
      {page === "admin-dashboard" && <Dashboard />}
      {page === "admin-bills" && <AdminBills />}
      {page === "admin-reports" && <AdminReports />}
      {page === "admin-inventory" && <AdminInventory />}
      {page === "admin-products" && <AdminProducts />}
      {page === "admin-staff" && <AdminStaff />}

    </AdminLayout>
  );
}


  // =========================
  // STAFF AREA (POS)
  // =========================
  if (page === "history") {
    return (
      <BillHistory
        user={user}
        onBack={() => setPage("pos")}
      />
    );
  }

  return (
    <div>
      {/* Staff Top Bar */}
      <div className="bg-gray-900 text-white text-sm px-4 py-2 flex justify-between">
        <span>Logged in as {user.username}</span>

        <div className="space-x-4">
          <button
            onClick={() => setPage("history")}
            className="underline"
          >
            Bills
          </button>

          <button
            onClick={logout}
            className="underline text-red-400"
          >
            Logout
          </button>
        </div>
      </div>

      <Billing user={user} onLogout={logout} />
    </div>
  );
}
