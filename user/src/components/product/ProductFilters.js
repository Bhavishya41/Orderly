import { HiOutlineFilter } from "react-icons/hi";

export default function ProductFilters({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
}) {
  return (
    <section className="px-8 mb-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10"
             style={{ boxShadow: "0 0 30px rgba(255, 255, 255, 0.1)" }}>
          <div className="flex flex-wrap gap-6 items-center justify-center">
            {/* Category Filter */}
            <div className="flex items-center gap-3">
              <HiOutlineFilter className="text-white/60 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg bg-black/50 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                style={{ background: "rgba(0, 0, 0, 0.7)" }}
              >
                <option value="" className="bg-black text-white">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-black text-white">{category}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">Price:</span>
              <input
                type="text"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                className="w-20 px-3 py-2 rounded-lg bg-black/50 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm text-sm"
              />
              <span className="text-white/60">-</span>
              <input
                type="text"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                className="w-20 px-3 py-2 rounded-lg bg-black/50 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm text-sm"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-black/50 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                style={{ background: "rgba(0, 0, 0, 0.7)" }}
              >
                <option value="name" className="bg-black text-white">Name</option>
                <option value="price-low" className="bg-black text-white">Price: Low to High</option>
                <option value="price-high" className="bg-black text-white">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 