import Link from "next/link";
import { HiOutlineSearch, HiOutlineShoppingCart, HiOutlineLogout, HiOutlineUserCircle } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useCart from "./../../contexts/cartContext";
import { useRef } from "react";

export const NAVBAR_HEIGHT = 88; // px, matches py-6 and text size

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { cart, cartCount } = useCart();
  const [bounce, setBounce] = useState(false);
  const prevCartCount = useRef(cartCount);

  useEffect(() => {
    if (prevCartCount.current !== cartCount) {
      setBounce(true);
      setTimeout(() => setBounce(false), 400);
      prevCartCount.current = cartCount;
    }
  }, [cartCount]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/user/profile", {
          credentials: "include",
        });
        setLoggedIn(res.ok);
      } catch {
        setLoggedIn(false);
      }
      setLoading(false);
    };
    checkAuth();
    window.addEventListener("authchange", checkAuth);
    return () => window.removeEventListener("authchange", checkAuth);
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:8000/user/logout", {
      method: "POST",
      credentials: "include",
    });
    setLoggedIn(false);
    window.dispatchEvent(new Event("authchange"));
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/product?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-6 border-b border-white/10 bg-black/30 backdrop-blur-xl z-50">
      {/* Logo with neon glow */}
      <Link href="/" className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg"
                style={{
                  boxShadow: "0 0 20px rgba(255, 107, 53, 0.4), 0 0 40px rgba(255, 107, 53, 0.2)",
                }}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" fill="#fff" stroke="#f97316" strokeWidth="2"/>
              <rect x="8" y="8" width="12" height="12" rx="4" fill="#f97316" />
              <circle cx="14" cy="14" r="3" fill="#fff" />
            </svg>
          </span>
          {/* Logo glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 blur-lg opacity-30" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight select-none"
              style={{
                textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
              }}>
          Orderly
        </span>
      </Link>

      {/* Search Bar with neon border */}
      <form onSubmit={handleSearch} className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 placeholder:text-white/40 backdrop-blur-sm"
            style={{
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
            }}
          />
          <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-6 h-6" />
          {/* Search glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none" />
        </div>
      </form>

      {/* Auth Buttons with neon effects */}
      <div className="flex gap-3 ml-6 items-center">
        {loading ? null : loggedIn ? (
          <>
            <Link href="/profile">
              <button
                className="p-2 rounded-full bg-white/10 hover:bg-orange-500/80 hover:text-white transition shadow-md border border-white/20 backdrop-blur-sm flex items-center justify-center"
                title="Profile"
                aria-label="Profile"
              >
                <HiOutlineUserCircle className="w-7 h-7" />
              </button>
            </Link>
            <Link href="/cart">
              <button
                className="p-2 rounded-full bg-white/10 hover:bg-orange-500/80 hover:text-white transition shadow-md border border-white/20 backdrop-blur-sm flex items-center justify-center relative"
                title="Cart"
                aria-label="Cart"
              >
                <HiOutlineShoppingCart className={`w-7 h-7 transition-transform ${bounce ? 'animate-bounce-cart' : ''}`} />
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow border-2 border-black transition-transform ${bounce ? 'animate-bounce-cart' : ''}`}>
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-white/10 hover:bg-red-500/80 hover:text-white transition shadow-md border border-white/20 backdrop-blur-sm flex items-center justify-center"
              title="Logout"
              aria-label="Logout"
            >
              <HiOutlineLogout className="w-7 h-7" />
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <button 
                className="px-6 py-3 rounded-xl font-semibold text-white relative overflow-hidden transition-all duration-300 hover:scale-105 group"
                style={{
                  background: "linear-gradient(135deg, #ff6b35, #ff8c42)",
                  boxShadow: "0 0 20px rgba(255, 107, 53, 0.4), 0 4px 15px rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255, 107, 53, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = "0 0 30px rgba(255, 107, 53, 0.6), 0 0 60px rgba(255, 107, 53, 0.2), 0 4px 15px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = "0 0 20px rgba(255, 107, 53, 0.4), 0 4px 15px rgba(0,0,0,0.2)";
                }}
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
            
            <Link href="/auth/signup">
              <button 
                className="px-6 py-3 rounded-xl font-semibold text-white relative overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-sm group"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.1), 0 4px 15px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = "0 0 30px rgba(255, 255, 255, 0.2), 0 0 60px rgba(255, 255, 255, 0.1), 0 4px 15px rgba(0,0,0,0.2)";
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.1), 0 4px 15px rgba(0,0,0,0.2)";
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
          </>
        )}
      </div>
      {/* Bounce animation style */}
      <style jsx global>{`
        @keyframes bounce-cart {
          0% { transform: scale(1); }
          30% { transform: scale(1.3); }
          60% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-bounce-cart {
          animation: bounce-cart 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>
    </nav>
  );
}
