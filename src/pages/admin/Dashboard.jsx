import { useEffect, useState } from "react";
import api from "../../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    api.get("reports/today/").then((res) => setStats(res.data));
    api.get("reports/items/").then((res) => setTopItems(res.data));
  }, []);

  if (!stats) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Sales" value={`₹${stats.total_sales}`} />
        <StatCard title="Total Bills" value={stats.total_bills} />
        <StatCard title="Cash Sales" value={`₹${stats.cash_sales}`} />
        <StatCard title="UPI Sales" value={`₹${stats.upi_sales}`} />
      </div>

      {/* Top items */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-4">Top Selling Items</h2>

        {topItems.length === 0 ? (
          <p className="text-gray-400">No data</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-left">Qty Sold</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{item.product__name}</td>
                  <td className="p-2">{item.total_quantity}</td>
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
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
