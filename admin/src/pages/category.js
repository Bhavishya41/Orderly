"use client";
import { useEffect, useState } from "react";
import RequireAuth from "./../context/RequireAuth";
import CategoryTable from "./../components/dashboard/category/CategoryTable";
import AddCategoryModal from "./../components/dashboard/category/AddCategoryModal";
import { HiOutlinePlus } from "react-icons/hi";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterName, setFilterName] = useState("");

  // Fetch categories
  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        credentials: "include",
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category handler
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchCategories();
    } catch (err) {
      // Optionally handle error
    }
  }

  // Filtered categories
  const filteredCategories = categories.filter(cat =>
    !filterName || cat.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#18181b] p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-pink-400 tracking-tight">Manage Categories</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
          >
            <HiOutlinePlus className="w-5 h-5 mr-2" />
            Add Category
          </button>
        </div>
        {/* Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search Name"
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
            className="bg-gray-800 text-gray-100 border border-gray-700 rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={() => setFilterName("")}
            className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow transition hover:from-rose-700 hover:to-pink-700"
          >
            Clear
          </button>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-800">
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-gray-400">No categories found.</div>
          ) : (
            <CategoryTable categories={filteredCategories} onDelete={handleDelete} />
          )}
        </div>
        {/* Add Modal */}
        {showAddModal && (
          <AddCategoryModal
            onClose={() => setShowAddModal(false)}
            onCategoryAdded={() => {
              fetchCategories();
              setShowAddModal(false);
            }}
          />
        )}
      </div>
    </RequireAuth>
  );
}
