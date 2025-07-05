function formatDate(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function OrderTable({ orders, getOrderTotal }) {
  return (
    <div className="overflow-x-auto bg-[#18181b] rounded-2xl shadow-md p-0 border border-[#232336]">
      <table className="min-w-full text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-[#232336] hover:bg-[#232336]/60 transition">
              <td className="px-4 py-2 font-semibold">{order._id.slice(-6)}</td>
              <td className="px-4 py-2">{order.username || "—"}</td>
              <td className="px-4 py-2">{formatDate(order.orderDate)}</td>
              <td className="px-4 py-2 capitalize">{order.status || "pending"}</td>
              <td className="px-4 py-2">₹{getOrderTotal(order)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
