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
    <div>
      <h1 className="text-2xl font-bold mb-6">All Bills</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="flex gap-4 items-end flex-wrap">
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
            onClick={loadBills}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
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
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Bill No</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Cashier</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Action</th>
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
                      className="text-blue-600"
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

      {/* Detail Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-3 text-center">
              Bill Detail
            </h2>

            <div ref={printRef} className="text-sm">
              <p>
                <b>Bill:</b> {selectedBill.bill_number}
              </p>

              <p>
                <b>Cashier:</b> {selectedBill.cashier_name}
              </p>

              <p>
                <b>Payment:</b> {selectedBill.payment_method}
              </p>

              <p>
                <b>Date:</b>{" "}
                {new Date(
                  selectedBill.created_at
                ).toLocaleString()}
              </p>

              <hr className="my-3" />

              {selectedBill.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between mb-1"
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
            </div>

            <button
              onClick={printReceipt}
              className="w-full bg-gray-800 text-white py-2 rounded mt-4"
            >
              🖨️ Print
            </button>

            <button
              onClick={() => setSelectedBill(null)}
              className="w-full bg-black text-white py-2 rounded mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
