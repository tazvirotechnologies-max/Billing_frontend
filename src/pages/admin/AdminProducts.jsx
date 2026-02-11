import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  // New product
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  // Recipe editor
  const [recipes, setRecipes] = useState([]);
  const [ingredientId, setIngredientId] = useState("");
  const [qtyUsed, setQtyUsed] = useState("");

  // Load data
  const loadAll = async () => {
    try {
      const [p, c, i] = await Promise.all([
        api.get("products/"),
        api.get("categories/"),
        api.get("ingredients/"),
      ]);

      setProducts(p.data);
      setCategories(c.data);
      setIngredients(i.data);
    } catch {
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Add product
  const addProduct = async () => {
    if (!name || !price || !category) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.post("products/", {
        name,
        price,
        category,
      });

      setName("");
      setPrice("");
      setCategory("");

      loadAll();
    } catch {
      alert("Failed to add product");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      await api.delete(`products/${id}/`);
      loadAll();
    } catch {
      alert("Cannot delete product");
    }
  };

  // Open recipe editor
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

  // Add recipe item
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
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Products & Recipes
      </h1>

      {/* Add Product */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="font-semibold mb-3">Add Product</h2>

        <div className="flex flex-wrap gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border px-2 py-1 rounded"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="border px-2 py-1 rounded"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={addProduct}
            className="bg-black text-white px-4 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.category_name}</td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() => openRecipe(p)}
                    className="text-blue-600"
                  >
                    Recipes
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recipe Editor */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold mb-3 text-center">
              Recipe – {selectedProduct.name}
            </h2>

            {recipes.map((r) => (
              <div
                key={r.id}
                className="flex justify-between text-sm mb-2"
              >
                <span>{r.ingredient_name}</span>
                <span>{r.quantity_used}</span>
              </div>
            ))}

            <hr className="my-3" />

            {/* Add Ingredient */}
            <div className="space-y-2">
              <select
                value={ingredientId}
                onChange={(e) =>
                  setIngredientId(e.target.value)
                }
                className="border w-full px-2 py-1"
              >
                <option value="">Ingredient</option>

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
                className="border w-full px-2 py-1"
              />

              <button
                onClick={addRecipe}
                className="w-full bg-black text-white py-2 rounded"
              >
                Add Ingredient
              </button>
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full mt-3 text-gray-500 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
