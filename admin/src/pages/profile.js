"use client";
import { useEffect, useState } from "react";
import { HiOutlineKey, HiOutlineLogout } from "react-icons/hi";
import RequireAuth from "./../context/RequireAuth";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0 });

  // Fetch profile and stats
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
          credentials: "include",
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    async function fetchStats() {
      try {
        const [productsRes, ordersRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, { credentials: "include" }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, { credentials: "include" }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, { credentials: "include" }),
        ]);
        const [products, orders, categories] = await Promise.all([
          productsRes.json(),
          ordersRes.json(),
          categoriesRes.json(),
        ]);
        setStats({
          products: Array.isArray(products) ? products.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
        });
      } catch (err) {}
    }
    fetchProfile();
    fetchStats();
  }, []);

  if (loading || !profile) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
          <div className="text-gray-400">Loading...</div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center p-8">
        {/* Profile Card */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-800 w-full max-w-md flex flex-col items-center relative">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=18181b&color=fff`}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-purple-500 shadow-lg mb-4"
          />
          <span className="text-2xl font-extrabold text-purple-400 mb-2">{profile.name}</span>
          <div className="mb-1 text-gray-300">
            <span className="font-mono text-sm">{profile.email}</span>
          </div>
          <div className="mb-4">
            <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full shadow">
              {profile.role?.toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-rose-600 text-white px-3 py-1 rounded-lg text-sm shadow transition"
            >
              <HiOutlineKey className="w-4 h-4" />
              Change Password
            </button>
            <button
              onClick={() => {
                // You can implement logout logic here
                window.location.href = "/auth/login";
              }}
              className="flex items-center gap-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-3 py-1 rounded-lg text-sm shadow transition"
            >
              <HiOutlineLogout className="w-4 h-4" />
              Logout
            </button>
          </div>
          <div className="flex justify-between w-full mt-4">
            <ProfileStat label="Products" value={stats.products} color="from-blue-800 to-blue-600" />
            <ProfileStat label="Orders" value={stats.orders} color="from-purple-800 to-purple-600" />
            <ProfileStat label="Categories" value={stats.categories} color="from-rose-800 to-pink-600" />
          </div>
        </div>
        {/* Password Modal */}
        {showPasswordModal && (
          <PasswordModal
            onClose={() => setShowPasswordModal(false)}
          />
        )}
      </div>
    </RequireAuth>
  );
}

// Profile Stat Widget
function ProfileStat({ label, value, color }) {
  return (
    <div className={`flex flex-col items-center bg-gradient-to-r ${color} rounded-xl px-4 py-2 shadow-md`}>
      <div className="text-lg font-extrabold text-white">{value}</div>
      <div className="text-xs text-gray-200">{label}</div>
    </div>
  );
}

// Password Change Modal (with correct endpoint/method/body)
function PasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleChangePassword(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currPassword: oldPassword, newPassword }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to change password");
      }
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900/90 backdrop-blur-md rounded-xl shadow-lg p-8 border border-gray-800 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-rose-400 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold text-blue-400 mb-6">Change Password</h2>
        {error && <div className="mb-4 text-rose-400">{error}</div>}
        {success && <div className="mb-4 text-green-400">Password changed successfully!</div>}
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
