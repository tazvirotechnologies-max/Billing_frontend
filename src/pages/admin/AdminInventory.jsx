import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminInventory() {
  const [ingredients, setIngredients] = useState([]);
  const [lowStockIds, setLowStockIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editItem, setEditItem] = useState(null);
  const [newStock, setNewStock] = useState("");

  const loadInventory = async () => {
    try {
      setLoading(true);

      const res1 = await api.get("ingredients/");
      const res2 = await api.get("inventory/low-stock/");

      setIngredients(res1.data);
      setLowStockIds(res2.data.map((i) => i.id));
    } catch {
      alert("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const updateStock = async () => {
    if (!editItem || newStock === "") return;

    try {
      await api.put(`ingredients/${editItem.id}/`, {
        current_stock: newStock,
      });

      setEditItem(null);
      setNewStock("");
      loadInventory();
    } catch {
      alert("Failed to update stock");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-purple-50 to-purple-100 p-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-purple-700 tracking-tight">
          Inventory Manager
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor and manage ingredient stock levels
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">

        {loading ? (
          <p className="text-center py-16 text-gray-400">
            Loading inventory...
          </p>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-purple-50 text-purple-700">
              <tr>
                <th className="p-4 text-left font-semibold">
                  Ingredient
                </th>
                <th className="p-4 text-left font-semibold">
                  Current Stock
                </th>
                <th className="p-4 text-left font-semibold">
                  Status
                </th>
                <th className="p-4 text-left font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {ingredients.map((item) => {
                const low = lowStockIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className="border-t border-purple-100 hover:bg-purple-50/40 transition"
                  >
                    <td className="p-4 font-medium text-gray-700">
                      {item.name}
                    </td>

                    <td className="p-4 text-gray-600">
                      {item.current_stock}
                    </td>

                    <td className="p-4">
                      {low ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                          In Stock
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => {
                          setEditItem(item);
                          setNewStock(item.current_stock);
                        }}
                        className="text-purple-600 font-medium hover:underline"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        )}
      </div>

      {/* UPDATE MODAL */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 w-96">

            <h2 className="text-xl font-semibold text-purple-700 mb-4 text-center">
              Update Stock
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              Ingredient:
              <span className="font-semibold text-gray-800 ml-1">
                {editItem.name}
              </span>
            </p>

            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              placeholder="Enter new stock value"
              className="w-full px-4 py-2 rounded-lg border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500 mb-5"
            />

            <button
              onClick={updateStock}
              className="w-full py-2 rounded-lg text-sm font-medium
                         bg-gradient-to-r from-purple-600 to-indigo-600
                         text-white hover:opacity-90 transition"
            >
              Save Changes
            </button>

            <button
              onClick={() => setEditItem(null)}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
}