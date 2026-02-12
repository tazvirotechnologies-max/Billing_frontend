import { useEffect, useState } from "react";

import Login from "./pages/login";
import Billing from "./pages/billing";
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
      {page === "admin-dashboard" && (
  <Dashboard onNavigate={setPage} />
)}
      {page === "admin-bills" && <AdminBills />}
      {page === "admin-reports" && <AdminReports />}
      {page === "admin-inventory" && <AdminInventory />}
      {page === "admin-products" && <AdminProducts />}
      {page === "admin-staff" && <AdminStaff />}

    </AdminLayout>
  );
}




  return (
    <div>

    <Billing user={user} onLogout={logout} />
    </div>
  );
}