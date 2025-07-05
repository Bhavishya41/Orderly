"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "./../context/RequireAuth";
import { useAuth } from "./../context/AuthContext";
import { HiOutlineViewGrid, HiOutlineCube, HiOutlineTag, HiOutlineClipboardList, HiOutlineUserCircle } from "react-icons/hi";
import { useRouter } from "next/navigation";

// Simple icon SVGs for sidebar
const icons = {
  dashboard: <HiOutlineViewGrid className="w-6 h-6 mr-2 text-blue-400" />,
  products: <HiOutlineCube className="w-6 h-6 mr-2 text-purple-400" />,
  categories: <HiOutlineTag className="w-6 h-6 mr-2 text-rose-400" />,
  orders: <HiOutlineClipboardList className="w-6 h-6 mr-2 text-purple-400" />,
  profile: <HiOutlineUserCircle className="w-6 h-6 mr-2 text-gray-400" />,
};

export default function Dashboard() {
  const { token, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      console.log("Token:", token);
      console.log("Is authenticated:", isAuthenticated);
      if (!token) {
        console.log("No token available");
        return;
      }
      try {
        const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const products = productsRes.ok ? await productsRes.json() : [];

        const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];

        const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const orders = ordersRes.ok ? await ordersRes.json() : [];

        const totalValue = products.reduce(
          (sum, p) => sum + (Number(p.price) * Number(p.stock)),
          0
        );

        setProducts(products);
        setCategories(categories);
        setOrders(orders);

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
        });

        setTotalInventoryValue(totalValue);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    logout();
    router.push(process.env.NEXT_PUBLIC_USER_FRONTEND_URL || "http://localhost:3000/");
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated && !loading) {
    router.push('/login');
    return null;
  }

  return (
    <RequireAuth>
      <div className="min-h-screen flex bg-[#18181b]">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/90 backdrop-blur-md shadow-2xl flex flex-col p-6 min-h-screen border-r border-gray-800">
          <div className="flex items-center mb-10">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=18181b&color=fff"
              alt="Admin Avatar"
              className="w-12 h-12 rounded-full mr-3 border-2 border-blue-500"
            />
            <div>
              <div className="font-bold text-blue-400 text-lg">Admin</div>
              <div className="text-xs text-gray-400">Inventory Manager</div>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <SidebarLink href="/dashboard" icon={icons.dashboard} label="Dashboard" />
            <SidebarLink href="/product" icon={icons.products} label="Products" />
            <SidebarLink href="/category" icon={icons.categories} label="Categories" />
            <SidebarLink href="/order" icon={icons.orders} label="Orders" />
            <SidebarLink href="/profile" icon={icons.profile} label="Profile" />
          </nav>
          <div className="mt-auto pt-8">
            <button
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 bg-[#18181b]">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-400 mb-1 tracking-tight">Welcome, Admin!</h1>
              <p className="text-gray-400">Here's an overview of your inventory system.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-400">Online</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Products" value={stats.products} href="/product" color="from-blue-800 to-blue-600" />
            <StatCard label="Categories" value={stats.categories} href="/category" color="from-rose-800 to-pink-600" />
            <StatCard label="Orders" value={stats.orders} href="/order" color="from-purple-800 to-purple-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top 5 Products by Stock */}
            <WidgetCard title="Top 5 Products by Stock">
              <ul className="text-gray-200">
                {products
                  .slice()
                  .sort((a, b) => b.stock - a.stock)
                  .slice(0, 5)
                  .map((p) => (
                    <li key={p._id} className="mb-1">
                      <span className="font-semibold">{p.name}</span> — Stock: {p.stock}
                    </li>
                  ))}
              </ul>
            </WidgetCard>
            {/* Total Inventory Value */}
            <WidgetCard title="Total Inventory Value">
              <div className="text-2xl font-bold text-purple-400">
                ₹{totalInventoryValue.toLocaleString()}
              </div>
            </WidgetCard>
            {/* Recent Orders */}
            <WidgetCard title="Recent Orders">
              <ul className="text-gray-200">
                {orders
                  .slice()
                  .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                  .slice(0, 5)
                  .map((order) => (
                    <li key={order._id} className="mb-1">
                      <span className="font-semibold">Order #{order._id.slice(-5)}</span> —{" "}
                      {order.products.length} items —{" "}
                      {new Date(order.orderDate).toLocaleString()}
                    </li>
                  ))}
              </ul>
            </WidgetCard>
            {/* Low Stock Alerts */}
            <WidgetCard title="Low Stock Alerts" titleClass="text-red-400">
              <ul className="text-gray-200">
                {products.filter((p) => p.stock < 5).length === 0 ? (
                  <li>All products are sufficiently stocked.</li>
                ) : (
                  products
                    .filter((p) => p.stock < 5)
                    .map((p) => (
                      <li key={p._id} className="mb-1">
                        <span className="font-semibold">{p.name}</span> — Stock: {p.stock}
                      </li>
                    ))
                )}
              </ul>
            </WidgetCard>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

// Sidebar link with active highlight (optional: you can add active state logic)
function SidebarLink({ href, icon, label }) {
  return (
    <Link href={href} className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800 transition font-medium text-gray-200 hover:text-blue-400">
      {icon}
      {label}
    </Link>
  );
}

// Stat card for quick stats
function StatCard({ label, value, href, color = "from-blue-800 to-blue-600" }) {
  return (
    <Link href={href}>
      <div className={`bg-gradient-to-r ${color} rounded-xl shadow-md p-6 mb-6 transition hover:shadow-xl text-center cursor-pointer transform hover:-translate-y-1 duration-200`}>
        <div className="text-3xl font-extrabold text-white drop-shadow">{value}</div>
        <div className="text-gray-200 text-lg font-semibold">{label}</div>
      </div>
    </Link>
  );
}

// Widget card for analytics
function WidgetCard({ title, children, titleClass = "text-blue-400" }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-md p-6 mb-6 transition hover:shadow-lg border border-gray-800">
      <h3 className={`text-lg font-bold mb-2 ${titleClass}`}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
