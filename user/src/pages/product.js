"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlineSearch, HiOutlineShoppingCart, HiOutlineHeart, HiOutlineFilter } from "react-icons/hi";
import { useRouter } from "next/router";
import useCart from "./../contexts/cartContext";
import Navbar, { NAVBAR_HEIGHT } from "./../components/index/Navbar";
import Footer from "./../components/index/Footer";
import ProductFilters from "./../components/product/ProductFilters";
import ProductGrid from "./../components/product/ProductGrid";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, ""]);
  const [sortBy, setSortBy] = useState("name");
  const [toast, setToast] = useState("");
  // Toast visibility state for animation
  const [showToast, setShowToast] = useState(false);

  const router = useRouter();
  const { addToCart } = useCart();

  // Toast handler
  const handleAddToCart = (product) => {
    addToCart(product);
    setToast("Added to cart!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1200); // Start fade-out before removal
    setTimeout(() => setToast(""), 1500);
  };

  // Fetch products
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
      const data = await res.json();
      console.log("Fetched products:", data); // Debug log
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const urlSearch = router.query.search || "";
      setSearch(urlSearch);
    }
  }, [router.isReady, router.query.search]);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchLower) ||
        product.category?.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.price?.toString().includes(searchLower);
      
      const matchesCategory = !selectedCategory || product.category?.name === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && (priceRange[1] === "" || product.price <= Number(priceRange[1]));
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-black" style={{ paddingTop: NAVBAR_HEIGHT }}>
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          {/* Moving gradient orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '8s', animationDelay: '0s' }} />
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-green-500/30 to-teal-500/30 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '12s', animationDelay: '4s' }} />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'grid-move 20s linear infinite',
            }} />
          </div>
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 relative z-10">
          {/* Hero Section */}
          <section className="text-center py-20 px-4">
            <h1 className="text-5xl font-bold text-white mb-6"
                style={{
                  textShadow: "0 0 30px rgba(255, 107, 53, 0.5)",
                }}>
              Explore Our Products
            </h1>
            <p className="text-white/80 text-xl max-w-2xl mx-auto mb-12">
              Discover amazing products with our powerful search and filter tools
            </p>
          </section>

          {/* Filters Section */}
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Products Grid */}
          <section className="px-8 pb-20">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  <p className="text-white/60 mt-4">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center">
                  <p className="text-white/60 text-xl">No products found.</p>
                </div>
              ) : (
                <ProductGrid products={filteredProducts} addToCart={handleAddToCart} />
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />

        {/* Animation styles */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(90deg); }
            50% { transform: translateY(-40px) rotate(180deg); }
            75% { transform: translateY(-20px) rotate(270deg); }
          }
          
          .animate-float {
            animation: float 10s ease-in-out infinite;
          }
          
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }

          /* Remove number input spinners */
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}</style>
      </div>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed right-0 z-50 px-8 py-4 shadow-lg font-semibold text-base transition-all duration-300 flex items-center gap-2
            bg-[#fdf6ee] border border-orange-200 text-orange-600 drop-shadow-lg
            ${showToast ? 'animate-pop-in-right' : 'animate-fade-in-out'}`}
          style={{ top: NAVBAR_HEIGHT, borderRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, minWidth: '260px', maxWidth: '90vw' }}
        >
          <span className="font-bold mr-2">alert:</span> {toast}
        </div>
      )}
    </>
  );
}