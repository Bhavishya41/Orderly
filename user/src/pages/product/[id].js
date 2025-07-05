import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useCart from "../../contexts/cartContext";
import Navbar, { NAVBAR_HEIGHT } from "../../components/index/Navbar";
import Footer from "../../components/index/Footer";

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/details/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setError("");
      })
      .catch(err => {
        setError(err.message || "Error fetching product");
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-black" style={{ paddingTop: NAVBAR_HEIGHT }}>
      <Navbar />
      <main className="flex-1 relative z-10 px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-4 text-white/70">Loading product...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 text-xl py-20">{error}</div>
        ) : product ? (
          <div className="max-w-6xl mx-auto bg-black/60 rounded-2xl shadow-lg flex flex-col md:flex-row gap-10 p-8 border border-white/10">
            {/* Image Gallery */}
            <div className="flex-1 flex flex-col items-center md:items-start">
              <div className="w-80 h-80 bg-white flex items-center justify-center rounded-xl overflow-hidden border border-white/10">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              {/* Thumbnails (future: for multiple images) */}
            </div>
            {/* Product Info */}
            <div className="flex-1 flex flex-col gap-6">
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-orange-400 font-semibold text-xl">₹{product.price}</span>
                <span className="text-white/60 text-sm bg-orange-900/30 px-2 py-1 rounded">{product.category?.name}</span>
                {/* (Optional) Ratings */}
              </div>
              <div className="text-white/80 mb-2">{product.description}</div>
              <div className="flex items-center gap-4 mb-2">
                <span className={`font-semibold ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                  {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
                </span>
              </div>
              <div className="flex gap-4 mb-4">
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded transition disabled:opacity-50"
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded transition disabled:opacity-50"
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
              </div>
              {/* Offers/Delivery Info (static for now) */}
              <div className="bg-white/10 border border-orange-200/20 rounded-lg p-4 text-white/90 text-sm">
                <div className="mb-2 font-semibold text-orange-400">Offers</div>
                <ul className="list-disc ml-6">
                  <li>Free delivery on orders above ₹499</li>
                  <li>No cost EMI available</li>
                  <li>Bank offers on select cards</li>
                </ul>
                <div className="mt-4 font-semibold text-orange-400">Delivery</div>
                <div>Check delivery options at checkout</div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
} 