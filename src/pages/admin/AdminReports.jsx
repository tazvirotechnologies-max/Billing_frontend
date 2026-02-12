import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminReports() {
  const [today, setToday] = useState(null);
  const [items, setItems] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rangeReport, setRangeReport] = useState(null);

  useEffect(() => {
    api.get("reports/today/").then((res) => setToday(res.data));
    api.get("reports/items/").then((res) => setItems(res.data));
  }, []);

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
    <div className="min-h-screen bg-gradient-to-r from-white via-purple-50 to-purple-100 p-8">

      {/* PAGE HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-purple-700 tracking-tight">
          Reports
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Business insights & performance overview
        </p>
      </div>

      {/* TODAY SUMMARY */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-purple-700 mb-6">
          Today Summary
        </h2>

        {!today ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card title="Total Sales" value={`₹${today.total_sales}`} />
            <Card title="Total Bills" value={today.total_bills} />
            <Card title="Cash Sales" value={`₹${today.cash_sales}`} />
            <Card title="UPI Sales" value={`₹${today.upi_sales}`} />
          </div>
        )}
      </section>

      {/* DATE RANGE SUMMARY */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-purple-700 mb-6">
          Date Range Summary
        </h2>

        <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 mb-6 flex gap-6 items-end flex-wrap">

          <div>
            <label className="text-sm text-gray-600">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 px-4 py-2 rounded-lg border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 px-4 py-2 rounded-lg border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={loadRangeReport}
            className="px-6 py-2 rounded-lg text-sm font-medium
                       bg-gradient-to-r from-purple-600 to-indigo-600
                       text-white hover:opacity-90 transition"
          >
            Apply
          </button>
        </div>

        {rangeReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* ITEM WISE SALES */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 mb-6">
          Item-wise Sales
        </h2>

        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-purple-50 text-purple-700">
              <tr>
                <th className="p-4 text-left font-semibold">Item</th>
                <th className="p-4 text-left font-semibold">Qty Sold</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, i) => (
                <tr
                  key={i}
                  className="border-t border-purple-100 hover:bg-purple-50/40 transition"
                >
                  <td className="p-4 font-medium text-gray-700">
                    {item.product__name}
                  </td>
                  <td className="p-4 font-semibold text-purple-700">
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


/* CARD COMPONENT */
function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition">

      <p className="text-sm text-gray-500 mb-2">
        {title}
      </p>

      <p className="text-3xl font-semibold text-purple-700 tracking-tight">
        {value}
      </p>

    </div>
  );
}