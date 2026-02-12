import { useEffect, useState } from "react";
import api from "../../api";

export default function Dashboard({ onNavigate }) {

  const [stats, setStats] = useState(null);
  const [topItems, setTopItems] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, itemsRes, stockRes] =
        await Promise.all([
          api.get("reports/today/"),
          api.get("reports/items/"),
          api.get("inventory/low-stock/"),
        ]);

      setStats(statsRes.data);
      setTopItems(itemsRes.data);
      setLowStock(stockRes.data);
    } catch {
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (!stats || loading) {
    return <p>Loading dashboard...</p>;
  }
return (
  <div className="min-h-screen bg-gradient-to-r from-white via-purple-50 to-purple-100 p-8">

    {/* HEADER */}
    <div className="mb-10">
      <h1 className="text-3xl font-semibold text-purple-700 tracking-tight">
        Admin Dashboard
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Business performance overview
      </p>
    </div>

    {/* ⚠️ LOW STOCK CARD */}
    {lowStock.length > 0 && (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-red-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-red-600">
            ⚠ Low Stock Notification
          </h2>

          <button
            onClick={() => onNavigate("admin-inventory")}
            className="text-sm font-medium text-purple-600 hover:underline"
          >
            Manage →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lowStock.map((i) => (
            <div
              key={i.id}
              className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm flex justify-between"
            >
              <span className="font-medium text-gray-700">
                {i.name}
              </span>
              <span className="text-red-600 font-semibold">
                {i.current_stock} {i.unit || "units"}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* STATS CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

      <StatCard
        title="Total Revenue"
        value={`₹${stats.total_sales}`}
      />

      <StatCard
        title="Total Bills"
        value={stats.total_bills}
      />

      <StatCard
        title="Cash Revenue"
        value={`₹${stats.cash_sales}`}
      />

      <StatCard
        title="UPI Revenue"
        value={`₹${stats.upi_sales}`}
      />

    </div>

    {/* SUMMARY + PAYMENT BREAKDOWN */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-purple-700 font-semibold mb-4">
          Today’s Summary
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Total Sales</span>
            <span className="text-purple-700 font-semibold">
              ₹{stats.total_sales}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Total Bills</span>
            <span className="text-purple-700 font-semibold">
              {stats.total_bills}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Average Bill Value</span>
            <span className="text-purple-700 font-semibold">
              ₹{stats.total_bills > 0
                ? (stats.total_sales / stats.total_bills).toFixed(2)
                : 0}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-purple-700 font-semibold mb-4">
          Payment Breakdown
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Cash</span>
            <span className="text-purple-700 font-semibold">
              ₹{stats.cash_sales}
            </span>
          </div>

          <div className="flex justify-between">
            <span>UPI</span>
            <span className="text-purple-700 font-semibold">
              ₹{stats.upi_sales}
            </span>
          </div>
        </div>
      </div>

    </div>

    {/* TOP SELLING ITEMS */}
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-purple-700 font-semibold mb-6">
        Top Selling Items
      </h2>

      {topItems.length === 0 ? (
        <p className="text-gray-400 text-sm">No data available</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="text-left py-3">Rank</th>
              <th className="text-left py-3">Item</th>
              <th className="text-right py-3">Quantity Sold</th>
            </tr>
          </thead>

          <tbody>
            {topItems.map((item, i) => (
              <tr
                key={i}
                className="border-t border-purple-100 hover:bg-purple-50/40 transition"
              >
                <td className="py-3 text-purple-600 font-medium">
                  #{i + 1}
                </td>

                <td className="py-3 font-medium text-gray-700">
                  {item.product__name}
                </td>

                <td className="py-3 text-right text-purple-700 font-semibold">
                  {item.total_quantity}
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

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <p className="text-sm text-gray-500 mb-2">
        {title}
      </p>
      <p className="text-3xl font-semibold text-purple-700">
        {value}
      </p>
    </div>
  );
}