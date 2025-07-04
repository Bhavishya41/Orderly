import { useState } from "react";
import Link from "next/link";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Submitting...");
      console.log("About to fetch...");
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
        credentials: "include",
      });
      console.log("Fetch done", res);
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Sign up failed.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setSuccess(true);
      setError(""); // Clear any previous errors
      // Don't redirect immediately, show success message
      setTimeout(() => {
        window.location.href = "/auth/login?message=verification_sent";
      }, 3000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Redirect to Google OAuth with signup parameter
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/api/auth/google?from=signup`;
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
          <h2 className="text-3xl font-bold text-white mb-8">Create your account</h2>
          <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="px-5 py-3 rounded-xl bg-black/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="px-5 py-3 rounded-xl bg-black/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="px-5 py-3 rounded-xl bg-black/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="px-5 py-3 rounded-xl bg-black/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            {success && <div className="text-green-400 text-sm text-center">Account created! Redirecting...</div>}
            <button
              type="submit"
              className="mt-2 px-8 py-3 rounded-xl font-semibold text-lg relative overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-orange-500 text-white shadow border border-orange-400"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          
          <div className="relative w-full my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full px-8 py-3 rounded-xl font-semibold text-lg relative overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-white text-gray-800 shadow border border-gray-300 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            Google users will be asked to set a password for additional security
          </div>
          
          <div className="mt-6 text-gray-300 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-orange-400 hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 