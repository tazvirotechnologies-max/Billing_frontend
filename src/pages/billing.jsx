import { useEffect, useRef, useState } from "react";
import api from "../api";
import BillHistory from "./BillHistory";

export default function Billing({ user, onLogout }) {
  if (!user) return null;
const [unavailableProductIds, setUnavailableProductIds] = useState([]);

  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [lowStockIds, setLowStockIds] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cashGiven, setCashGiven] = useState("");
  const [successBill, setSuccessBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(null);
  const printRef = useRef();

  // 🔹 Load products
useEffect(() => {

  const loadData = async () => {
    try {

      const productsRes = await api.get("products/");
      setProducts(productsRes.data);

      const unavailableRes = await api.get(
        "unavailable-products/"
      );

      setUnavailableProductIds(unavailableRes.data);

    } catch (err) {
      console.error("Failed loading products", err);
    }
  };

  loadData();

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

const [searchTerm, setSearchTerm] = useState("");

const filteredProducts = products.filter((p) =>
  p.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  // =========================
  // STAFF AREA (POS)
  // =========================
  if (page === "history") {
    return (
      <BillHistory
        user={user}
        onBack={() => setPage("pos")}
      />
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-r from-white via-purple-50 to-purple-100">

    {/* HEADER */}
    <header className="bg-white shadow-md border-b border-purple-100 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-purple-700">
        Cafe Billing System
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Staff: <span className="font-semibold text-purple-600">{user.username}</span>
        </span>
<button
          onClick={() => setPage("history")}
          className="px-4 py-2 text-sm rounded-lg 
                     bg-gradient-to-r from-purple-600 to-indigo-600
                     text-white"
        >
          Bill History
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm rounded-lg 
                     bg-gradient-to-r from-purple-600 to-indigo-600
                     text-white"
        >
          Logout
        </button>
      </div>
    </header>


    {/* SUCCESS SCREEN */}
    {successBill ? (
      <div className="flex justify-center py-20">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-96 border border-purple-100">
          <h2 className="text-green-600 font-bold text-2xl mb-4 text-center">
            Payment Successful
          </h2>

          <div ref={printRef} className="text-sm text-gray-700 space-y-1">
            <p><strong>Bill:</strong> {successBill.bill_number}</p>
            <p><strong>Total:</strong> ₹{successBill.total_amount}</p>
            <p><strong>Payment:</strong> {successBill.payment_method}</p>

            {successBill.payment_method === "CASH" && (
              <>
                <p><strong>Cash Given:</strong> ₹{successBill.cash_given}</p>
                <p><strong>Change:</strong> ₹{successBill.change}</p>
              </>
            )}
          </div>

          <button
            onClick={printReceipt}
            className="w-full mt-6 py-3 rounded-xl bg-purple-600 text-white"
          >
            🖨️ Print Receipt
          </button>

          <button
            onClick={() => setSuccessBill(null)}
            className="w-full mt-3 py-3 rounded-xl border border-purple-300 text-purple-700"
          >
            New Bill
          </button>
        </div>
      </div>
    ) : (

      /* MAIN POS */
      <div className="grid grid-cols-3 gap-6 p-6">

        {/* LEFT SIDE */}
        <div className="col-span-2 bg-white rounded-3xl shadow-lg p-6 border border-purple-100">

          {/* SEARCH */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* PRODUCTS */}
          <div className="grid grid-cols-3 gap-4">
            {filteredProducts.map((p) => {

  const isUnavailable =
    unavailableProductIds.includes(p.id);

  return (

    <button
      key={p.id}
      disabled={isUnavailable}
      onClick={() => addToBill(p)}
      className={`relative rounded-2xl p-4 border transition-all duration-300

        ${
          isUnavailable
            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
            : "bg-purple-50 hover:bg-purple-100 border-purple-200 hover:shadow-md"
        }
      `}
    >

      {/* OUT OF STOCK BADGE */}
      {isUnavailable && (
        <span
          className="absolute top-2 right-2 text-xs bg-red-500 text-white
                     px-2 py-0.5 rounded-full"
        >
          Out of Stock
        </span>
      )}

      <p className="font-medium">
        {p.name}
      </p>

      <p className="text-sm text-purple-600 mt-1">
        ₹{p.price}
      </p>

    </button>
  );
})}

          </div>
        </div>


        {/* RIGHT SIDE - STATIC BILL */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-purple-100 flex flex-col sticky top-6 h-[85vh]">

          <h2 className="text-lg font-semibold text-purple-700 mb-5">
            Current Bill
          </h2>

          <div className="flex-1 space-y-3 overflow-y-auto">

            {billItems.map((i) => (
              <div
                key={i.id}
                className="flex justify-between items-center bg-purple-50 rounded-xl px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-gray-500">₹{i.price}</p>
                </div>

                <div className="flex items-center gap-2">

                  {/* Decrease */}
                  <button
                    onClick={() =>
                      setBillItems((prev) =>
                        prev
                          .map((item) =>
                            item.id === i.id
                              ? { ...item, qty: item.qty - 1 }
                              : item
                          )
                          .filter((item) => item.qty > 0)
                      )
                    }
                    className="w-7 h-7 rounded-full bg-purple-200 text-purple-700"
                  >
                    −
                  </button>

                  <span className="w-6 text-center text-sm font-semibold">
                    {i.qty}
                  </span>

                  {/* Increase */}
                  <button
                    onClick={() =>
                      setBillItems((prev) =>
                        prev.map((item) =>
                          item.id === i.id
                            ? { ...item, qty: item.qty + 1 }
                            : item
                        )
                      )
                    }
                    className="w-7 h-7 rounded-full bg-purple-600 text-white"
                  >
                    +
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() =>
                      setBillItems((prev) =>
                        prev.filter((item) => item.id !== i.id)
                      )
                    }
                    className="ml-2 text-purple-500 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

          </div>

          <div className="border-t border-purple-100 mt-4 pt-4">
            <div className="flex justify-between text-lg font-bold text-purple-700">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              disabled={!billItems.length}
              onClick={() => setShowPayment(true)}
              className="w-full mt-4 py-3 rounded-xl
                         bg-gradient-to-r from-purple-600 to-indigo-600
                         text-white font-semibold"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    )}


    {/* PAYMENT MODAL */}
    {/* PAYMENT MODAL */}
{showPayment && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white p-8 rounded-3xl shadow-xl w-96 border border-purple-100 relative">

      {/* ❌ CLOSE BUTTON */}
      <button
        onClick={() => {
          setShowPayment(false);
          setPaymentMethod(null);
          setCashGiven("");
        }}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
      >
        ×
      </button>

      <h3 className="font-semibold mb-4 text-center text-purple-700">
        Payment Method
      </h3>

      <button
        onClick={() => setPaymentMethod("UPI")}
        className="w-full border border-purple-300 py-3 rounded-xl mb-3 hover:bg-purple-50"
      >
        📱 UPI
      </button>

      <button
        onClick={() => setPaymentMethod("CASH")}
        className="w-full border border-purple-300 py-3 rounded-xl hover:bg-purple-50"
      >
        💵 Cash
      </button>

      {paymentMethod === "CASH" && (
        <input
          type="number"
          placeholder="Cash given"
          value={cashGiven}
          onChange={(e) => setCashGiven(+e.target.value)}
          className="w-full mt-4 px-4 py-3 rounded-xl border border-purple-300
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      )}

      <button
        onClick={submitPayment}
        disabled={loading}
        className="w-full mt-6 py-3 rounded-xl
                   bg-gradient-to-r from-purple-600 to-indigo-600
                   text-white font-semibold"
      >
        {loading ? "Processing..." : "Confirm Payment"}
      </button>
    </div>
  </div>
)}

  </div>
);
}
