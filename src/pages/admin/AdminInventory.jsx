import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminInventory() {
  const [ingredients, setIngredients] = useState([]);
  const [lowStockIds, setLowStockIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Editing
  const [editItem, setEditItem] = useState(null);
  const [newStock, setNewStock] = useState("");

  // Load inventory
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

  // Update stock
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
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Inventory Manager
      </h1>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading inventory...
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Ingredient</th>
                <th className="p-3 text-left">Current Stock</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {ingredients.map((item) => {
                const low = lowStockIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {item.name}
                    </td>

                    <td className="p-3">
                      {item.current_stock}
                    </td>

                    <td className="p-3">
                      {low ? (
                        <span className="text-red-600 font-semibold">
                          ⚠️ Low
                        </span>
                      ) : (
                        <span className="text-green-600">
                          OK
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => {
                          setEditItem(item);
                          setNewStock(item.current_stock);
                        }}
                        className="text-blue-600"
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

      {/* Update Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-80">
            <h2 className="text-lg font-bold mb-3 text-center">
              Update Stock
            </h2>

            <p className="text-sm mb-2">
              Ingredient:{" "}
              <b>{editItem.name}</b>
            </p>

            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="border w-full px-2 py-2 mb-4"
              placeholder="New stock"
            />

            <button
              onClick={updateStock}
              className="w-full bg-black text-white py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setEditItem(null)}
              className="w-full mt-2 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
