import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SetupPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email);
    }
  }, [router.query.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/user/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to set password.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setLoading(false);
      
      // Redirect to home page
      window.location.href = "/";
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div
        className="relative rounded-2xl p-10 md:p-16 w-full max-w-md flex flex-col items-center overflow-hidden backdrop-blur-md"
        style={{
          background: "#1a1a1a",
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
        <div className="relative z-10 w-full flex flex-col items-center">
          <h2 className="text-3xl font-bold text-white mb-2">Set Your Password</h2>
          <p className="text-gray-400 text-center mb-8">
            Welcome! Please set a password for your account ({email})
          </p>
          
          <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              className="px-5 py-3 rounded-xl bg-black/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="px-5 py-3 rounded-xl bg-black/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="mt-2 px-8 py-3 rounded-xl font-semibold text-lg relative overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-orange-500 text-white shadow border border-orange-400"
              disabled={loading}
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 