"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HiOutlineSearch,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineDeviceMobile,
  HiOutlineTruck,
  HiOutlineShoppingCart,
  HiOutlineClipboardCheck,
} from "react-icons/hi";
import FeatureCard from "./../components/index/FeatureCard";
import StepCard from "../components/index/StepCard";
import Navbar, { NAVBAR_HEIGHT } from "../components/index/Navbar";
import Hero from "../components/index/Hero";
import Footer from "../components/index/Footer";
import MovingBanner from "../components/index/MovingBanner";

// Remove the shuffleArray function and use a deterministic order
const productImages = [
  "/image.png",
  "/image 2.jpg", 
  "/image3.jpg",
  "/image4.jpg",
  "/image6.jpg",
  "/image7.jpg",
  "/image11.jpg",
  "/image12.jpg",
  "/image13.jpg",
  "/image14.jpg",
  "/image15.jpg",
  "/image16.jpg",
];

function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const features = [
  {
    icon: <HiOutlineSearch className="w-8 h-8" />,
    title: "Smart Search",
    desc: "Find products instantly with our powerful, intuitive search.",
    neonColor: "#00d4ff", // Cyan neon
  },
  {
    icon: <HiOutlineShoppingCart className="w-8 h-8" />,
    title: "Easy Ordering",
    desc: "Add products to your cart and order in just a few clicks.",
    neonColor: "#00ff88", // Green neon
  },
  {
    icon: <HiOutlineTruck className="w-8 h-8" />,
    title: "Fast Delivery",
    desc: "Get your orders delivered quickly and reliably, every time.",
    neonColor: "#ff6b35", // Orange neon
  },
  {
    icon: <HiOutlineClipboardCheck className="w-8 h-8" />,
    title: "Order Tracking",
    desc: "Track your orders in real time from checkout to delivery.",
    neonColor: "#a855f7", // Purple neon
  },
  {
    icon: <HiOutlineShieldCheck className="w-8 h-8" />,
    title: "Secure Checkout",
    desc: "Your data and payments are protected with top-tier security.",
    neonColor: "#3b82f6", // Blue neon
  },
  {
    icon: <HiOutlineDeviceMobile className="w-8 h-8" />,
    title: "Mobile Friendly",
    desc: "Shop from anywhere—Orderly works beautifully on any device.",
    neonColor: "#06b6d4", // Teal neon
  },
];

// Calculate semicircle/fan transform for each card
function getFanCardStyle(i, total, isHovered, neonColor) {
  const radius = 420; // Increased from 320 to 420 for larger spread
  const center = (total - 1) / 2;
  const angle = (i - center) * (Math.PI / (total + 1)); // spread evenly
  const x = Math.sin(angle) * radius;
  const y = -Math.cos(angle) * radius + radius;
  const rotate = (i - center) * 18; // degrees, adjust for more/less rotation

  if (isHovered) {
    // Calculate the direction vector for popping out
    const popDistance = 50; // Increased from 40 to 50
    const popX = Math.sin(angle) * popDistance;
    const popY = -Math.cos(angle) * popDistance;
    
    return {
      transform: `translate(${x + popX}px, ${y + popY}px) rotate(${rotate}deg) scale(1.08)`,
      zIndex: 99,
      boxShadow: `0 0 30px ${neonColor}40, 0 0 60px ${neonColor}20, 0 0 90px ${neonColor}10, 0 8px 32px rgba(0,0,0,0.3)`,
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      cursor: "pointer",
      position: "absolute",
      left: "50%",
      top: "0px",
      width: "320px", // Increased from 260px to 320px
      marginLeft: "-160px", // Adjusted for new width
    };
  }

  return {
    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
    zIndex: 10 + Math.abs(i - center),
    boxShadow: `0 0 10px ${neonColor}20, 0 4px 20px rgba(0,0,0,0.2)`,
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer",
    position: "absolute",
    left: "50%",
    top: "0px",
    width: "320px", // Increased from 260px to 320px
    marginLeft: "-160px", // Adjusted for new width
  };
}

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);
  // Remove the shuffle and use deterministic order
  const marqueeImages = [...productImages, ...productImages, ...productImages];

  // Create deterministic particle positions
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${(i * 7.3) % 100}%`,
      top: `${(i * 11.7) % 100}%`,
      animationDuration: `${10 + (i % 10)}s`,
      animationDelay: `${(i % 5)}s`,
    }));
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-black" style={{ paddingTop: NAVBAR_HEIGHT }}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'grid-move 100s linear infinite',
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Banner */}
      <Hero />

      {/* Moving Banner (Marquee) */}
      <MovingBanner images={marqueeImages} />

      {/* Services/Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-40 relative min-h-[520px]">
        <div className="text-center mb-32">
          <h2 className="text-5xl font-bold text-white mb-6">
            Why Shop with Orderly?
          </h2>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Experience the future of shopping with our cutting-edge features designed for your convenience
          </p>
        </div>

        <div className="relative h-[480px] w-full flex items-center justify-center" style={{ minHeight: 480 }}>
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              desc={f.desc}
              neonColor={f.neonColor}
              style={getFanCardStyle(i, features.length, hovered === i, f.neonColor)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <StepCard
            step="1"
            title="Browse & Search"
            desc="Explore our wide range of products and categories. No login needed."
          />
          <StepCard
            step="2"
            title="Add to Cart"
            desc="Add your favorite products to the cart. Continue shopping or checkout."
          />
          <StepCard
            step="3"
            title="Checkout Securely"
            desc="Sign up or log in only when you're ready to place your order."
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full flex flex-col items-center py-16 ">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
        <Link href="/product">
          <button className="px-8 py-3 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition text-lg shadow">
            Explore Products
          </button>
        </Link>
      </section>

      {/* Footer */}
      <Footer />

      {/* Marquee animation style */}
      <style jsx global>{`
        .marquee-track {
          width: max-content;
          animation: smooth-marquee 20s linear infinite;
          will-change: transform;
        }
        @keyframes smooth-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
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
      `}</style>

      <div className="fixed bottom-0 left-0 w-full -z-10">
        <svg viewBox="0 0 1440 320" className="w-full h-32">
          <path fill="#6366f1" fillOpacity="0.3" d="M0,160L80,170.7C160,181,320,203,480,197.3C640,192,800,160,960,154.7C1120,149,1280,171,1360,181.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}
