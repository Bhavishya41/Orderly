import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero({ marqueeImages = [] }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/profile`, {
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
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[600px] py-32">
      <div className="relative z-10 max-w-4xl w-full">
        <div 
          className="rounded-2xl p-16 flex flex-col items-center relative overflow-hidden backdrop-blur-md"
          style={{
            background: "rgba(26, 26, 26, 0.7)",
            border: "1px solid rgba(255, 140, 0, 0.3)",
            boxShadow: "0 0 30px rgba(255, 140, 0, 0.2), 0 0 60px rgba(255, 140, 0, 0.1), 0 8px 32px rgba(0,0,0,0.3)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Glassmorphism overlay */}
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
              border: "1px solid rgba(255, 255, 255, 0.18)",
            }}
          />
          
          {/* Neon border glow effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(45deg, transparent, rgba(255, 140, 0, 0.1), transparent)",
              boxShadow: "inset 0 0 20px rgba(255, 140, 0, 0.2)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center">
            <h1 
              className="text-6xl font-extrabold mb-6 tracking-tight"
              style={{
                background: "linear-gradient(45deg, #ffffff, #ff6b35)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 20px rgba(255, 107, 53, 0.3)",
              }}
            >
              Welcome to <span style={{ color: "#ff6b35" }}>Orderly</span>
            </h1>
            <p 
              className="text-gray-300 text-xl mb-12 leading-relaxed max-w-3xl mx-auto"
              style={{
                textShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
              }}
            >
              Discover, search, and order the best products—fast, secure, and easy.<br />
              Your one-stop shop for a seamless shopping experience.
            </p>
            
            {/* Buttons with neon effects */}
            <div className="flex gap-6 justify-center">
              <Link href="/product">
                <button 
                  className="px-8 py-4 rounded-xl font-semibold text-xl relative overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  style={{
                    background: "rgba(255, 107, 53, 0.9)",
                    color: "white",
                    boxShadow: "0 0 20px rgba(255, 107, 53, 0.4), 0 4px 15px rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255, 107, 53, 0.3)",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = "0 0 30px rgba(255, 107, 53, 0.6), 0 0 60px rgba(255, 107, 53, 0.2), 0 4px 15px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = "0 0 20px rgba(255, 107, 53, 0.4), 0 4px 15px rgba(0,0,0,0.2)";
                  }}
                >
                  Get Started
                </button>
              </Link>
              {!loading && !loggedIn && (
                <Link href="/auth/login">
                  <button 
                    className="px-8 py-4 rounded-xl font-semibold text-xl relative overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      color: "#ff6b35",
                      boxShadow: "0 0 20px rgba(255, 107, 53, 0.3), 0 4px 15px rgba(0,0,0,0.2)",
                      border: "1px solid rgba(255, 107, 53, 0.4)",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = "0 0 30px rgba(255, 107, 53, 0.5), 0 0 60px rgba(255, 107, 53, 0.2), 0 4px 15px rgba(0,0,0,0.2)";
                      e.target.style.background = "rgba(255, 255, 255, 1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = "0 0 20px rgba(255, 107, 53, 0.3), 0 4px 15px rgba(0,0,0,0.2)";
                      e.target.style.background = "rgba(255, 255, 255, 0.95)";
                    }}
                  >
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
