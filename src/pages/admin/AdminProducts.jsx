import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [recipes, setRecipes] = useState([]);
  const [ingredientId, setIngredientId] = useState("");
  const [qtyUsed, setQtyUsed] = useState("");

  const loadAll = async () => {
    try {
      const [p, i] = await Promise.all([
        api.get("products/"),
        api.get("ingredients/"),
      ]);
      setProducts(p.data);
      setIngredients(i.data);
    } catch {
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const addProduct = async () => {
    if (!name || !price) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.post("products/", { name, price });
      setName("");
      setPrice("");
      loadAll();
    } catch {
      alert("Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`products/${id}/`);
      loadAll();
    } catch {
      alert("Cannot delete product");
    }
  };

  const openRecipe = async (product) => {
    try {
      const res = await api.get(
        `products/${product.id}/recipes/`
      );
      setSelectedProduct(product);
      setRecipes(res.data);
    } catch {
      alert("Failed to load recipes");
    }
  };

  const addRecipe = async () => {
    if (!ingredientId || !qtyUsed) return;

    try {
      await api.post(
        `products/${selectedProduct.id}/recipes/`,
        {
          ingredient: ingredientId,
          quantity_used: qtyUsed,
        }
      );
      openRecipe(selectedProduct);
      setIngredientId("");
      setQtyUsed("");
    } catch {
      alert("Failed to add recipe");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-purple-50 to-purple-100 p-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-purple-700 tracking-tight">
          Products & Recipes
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage menu items and ingredient recipes
        </p>
      </div>

      {/* ADD PRODUCT CARD */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-purple-700 mb-4">
          Add New Product
        </h2>

        <div className="flex flex-wrap gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <button
            onClick={addProduct}
            className="px-6 py-2 rounded-lg text-white text-sm font-medium
                       bg-gradient-to-r from-purple-600 to-indigo-600
                       hover:opacity-90 transition"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* PRODUCT TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-4 text-left font-semibold">ID</th>
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Price</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t border-purple-100 hover:bg-purple-50/40 transition"
              >
                <td className="p-4 text-gray-600">{p.id}</td>
                <td className="p-4 font-medium text-gray-800">
                  {p.name}
                </td>
                <td className="p-4 text-purple-700 font-semibold">
                  ₹{p.price}
                </td>

                <td className="p-4 space-x-4">
                  <button
                    onClick={() => openRecipe(p)}
                    className="text-purple-600 font-medium hover:underline"
                  >
                    Recipes
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-500 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* RECIPE MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 w-96 max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-semibold text-purple-700 mb-4 text-center">
              Recipe – {selectedProduct.name}
            </h2>

            {recipes.length === 0 && (
              <p className="text-sm text-gray-400 mb-4 text-center">
                No ingredients added yet
              </p>
            )}

            {recipes.map((r) => (
              <div
                key={r.id}
                className="flex justify-between text-sm mb-2 bg-purple-50 px-3 py-2 rounded-lg"
              >
                <span>{r.ingredient_name}</span>
                <span className="font-semibold text-purple-700">
                  {r.quantity_used}
                </span>
              </div>
            ))}

            <hr className="my-4 border-purple-100" />

            <div className="space-y-3">
              <select
                value={ingredientId}
                onChange={(e) =>
                  setIngredientId(e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="">Select Ingredient</option>
                {ingredients.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={qtyUsed}
                onChange={(e) =>
                  setQtyUsed(e.target.value)
                }
                placeholder="Quantity used"
                className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <button
                onClick={addRecipe}
                className="w-full py-2 rounded-lg text-sm font-medium
                           bg-gradient-to-r from-purple-600 to-indigo-600
                           text-white hover:opacity-90 transition"
              >
                Add Ingredient
              </button>
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}