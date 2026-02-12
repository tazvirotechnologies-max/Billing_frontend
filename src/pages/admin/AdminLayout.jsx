export default function AdminLayout({ user, children, onLogout, onNavigate }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-white via-purple-50 to-purple-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-purple-100 shadow-sm flex flex-col">

        {/* Logo / Title */}
        <div className="p-6 text-xl font-semibold text-purple-700 border-b border-purple-100">
          Cafe POS – Admin
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-2 text-sm">

          <SidebarItem onClick={() => onNavigate("admin-dashboard")}>
            📊 Dashboard
          </SidebarItem>

          <SidebarItem onClick={() => onNavigate("admin-bills")}>
            🧾 Bills
          </SidebarItem>

          <SidebarItem onClick={() => onNavigate("admin-reports")}>
            📈 Reports
          </SidebarItem>

          <SidebarItem onClick={() => onNavigate("admin-inventory")}>
            📦 Inventory
          </SidebarItem>

          <SidebarItem onClick={() => onNavigate("admin-products")}>
            ☕ Products
          </SidebarItem>

          <SidebarItem onClick={() => onNavigate("admin-staff")}>
            👥 Staff
          </SidebarItem>

        </nav>

        {/* Logout */}
        <div className="p-5 border-t border-purple-100">
          <button
            onClick={onLogout}
            className="w-full py-2 rounded-lg text-sm font-medium
                       bg-gradient-to-r from-purple-600 to-indigo-600
                       text-white hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>

      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}


function SidebarItem({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 rounded-lg
                 text-gray-700 hover:bg-purple-100
                 hover:text-purple-700 transition font-medium"
    >
      {children}
    </button>
  );
}