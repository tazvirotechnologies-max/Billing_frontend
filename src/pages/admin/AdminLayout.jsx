export default function AdminLayout({ user, children, onLogout, onNavigate }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Cafe POS – Admin
        </div>

        <nav className="flex-1 p-4 space-y-3 text-sm">
          <button
            onClick={() => onNavigate("admin-dashboard")}
            className="block w-full text-left hover:text-red-400"
          >
            📊 Dashboard
          </button>

          <button
  onClick={() => onNavigate("admin-bills")}
  className="block w-full text-left hover:text-red-400"
>
  🧾 Bills
</button>


          <button
            onClick={() => onNavigate("admin-reports")}
            className="block w-full text-left hover:text-red-400"
          >
            📈 Reports
          </button>

          <button
            onClick={() => onNavigate("admin-inventory")}
            className="block w-full text-left hover:text-red-400"
          >
            📦 Inventory
          </button>

          <button
            onClick={() => onNavigate("admin-products")}
            className="block w-full text-left hover:text-red-400"
          >
            ☕ Products
          </button>

          <button
            onClick={() => onNavigate("admin-staff")}
            className="block w-full text-left hover:text-red-400"
          >
            👥 Staff
          </button>
        </nav>

        <button
          onClick={onLogout}
          className="m-4 bg-red-600 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
