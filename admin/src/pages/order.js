"use client";
import { useEffect, useState } from "react";
import RequireAuth from "./../context/RequireAuth";
import OrderTable from "../components/dashboard/order/OrderTable";
import OrderFilterBar from "../components/dashboard/order/OrderFilterBar";
import { useAuth } from "./../context/AuthContext";

export default function ManageOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Fetch orders
  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = res.ok ? await res.json() : [];
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus =
      !filterStatus ||
      (order.status && order.status.toLowerCase().trim() === filterStatus.toLowerCase().trim());
    const matchesUser =
      !filterUser ||
      (order.username && order.username.toLowerCase().includes(filterUser.toLowerCase())) ||
      (order.user?.name && order.user.name.toLowerCase().includes(filterUser.toLowerCase()));
    const matchesDate =
      !filterDate ||
      (order.orderDate && toLocalYMD(order.orderDate) === filterDate);
    return matchesStatus && matchesUser && matchesDate;
  });

  function getOrderTotal(order) {
    return order.products.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);
  }

  function handleClearFilters() {
    setFilterStatus("");
    setFilterUser("");
    setFilterDate("");
  }

  function toLocalYMD(dateString) {
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#18181b] p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-purple-400 tracking-tight">Manage Orders</h1>
        </div>
        {/* Filter Bar */}
        <OrderFilterBar
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterUser={filterUser}
          setFilterUser={setFilterUser}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          onClear={handleClearFilters}
        />
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-6 border border-gray-800">
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-gray-400">No orders found.</div>
          ) : (
            <OrderTable orders={filteredOrders} getOrderTotal={getOrderTotal} />
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
