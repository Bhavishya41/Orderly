import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HiOutlineX } from "react-icons/hi";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwFormOpen, setPwFormOpen] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwSuccess("");
    setPwError("");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwSuccess(data.message || "Password updated successfully!");
        setCurrPassword("");
        setNewPassword("");
      } else {
        setPwError(data.message || "Failed to update password.");
      }
    } catch (err) {
      setPwError("Network error. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const [userRes, ordersRes] = await Promise.all([
                  fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/profile`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/order`, { credentials: "include" })
        ]);
        if (!userRes.ok) throw new Error("Failed to fetch user info");
        if (!ordersRes.ok) throw new Error("Failed to fetch orders");
        const userData = await userRes.json();
        const ordersData = await ordersRes.json();
        setUser(userData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndOrders();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-black text-red-400 text-xl">{error}</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-16 px-4 flex flex-col items-center relative overflow-hidden">
      {/* Cross (close) button to go back */}
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl z-10 border border-white/20 shadow"
        title="Go Back"
        aria-label="Go Back"
      >
        <HiOutlineX />
      </button>
      <div className="w-full max-w-2xl bg-white/5 rounded-2xl p-8 shadow-lg border border-white/10 mb-10">
        <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>
        <div className="text-white/80 text-lg mb-2"><span className="font-semibold">Name:</span> {user.name}</div>
        <div className="text-white/80 text-lg mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
        {/* Change Password Button and Form */}
        {!pwFormOpen ? (
          <button
            className="mt-8 px-6 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            onClick={() => setPwFormOpen(true)}
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handleChangePassword} className="mt-8 flex flex-col gap-4 bg-black/20 p-6 rounded-xl border border-white/10">
            <div className="text-lg font-semibold text-white mb-2">Change Password</div>
            <input
              type="password"
              placeholder="Current Password"
              value={currPassword}
              onChange={e => setCurrPassword(e.target.value)}
              className="px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                disabled={pwLoading}
                className="px-6 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pwLoading ? "Updating..." : "Change Password"}
              </button>
              <button
                type="button"
                className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold"
                onClick={() => { setPwFormOpen(false); setPwSuccess(""); setPwError(""); setCurrPassword(""); setNewPassword(""); }}
              >
                Cancel
              </button>
            </div>
            {pwSuccess && <div className="text-green-400 font-semibold mt-2">{pwSuccess}</div>}
            {pwError && <div className="text-red-400 font-semibold mt-2">{pwError}</div>}
          </form>
        )}
      </div>
      <div className="w-full max-w-3xl bg-white/5 rounded-2xl p-8 shadow-lg border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Your Orders</h2>
        {orders.length === 0 ? (
          <div className="text-white/60 text-lg">You have not placed any orders yet.</div>
        ) : (
          <div className="flex flex-col gap-8">
            {orders.map(order => (
              <div key={order._id} className="bg-black/30 rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-white font-semibold">Order ID: <span className="text-white/60 text-sm">{order._id}</span></div>
                  <div className="text-white/60 text-sm">{new Date(order.orderDate).toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <div className="text-white/80 font-semibold mb-1">Items:</div>
                  <ul className="list-disc list-inside text-white/70">
                    {order.products.map((item, idx) => (
                      <li key={idx}>
                        {item.name} &times; {item.quantity} <span className="text-white/50">(₹{item.price} each)</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-orange-400 font-bold text-lg mt-2">
                  Total: ₹{order.products.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 