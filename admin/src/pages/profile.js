"use client";
import { useEffect, useState } from "react";
import { HiOutlineKey, HiOutlineLogout } from "react-icons/hi";
import RequireAuth from "./../context/RequireAuth";
import { useAuth } from "./../context/AuthContext";

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0 });

  // Fetch profile and stats
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = res.ok ? await res.json() : null;
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    async function fetchStats() {
      try {
        const [productsRes, ordersRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, { 
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, { 
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, { 
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
        ]);
        const [products, orders, categories] = await Promise.all([
          productsRes.ok ? productsRes.json() : [],
          ordersRes.ok ? ordersRes.json() : [],
          categoriesRes.ok ? categoriesRes.json() : [],
        ]);
        setStats({
          products: Array.isArray(products) ? products.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    if (token) {
      fetchProfile();
      fetchStats();
    }
  }, [token]);

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
              onClick={async () => {
                try {
                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
                    method: "POST",
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                } catch (err) {
                  console.error("Logout error:", err);
                }
                window.location.href = process.env.NEXT_PUBLIC_USER_FRONTEND_URL || "http://localhost:3000/";
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
