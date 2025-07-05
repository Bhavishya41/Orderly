import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="bg-[#18181b] rounded-2xl shadow-md p-0 border border-[#232336] overflow-x-auto">
      <table className="min-w-full text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              className="border-b border-[#232336] hover:bg-[#232336]/60 transition"
            >
              <td className="px-4 py-2 font-semibold">{product.name}</td>
              <td className="px-4 py-2">{product.category?.name || "—"}</td>
              <td className="px-4 py-2">₹{product.price}</td>
              <td className="px-4 py-2">{product.stock}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="inline-flex items-center px-2 py-1 rounded bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white transition"
                  title="Edit"
                >
                  <HiOutlinePencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(product._id)}
                  className="inline-flex items-center px-2 py-1 rounded bg-pink-600 hover:bg-pink-700 text-white transition"
                  title="Delete"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
