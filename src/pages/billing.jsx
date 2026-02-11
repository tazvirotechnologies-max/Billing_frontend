import { useEffect, useRef, useState } from "react";
import api from "../api";

export default function Billing({ user, onLogout }) {
  if (!user) return null;

  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [lowStockIds, setLowStockIds] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cashGiven, setCashGiven] = useState("");
  const [successBill, setSuccessBill] = useState(null);
  const [loading, setLoading] = useState(false);

  const printRef = useRef();

  // 🔹 Load products
  useEffect(() => {
    api.get("products/").then((res) => setProducts(res.data));
    api.get("inventory/low-stock/").then((res) =>
      setLowStockIds(res.data.map((i) => i.id))
    );
  }, []);

  // 🔹 Add product
  const addToBill = (product) => {
    setBillItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = billItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 🔥 Submit payment
  const submitPayment = async () => {
    if (paymentMethod === "CASH" && cashGiven < total) {
      alert("Cash given is less than total");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("bills/", {
        payment_method: paymentMethod,
        items: billItems.map((i) => ({
          product_id: i.id,
          quantity: i.qty,
        })),
      });

      setSuccessBill({
        ...res.data,
        payment_method: paymentMethod,
        cash_given: cashGiven,
        change:
          paymentMethod === "CASH" ? cashGiven - total : 0,
      });

      setBillItems([]);
      setShowPayment(false);
      setCashGiven("");
    } catch (err) {
      alert(err.response?.data?.detail || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // 🖨️ Print
  const printReceipt = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "", "width=300,height=600");
    win.document.write(printContent);
    win.document.close();
    win.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white px-4 py-3 flex justify-between items-center">
  <h1 className="font-semibold">Cafe POS</h1>

  <div className="flex items-center gap-4">
    <span className="text-sm">{user.username}</span>

    <button
      onClick={onLogout}
      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
    >
      Logout
    </button>
  </div>
</header>


      {/* ✅ SUCCESS SCREEN */}
      {successBill ? (
        <div className="flex justify-center py-20">
          <div className="bg-white p-6 rounded-xl shadow w-80 text-center">
            <h2 className="text-green-600 font-bold text-xl mb-2">
              Payment Successful ✅
            </h2>

            <div ref={printRef} className="text-sm text-left">
              <p>Bill: {successBill.bill_number}</p>
              <p>Total: ₹{successBill.total_amount}</p>
              <p>Payment: {successBill.payment_method}</p>

              {successBill.payment_method === "CASH" && (
                <>
                  <p>Cash Given: ₹{successBill.cash_given}</p>
                  <p>Change: ₹{successBill.change}</p>
                </>
              )}
            </div>

            <button
              onClick={printReceipt}
              className="w-full bg-gray-800 text-white py-2 rounded mt-4"
            >
              🖨️ Print Receipt
            </button>

            <button
              onClick={() => setSuccessBill(null)}
              className="w-full bg-black text-white py-2 rounded mt-2"
            >
              New Bill
            </button>
          </div>
        </div>
      ) : (
        /* POS SCREEN */
        <div className="grid grid-cols-3 gap-4 p-4">
          {/* Products */}
          <div className="col-span-2 bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Products</h2>
            <div className="grid grid-cols-3 gap-3">
              {products.map((p) => (
                <button
                  key={p.id}
                  disabled={lowStockIds.includes(p.id)}
                  onClick={() => addToBill(p)}
                  className={`border p-3 rounded ${
                    lowStockIds.includes(p.id)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <p>{p.name}</p>
                  <p className="text-xs">₹{p.price}</p>
                  {lowStockIds.includes(p.id) && (
                    <p className="text-xs text-red-600">
                      ⚠️ Low Stock
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bill */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Bill</h2>

            {billItems.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>₹{i.price * i.qty}</span>
              </div>
            ))}

            <hr className="my-3" />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              disabled={!billItems.length}
              onClick={() => setShowPayment(true)}
              className="w-full bg-red-600 text-white py-3 rounded mt-4"
            >
              Pay
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="font-semibold mb-4 text-center">
              Payment Method
            </h3>

            <button
              onClick={() => setPaymentMethod("UPI")}
              className="w-full border py-2 mb-2"
            >
              📱 UPI
            </button>

            <button
              onClick={() => setPaymentMethod("CASH")}
              className="w-full border py-2"
            >
              💵 Cash
            </button>

            {paymentMethod === "CASH" && (
              <input
                type="number"
                placeholder="Cash given"
                value={cashGiven}
                onChange={(e) => setCashGiven(+e.target.value)}
                className="border w-full mt-3 px-2 py-2"
              />
            )}

            <button
              onClick={submitPayment}
              disabled={loading}
              className="w-full bg-black text-white py-2 mt-4"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
