import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminReports() {
  const [today, setToday] = useState(null);
  const [items, setItems] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rangeReport, setRangeReport] = useState(null);

  // Load today + item-wise
  useEffect(() => {
    api.get("reports/today/").then((res) => setToday(res.data));
    api.get("reports/items/").then((res) => setItems(res.data));
  }, []);

  // Load date range report
  const loadRangeReport = async () => {
    if (!fromDate || !toDate) {
      alert("Select both dates");
      return;
    }

    try {
      const res = await api.get(
        `reports/date-range/?from=${fromDate}&to=${toDate}`
      );
      setRangeReport(res.data);
    } catch {
      alert("Failed to load date range report");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      {/* TODAY SUMMARY */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Today Summary</h2>

        {!today ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card title="Total Sales" value={`₹${today.total_sales}`} />
            <Card title="Total Bills" value={today.total_bills} />
            <Card title="Cash Sales" value={`₹${today.cash_sales}`} />
            <Card title="UPI Sales" value={`₹${today.upi_sales}`} />
          </div>
        )}
      </section>

      {/* DATE RANGE */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          Date Range Summary
        </h2>

        <div className="bg-white p-4 rounded-xl shadow mb-4 flex gap-4 items-end flex-wrap">
          <div>
            <label className="text-sm">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border px-2 py-1 rounded block"
            />
          </div>

          <div>
            <label className="text-sm">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border px-2 py-1 rounded block"
            />
          </div>

          <button
            onClick={loadRangeReport}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>

        {rangeReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              title="Total Sales"
              value={`₹${rangeReport.total_sales}`}
            />
            <Card
              title="Total Bills"
              value={rangeReport.total_bills}
            />
          </div>
        )}
      </section>

      {/* ITEM WISE */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Item-wise Sales
        </h2>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-left">Qty Sold</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">
                    {item.product__name}
                  </td>
                  <td className="p-3">
                    {item.total_quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
