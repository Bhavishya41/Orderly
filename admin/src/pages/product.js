import { useEffect, useState } from "react";
import ProductForm from "../components/dashboard/product/ProductForm";
import RequireAuth from "./../context/RequireAuth";
import ProductTable from "../components/dashboard/product/productTable";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Fetch products
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  async function handleDelete(productId) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err) {
      setError("Error deleting product");
    }
  }

  // Open form for add/edit
  function openAddForm() {
    setEditProduct(null);
    setShowForm(true);
  }
  function openEditForm(product) {
    setEditProduct(product);
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setEditProduct(null);
  }
  function handleProductSaved() {
    fetchProducts();
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#18181b] p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-blue-400 tracking-tight">Manage Products</h1>
          <button
            className="inline-flex items-center bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
            onClick={openAddForm}
          >
            + Add Product
          </button>
        </div>
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Search Name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-800 text-gray-100 border border-gray-700 rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-gray-800 text-gray-100 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-800">
          {error && <div className="text-blue-400 mb-4">{error}</div>}
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-gray-400">No products found.</div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          )}
        </div>
        {showForm && (
          <ProductForm
            onClose={closeForm}
            onProductSaved={handleProductSaved}
            initialData={editProduct}
          />
        )}
      </div>
    </RequireAuth>
  );
}
