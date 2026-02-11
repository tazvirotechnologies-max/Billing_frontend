import { useEffect, useState } from "react";
import api from "../api";

export default function BillHistory({ user, onBack }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);

  // Selected bill (detail modal)
  const [selectedBill, setSelectedBill] = useState(null);

  // 🔹 Load bills
  const loadBills = async () => {
    try {
      setLoading(true);

      let url = "bills/history/";

      if (todayOnly) {
        url += "?today=1";
      } else if (fromDate && toDate) {
        url += `?from=${fromDate}&to=${toDate}`;
      }

      const res = await api.get(url);
      setBills(res.data);
    } catch (err) {
      alert("Failed to load bills ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  // 🔹 View bill detail
  const openBill = async (id) => {
    try {
      const res = await api.get(`bills/${id}/`);
      setSelectedBill(res.data);
    } catch {
      alert("Failed to load bill detail");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white px-4 py-3 flex justify-between items-center">
        <h1 className="font-semibold">Bill History</h1>

        <button
          onClick={onBack}
          className="text-sm bg-gray-800 px-3 py-1 rounded"
        >
          ← Back to POS
        </button>
      </header>

      <div className="p-4 max-w-6xl mx-auto">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-sm">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
            </div>

            <div>
              <label className="text-sm">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todayOnly}
                onChange={(e) => setTodayOnly(e.target.checked)}
              />
              <span className="text-sm">Today Only</span>
            </div>

            <button
              onClick={loadBills}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Bill Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          {loading ? (
            <p className="text-center py-10 text-gray-500">
              Loading bills...
            </p>
          ) : bills.length === 0 ? (
            <p className="text-center py-10 text-gray-400">
              No bills found
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Bill No</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Cashier</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {bills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{bill.bill_number}</td>

                    <td className="p-3">
                      {new Date(bill.created_at).toLocaleString()}
                    </td>

                    <td className="p-3">{bill.cashier_name}</td>

                    <td className="p-3">{bill.payment_method}</td>

                    <td className="p-3 font-semibold">
                      ₹{bill.total_amount}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => openBill(bill.id)}
                        className="text-blue-600 text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bill Detail Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-2 text-center">
              Bill Detail
            </h2>

            <p className="text-sm mb-1">
              <b>Bill:</b> {selectedBill.bill_number}
            </p>

            <p className="text-sm mb-1">
              <b>Cashier:</b> {selectedBill.cashier_name}
            </p>

            <p className="text-sm mb-1">
              <b>Payment:</b> {selectedBill.payment_method}
            </p>

            <p className="text-sm mb-3">
              <b>Date:</b>{" "}
              {new Date(selectedBill.created_at).toLocaleString()}
            </p>

            <hr className="mb-3" />

            {/* Items */}
            {selectedBill.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm mb-2"
              >
                <span>
                  {item.product_name} × {item.quantity}
                </span>

                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            <hr className="my-3" />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{selectedBill.total_amount}</span>
            </div>

            <button
              onClick={() => setSelectedBill(null)}
              className="w-full mt-4 bg-black text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
