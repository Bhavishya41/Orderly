import { createContext, useContext, useState, useEffect } from "react";

// Helper to get cart from localStorage
function getInitialCart() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  }
  return [];
}

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(getInitialCart);
  const [cartCount, setCartCount] = useState(() => {
    const initial = getInitialCart();
    return initial.reduce((sum, item) => sum + item.quantity, 0);
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setCartCount((prevCount) => prevCount + quantity);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export default function useCart() {
  return useContext(CartContext);
}
