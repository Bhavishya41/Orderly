"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check for token in URL params (from user frontend redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log("Token from URL:", token);
    if (token) {
      console.log("Logging in with token from URL");
      login(token);
      router.push('/dashboard');
    }
  }, [login, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Form submitted");

    // Replace with your backend API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Login success, token:", data.token);
      login(data.token);
      router.push("/dashboard");
    } else {
      const err = await res.json();
      setError(err.message || "Login failed");
      console.log("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Admin Login
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
