import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function VerifyEmail() {
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const { token } = router.query;
      
      if (!token) {
        setStatus("error");
        setError("No verification token provided.");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/verify-email?token=${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setError(data.message);
        }
      } catch (err) {
        setStatus("error");
        setError("Something went wrong. Please try again.");
      }
    };

    if (router.query.token) {
      verifyEmail();
    }
  }, [router.query]);

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
          <h2 className="text-3xl font-bold text-white mb-8">Email Verification</h2>
          
          {status === "verifying" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Verifying your email address...</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-400 text-lg font-semibold mb-4">{message}</p>
              <Link 
                href="/auth/login"
                className="px-8 py-3 rounded-xl font-semibold text-lg relative overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-orange-500 text-white shadow border border-orange-400"
              >
                Go to Login
              </Link>
            </div>
          )}
          
          {status === "error" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-400 text-lg font-semibold mb-4">{error}</p>
              <div className="space-y-3">
                <Link 
                  href="/auth/login"
                  className="block px-8 py-3 rounded-xl font-semibold text-lg relative overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-orange-500 text-white shadow border border-orange-400"
                >
                  Go to Login
                </Link>
                <Link 
                  href="/auth/signup"
                  className="block px-8 py-3 rounded-xl font-semibold text-lg relative overflow-hidden transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-gray-600 text-white shadow border border-gray-500"
                >
                  Sign Up Again
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 