import { useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import useCart from "../../contexts/cartContext";
import { useRouter } from "next/router";

export default function ProductCard({ product, addToCart }) {
  const [isHovered, setIsHovered] = useState(false);
  const outOfStock = !product.stock || product.stock <= 0;
  const { cart } = useCart();
  const cartItem = cart.find(item => item._id === product._id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const canAdd = !outOfStock && inCartQty < product.stock;
  const router = useRouter();

  // Only navigate on card click, not on cart button click
  const handleCardClick = (e) => {
    // Prevent navigation if the cart button is clicked
    if (
      e.target.closest("button")
    ) return;
    router.push(`/product/${product._id}`);
  };

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div 
        className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 transition-all duration-300 h-full"
        style={{
          boxShadow: isHovered 
            ? "0 0 30px rgba(255, 107, 53, 0.3), 0 8px 32px rgba(0,0,0,0.3)" 
            : "0 4px 20px rgba(0,0,0,0.2)",
          transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        }}
      >
        {/* Product Image */}
        <div className="w-full h-64 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-white/40">No Image</span>
          )}
          {outOfStock && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Out of Stock</span>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
            {product.name}
          </h3>
          
          <div className="text-white/60 text-sm">
            <p>Category: <span className="text-white">{product.category?.name || "—"}</span></p>
            <p>Stock: <span className="text-white">{outOfStock ? "Out of Stock" : product.stock - inCartQty}</span></p>
            {inCartQty > 0 && !outOfStock && (
              <p>In Cart: <span className="text-orange-400 font-bold">{inCartQty}</span></p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-orange-400">₹{product.price}</span>
            
            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: "0 0 15px rgba(255, 107, 53, 0.3)",
              }}
              onClick={e => { e.stopPropagation(); canAdd && addToCart(product); }}
              disabled={!canAdd}
            >
              <HiOutlineShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hover glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "linear-gradient(45deg, transparent, rgba(255, 107, 53, 0.1), transparent)",
            boxShadow: "inset 0 0 20px rgba(255, 107, 53, 0.2)",
          }}
        />
      </div>
    </div>
  );
} 