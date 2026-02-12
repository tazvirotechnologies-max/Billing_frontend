import { useEffect, useRef, useState } from "react";
import api from "../../api";

export default function AdminBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Selected bill
  const [selectedBill, setSelectedBill] = useState(null);

  const printRef = useRef();

  // Load bills
  const loadBills = async () => {
    try {
      setLoading(true);

      let url = "bills/history/";

      if (fromDate && toDate) {
        url += `?from=${fromDate}&to=${toDate}`;
      }

      const res = await api.get(url);
      setBills(res.data);
    } catch {
      alert("Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  // View bill detail
  const openBill = async (id) => {
    try {
      const res = await api.get(`bills/${id}/`);
      setSelectedBill(res.data);
    } catch {
      alert("Failed to load bill");
    }
  };

  // Print
  const printReceipt = () => {
    const content = printRef.current.innerHTML;

    const win = window.open("", "", "width=300,height=600");
    win.document.write(content);
    win.document.close();
    win.print();
  };

 return (
  <div className="min-h-screen bg-gradient-to-r from-white via-purple-50 to-purple-100 p-8">

    {/* HEADER */}
    <div className="mb-8">
      <h1 className="text-3xl font-semibold text-purple-700 tracking-tight">
        All Bills
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        View and manage all transaction records
      </p>
    </div>

    {/* FILTER CARD */}
    <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 mb-6">
      <div className="flex gap-6 items-end flex-wrap">

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
          onClick={loadBills}
          className="px-6 py-2 rounded-lg text-sm font-medium
                     bg-gradient-to-r from-purple-600 to-indigo-600
                     text-white hover:opacity-90 transition"
        >
          Apply
        </button>
      </div>
    </div>

    {/* TABLE CARD */}
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">

      {loading ? (
        <p className="text-center py-16 text-gray-500">
          Loading bills...
        </p>
      ) : bills.length === 0 ? (
        <p className="text-center py-16 text-gray-400">
          No bills found
        </p>
      ) : (
        <table className="w-full text-sm">

          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-4 text-left font-semibold">Bill No</th>
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">Cashier</th>
              <th className="p-4 text-left font-semibold">Payment</th>
              <th className="p-4 text-left font-semibold">Total</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((bill) => (
              <tr
                key={bill.id}
                className="border-t border-purple-100 hover:bg-purple-50/40 transition"
              >
                <td className="p-4 font-medium text-gray-700">
                  {bill.bill_number}
                </td>

                <td className="p-4 text-gray-600">
                  {new Date(bill.created_at).toLocaleString()}
                </td>

                <td className="p-4 text-gray-700">
                  {bill.cashier_name}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        bill.payment_method === "CASH"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                  >
                    {bill.payment_method}
                  </span>
                </td>

                <td className="p-4 font-semibold text-purple-700">
                  ₹{bill.total_amount}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => openBill(bill.id)}
                    className="text-purple-600 hover:underline text-sm"
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

    {/* DETAIL MODAL */}
    {selectedBill && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

        <div className="bg-white rounded-2xl p-8 w-96 max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100">

          <h2 className="text-xl font-semibold text-purple-700 mb-4 text-center">
            Bill Detail
          </h2>

          <div ref={printRef} className="text-sm text-gray-700">

            <p><b>Bill:</b> {selectedBill.bill_number}</p>
            <p><b>Cashier:</b> {selectedBill.cashier_name}</p>
            <p><b>Payment:</b> {selectedBill.payment_method}</p>
            <p><b>Date:</b> {new Date(selectedBill.created_at).toLocaleString()}</p>

            <hr className="my-4 border-purple-100" />

            {selectedBill.items.map((item, i) => (
              <div key={i} className="flex justify-between mb-2">
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            <hr className="my-4 border-purple-100" />

            <div className="flex justify-between font-semibold text-purple-700">
              <span>Total</span>
              <span>₹{selectedBill.total_amount}</span>
            </div>

          </div>

          <button
            onClick={printReceipt}
            className="w-full mt-6 py-3 rounded-lg
                       bg-gradient-to-r from-purple-600 to-indigo-600
                       text-white"
          >
            Print Receipt
          </button>

          <button
            onClick={() => setSelectedBill(null)}
            className="w-full mt-3 py-3 rounded-lg border border-purple-200 text-purple-700"
          >
            Close
          </button>

        </div>
      </div>
    )}

  </div>
);
}
