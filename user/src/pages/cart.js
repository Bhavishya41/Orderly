import useCart from "../contexts/cartContext";
import { HiOutlineX } from "react-icons/hi";
import { useRouter } from "next/router";
import { useState } from "react";
import React from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check user role on component mount
  React.useEffect(() => {
    const checkUserRole = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/profile`, {
          credentials: "include",
        });
        if (res.ok) {
          const user = await res.json();
          setUserRole(user.role);
        }
      } catch (err) {
        console.error("Failed to get user role:", err);
      }
    };
    checkUserRole();
  }, []);

  const handleRequestOtp = async () => {
    setSendingOtp(true);
    setOtpError("");
    
    // Skip OTP for admin users
    if (userRole === "admin") {
      handlePlaceOrderDirect();
      return;
    }
    
    try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/order/request-otp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setShowOtpModal(true);
      } else {
        const data = await res.json();
        if (data.message && data.message.includes("verify your email")) {
          setShowVerificationModal(true);
        } else {
          setOtpError(data.message || "Failed to send OTP.");
        }
      }
    } catch (err) {
      setOtpError("Network error. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    try {
      // Get user email from profile
              const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/profile`, {
        credentials: "include",
      });
      
      if (profileRes.ok) {
        const user = await profileRes.json();
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/user/resend-verification`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });
        
        if (res.ok) {
          setOtpError("Verification email sent! Please check your inbox and verify your email.");
          setShowVerificationModal(false);
        } else {
          const data = await res.json();
          setOtpError(data.message || "Failed to send verification email.");
        }
      } else {
        setOtpError("Failed to get user profile.");
      }
    } catch (err) {
      setOtpError("Network error. Please try again.");
    } finally {
      setResendingVerification(false);
    }
  };

  const handlePlaceOrderDirect = async () => {
    setPlacingOrder(true);
    setOrderError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: cart, otp: "" }), // Empty OTP for admin
      });
      if (res.ok) {
        setOrderSuccess(true);
        clearCart();
      } else {
        const data = await res.json();
        setOtpError(data.message || "Failed to place order.");
      }
    } catch (err) {
      setOtpError("Network error. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }

    setPlacingOrder(true);
    setOrderError("");
    try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: cart, otp: otp.trim() }),
      });
      if (res.ok) {
        setOrderSuccess(true);
        clearCart();
        setShowOtpModal(false);
        setOtp("");
      } else {
        const data = await res.json();
        setOtpError(data.message || "Failed to place order.");
      }
    } catch (err) {
      setOtpError("Network error. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-black via-gray-900 to-black py-12 px-4 relative overflow-hidden">
      {/* Minimalist dotted pattern in all corners */}
      {/* Top left */}
      <svg className="absolute top-6 left-6 w-24 h-24 opacity-30 z-0" fill="none" viewBox="0 0 96 96">
        <circle cx="16" cy="16" r="3" fill="#fff" />
        <circle cx="48" cy="32" r="3" fill="#fff" />
        <circle cx="32" cy="64" r="3" fill="#fff" />
        <circle cx="80" cy="48" r="3" fill="#fff" />
      </svg>
      {/* Top right */}
      <svg className="absolute top-6 right-6 w-24 h-24 opacity-30 z-0" fill="none" viewBox="0 0 96 96">
        <circle cx="16" cy="16" r="3" fill="#fff" />
        <circle cx="48" cy="32" r="3" fill="#fff" />
        <circle cx="32" cy="64" r="3" fill="#fff" />
        <circle cx="80" cy="48" r="3" fill="#fff" />
      </svg>
      {/* Bottom left */}
      <svg className="absolute bottom-6 left-6 w-24 h-24 opacity-30 z-0" fill="none" viewBox="0 0 96 96">
        <circle cx="16" cy="16" r="3" fill="#fff" />
        <circle cx="48" cy="32" r="3" fill="#fff" />
        <circle cx="32" cy="64" r="3" fill="#fff" />
        <circle cx="80" cy="48" r="3" fill="#fff" />
      </svg>
      {/* Bottom right */}
      <svg className="absolute bottom-6 right-6 w-24 h-24 opacity-30 z-0" fill="none" viewBox="0 0 96 96">
        <circle cx="16" cy="16" r="3" fill="#fff" />
        <circle cx="48" cy="32" r="3" fill="#fff" />
        <circle cx="32" cy="64" r="3" fill="#fff" />
        <circle cx="80" cy="48" r="3" fill="#fff" />
      </svg>
      {/* Cross (close) button to go back */}
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl z-10 border border-white/20 shadow"
        title="Go Back"
        aria-label="Go Back"
      >
        <HiOutlineX />
      </button>
      <h1 className="text-4xl font-bold text-white mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-white/60 text-xl">Your cart is empty.</div>
      ) : (
        <div className="w-full max-w-3xl bg-white/5 rounded-2xl p-8 shadow-lg border border-white/10">
          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center gap-6 bg-black/30 rounded-xl p-4 border border-white/10">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl border border-white/10"
                />
                <div className="flex-1">
                  <div className="text-lg font-bold text-white">{item.name}</div>
                  <div className="text-white/60 text-sm mb-2">₹{item.price} each</div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60">Qty:</span>
                    <input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.quantity}
                      onChange={e => {
                        const val = Math.max(1, Math.min(Number(e.target.value), item.stock));
                        updateQuantity(item._id, val);
                      }}
                      className="w-16 px-2 py-1 rounded bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xl font-bold text-orange-400">₹{item.price * item.quantity}</div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={clearCart}
              className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white font-semibold"
            >
              Clear Cart
            </button>
            <div className="text-2xl font-bold text-white">Total: <span className="text-orange-400">₹{total}</span></div>
          </div>
          {/* Place Order button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleRequestOtp}
              disabled={sendingOtp || placingOrder}
              className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sendingOtp ? "Sending OTP..." : placingOrder ? "Placing Order..." : userRole === "admin" ? "Place Order (Admin)" : "Place Order"}
            </button>
          </div>
          {/* Error message */}
          {otpError && (
            <div className="mt-4 text-red-400 text-center font-semibold">{otpError}</div>
          )}
        </div>
      )}
      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">📧</div>
              <div className="text-xl font-bold text-gray-900 mb-2">Email Verification Required</div>
              <div className="text-gray-600 text-sm">
                To place an order, you need to verify your email address first. Check your inbox for the verification email.
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendingVerification ? "Sending..." : "Resend Verification Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">📧</div>
              <div className="text-xl font-bold text-gray-900 mb-2">Verify Your Order</div>
              <div className="text-gray-600 text-sm">
                We've sent a 6-digit OTP to your email address. Please enter it below to complete your order.
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg font-mono"
                maxLength={6}
              />
            </div>

            {otpError && (
              <div className="mb-4 text-red-500 text-sm text-center">{otpError}</div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                  setOtpError("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || !otp.trim()}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placingOrder ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={handleRequestOtp}
                disabled={sendingOtp}
                className="text-sm text-orange-600 hover:text-orange-700 underline"
              >
                {sendingOtp ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-md w-full flex flex-col items-center">
            <div className="text-5xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</div>
            <div className="text-gray-700 mb-6 text-center">Thank you for your purchase. Your order has been placed successfully.</div>
            <button
              className="px-6 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold mt-2"
              onClick={() => { setOrderSuccess(false); router.push("/product"); }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
