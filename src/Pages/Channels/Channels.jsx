import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ChannelCard from "../../Component/ChannelCard.jsx";
import { useLocation } from "react-router-dom";
import SEOHead from "../../Component/SEO/SEOHead";
import { SearchOutlined, CloseOutlined, SlidersOutlined, CheckOutlined } from "@ant-design/icons";

const CATEGORY_OPTIONS = [
  { label: "🎮 Gaming", value: "Gaming" },
  { label: "💻 Tech", value: "Tech" },
  { label: "💰 Finance", value: "Finance" },
  { label: "🤖 AI", value: "Artificial intelligence" },
  { label: "💼 Business", value: "Business & Entrepreneurship" },
  { label: "📚 Education", value: "Education" },
  { label: "💪 Health", value: "Health & Fitness" },
  { label: "🍔 Food", value: "Food" },
  { label: "📺 Infotainment", value: "Infotainment" },
  { label: "🎥 Vlogging", value: "Vlogging" },
  { label: "⚽ Sports", value: "Sports" },
  { label: "🎙️ Commentary", value: "Commentary" },
  { label: "🎬 Entertainment", value: "Entertainment" },
  { label: "🎵 Music", value: "Music" },
  { label: "🚀 Motivation", value: "Motivation & Self-Improvement" },
];

const SUBSCRIBER_OPTIONS = [
  { label: "0 – 10K", value: [0, 10000] },
  { label: "10K – 50K", value: [10000, 50000] },
  { label: "50K – 100K", value: [50000, 100000] },
  { label: "100K – 500K", value: [100000, 500000] },
  { label: "500K – 1M", value: [500000, 1000000] },
  { label: "1M+", value: [1000000, 99999999] },
];

const PRICE_OPTIONS = [
  { label: "Under ₹10K", value: [0, 10000] },
  { label: "₹10K – ₹1L", value: [10000, 100000] },
  { label: "Above ₹1L", value: [100000, 99999999] },
];

const SORT_OPTIONS = [
  { label: "🔥 Popular", value: "popularity" },
  { label: "💸 Price ↑", value: "price-low" },
  { label: "💸 Price ↓", value: "price-high" },
  { label: "👥 Subscribers", value: "subscribers" },
  { label: "👁️ Most Views", value: "views" },
  { label: "🆕 Newest", value: "recent" },
];

// Reusable Pill Toggle component
const Pill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
      border transition-all duration-200 whitespace-nowrap select-none
      ${active
        ? "bg-[#6E4BFF] border-[#6E4BFF] text-white shadow-purple-glow-soft"
        : "bg-white/45 dark:bg-[#110C1F]/45 border-white/40 dark:border-white/10 text-text-secondary hover:border-[#8A6CFF] hover:text-text-primary"
      }
    `}
  >
    {active && <CheckOutlined className="text-xs" />}
    {label}
  </button>
);

const FilterSection = ({ title, icon, children }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5 flex items-center gap-1.5">
      <span>{icon}</span> {title}
    </p>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const Channels = () => {
  const location = useLocation();
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    subscribersRange: [],
    priceRange: [],
    monetization: [],
    channelType: [],
    viewsRange: [],
    estimatedEarnings: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = React.useRef(null);

  // Read from URL on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get("category");
    const monetizationFromUrl = searchParams.get("monetization");
    const maxPriceFromUrl = searchParams.get("maxPrice");

    setFilters(prev => {
      const newFilters = { ...prev };
      let updated = false;
      if (categoryFromUrl) { newFilters.category = [categoryFromUrl]; updated = true; }
      if (monetizationFromUrl) { newFilters.monetization = [monetizationFromUrl]; updated = true; }
      if (maxPriceFromUrl) { newFilters.priceRange = [[0, parseInt(maxPriceFromUrl)]]; updated = true; }
      if (updated) setShowFilters(true);
      if (location.search) window.history.replaceState({}, document.title, location.pathname);
      return newFilters;
    });
  }, [location.search]);

  useEffect(() => {
    const fetchAllChannels = async () => {
      try {
        const firstPage = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/channels/filter?limit=100&page=1`, {}
        );
        const data = firstPage.data;
        let allChannels = [...(data.channels || [])];
        const totalPages = data.totalPages || 1;
        if (totalPages > 1) {
          const promises = [];
          for (let i = 2; i <= totalPages; i++) {
            promises.push(axios.post(`${process.env.REACT_APP_API_BASE_URL}/channels/filter?limit=100&page=${i}`, {}));
          }
          const results = await Promise.all(promises);
          results.forEach(res => { allChannels = [...allChannels, ...(res.data.channels || [])]; });
        }
        setChannels(allChannels);
        setFilteredChannels(allChannels);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching channels:", error);
        setLoading(false);
      }
    };
    fetchAllChannels();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...channels];

    if (filters.category.length > 0) {
      filtered = filtered.filter(ch => filters.category.includes(ch.category));
    }
    if (filters.subscribersRange.length > 0) {
      filtered = filtered.filter(ch =>
        filters.subscribersRange.some(range =>
          (ch.subscriberCount || 0) >= range[0] && (ch.subscriberCount || 0) <= range[1]
        )
      );
    }
    if (filters.viewsRange.length > 0) {
      filtered = filtered.filter(ch =>
        filters.viewsRange.some(range =>
          (ch.viewCount || 0) >= range[0] && (ch.viewCount || 0) <= range[1]
        )
      );
    }
    if (filters.estimatedEarnings.length > 0) {
      filtered = filtered.filter(ch =>
        filters.estimatedEarnings.some(range =>
          (ch.estimatedEarnings || 0) >= range[0] && (ch.estimatedEarnings || 0) <= range[1]
        )
      );
    }
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(ch => {
        const price = parseFloat(ch.price) || 0;
        return filters.priceRange.some(range => price >= range[0] && price <= range[1]);
      });
    }
    if (filters.monetization.length > 0) {
      filtered = filtered.filter(ch => {
        if (filters.monetization.includes("monetized") && ch.monetized === true) return true;
        if (filters.monetization.includes("non-monetized") && ch.monetized === false) return true;
        return false;
      });
    }
    if (filters.channelType.length > 0) {
      filtered = filtered.filter(ch => {
        if (filters.channelType.includes("shorts") && (ch.channelType === "Short Videos" || ch.channelType === "Both Long & Short Videos")) return true;
        if (filters.channelType.includes("long-form") && (ch.channelType === "Long Videos" || ch.channelType === "Both Long & Short Videos")) return true;
        return false;
      });
    }
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(ch => ch.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    switch (sortBy) {
      case "price-low": filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0)); break;
      case "price-high": filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0)); break;
      case "subscribers": filtered.sort((a, b) => (b.subscriberCount || 0) - (a.subscriberCount || 0)); break;
      case "views": filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)); break;
      case "recent": filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      default: filtered.sort((a, b) => (b.subscriberCount || 0) - (a.subscriberCount || 0));
    }

    setFilteredChannels(filtered);
    setVisibleCount(12);
  }, [channels, filters, searchTerm, sortBy]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisibleCount(prev => Math.min(prev + 12, filteredChannels.length)); },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredChannels.length]);

  const toggleRangeFilter = (filterName, rangeValue) => {
    setFilters(prev => {
      const current = prev[filterName] || [];
      const key = JSON.stringify(rangeValue);
      const exists = current.some(r => JSON.stringify(r) === key);
      return { ...prev, [filterName]: exists ? current.filter(r => JSON.stringify(r) !== key) : [...current, rangeValue] };
    });
  };

  const toggleFilter = (filterName, value) => {
    setFilters(prev => {
      const current = prev[filterName] || [];
      return { ...prev, [filterName]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] };
    });
  };

  const resetFilters = () => {
    setFilters({ category: [], subscribersRange: [], viewsRange: [], estimatedEarnings: [], priceRange: [], monetization: [], channelType: [] });
    setSearchTerm("");
    setSortBy("popularity");
  };

  const isRangeActive = (filterName, rangeValue) => {
    const key = JSON.stringify(rangeValue);
    return (filters[filterName] || []).some(r => JSON.stringify(r) === key);
  };

  const totalActive = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen bg-transparent mt-[5rem] transition-colors duration-200">
      <SEOHead
        title="Browse YouTube Channels for Sale in India"
        description="Explore verified YouTube channels for sale. Filter by category, subscribers, earnings. Buy monetized channels in Gaming, Tech, Finance, Education & more."
        keywords="youtube channels for sale, buy youtube channel india, monetized channel for sale, gaming channel for sale, tech channel for sale"
        canonicalUrl="https://www.socialswap.in/channels"
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Browse Channels" }]}
      />

      {/* ── Sticky Top Bar ── */}
      <div className="sticky top-20 z-40 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] border-b border-white/40 dark:border-white/10 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 flex-wrap">

            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base z-10" />
              <input
                type="text"
                placeholder="Search channels by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-input border border-white/40 dark:border-white/10 bg-white/55 dark:bg-[#2A2045]/55 text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-[#8A6CFF] transition"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <CloseOutlined className="text-xs" />
                </button>
              )}
            </div>

            {/* Sort Chips (scrollable row) */}
            <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`whitespace-nowrap px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                    ${sortBy === opt.value
                      ? "bg-[#6E4BFF] border-[#6E4BFF] text-white shadow-purple-glow-soft"
                      : "bg-white/45 dark:bg-[#110C1F]/45 border-white/40 dark:border-white/10 text-text-secondary hover:border-[#8A6CFF] hover:text-text-primary"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200
                ${showFilters
                  ? "bg-[#6E4BFF] border-[#6E4BFF] text-white shadow-purple-glow-soft"
                  : "bg-white/45 dark:bg-[#110C1F]/45 border-white/40 dark:border-white/10 text-text-primary hover:border-[#8A6CFF]"
                }`}
            >
              <SlidersOutlined />
              Filters
              {totalActive > 0 && (
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                  ${showFilters ? "bg-white text-[#6E4BFF]" : "bg-[#6E4BFF] text-white"}`}>
                  {totalActive}
                </span>
              )}
            </button>

            {totalActive > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <CloseOutlined className="text-xs" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            key="filter-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] border-b border-white/40 dark:border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">

              {/* Category */}
              <FilterSection title="Category" icon="🎬">
                {CATEGORY_OPTIONS.map(opt => (
                  <Pill
                    key={opt.value}
                    label={opt.label}
                    active={filters.category.includes(opt.value)}
                    onClick={() => toggleFilter("category", opt.value)}
                  />
                ))}
              </FilterSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">

                {/* Subscribers */}
                <FilterSection title="Subscribers" icon="👥">
                  {SUBSCRIBER_OPTIONS.map(opt => (
                    <Pill
                      key={opt.label}
                      label={opt.label}
                      active={isRangeActive("subscribersRange", opt.value)}
                      onClick={() => toggleRangeFilter("subscribersRange", opt.value)}
                    />
                  ))}
                </FilterSection>

                {/* Price */}
                <FilterSection title="Price" icon="💸">
                  {PRICE_OPTIONS.map(opt => (
                    <Pill
                      key={opt.label}
                      label={opt.label}
                      active={isRangeActive("priceRange", opt.value)}
                      onClick={() => toggleRangeFilter("priceRange", opt.value)}
                    />
                  ))}
                </FilterSection>

                {/* Monetization */}
                <FilterSection title="Monetization" icon="💰">
                  <Pill label="✅ Monetized" active={filters.monetization.includes("monetized")} onClick={() => toggleFilter("monetization", "monetized")} />
                  <Pill label="❌ Non-Monetized" active={filters.monetization.includes("non-monetized")} onClick={() => toggleFilter("monetization", "non-monetized")} />
                </FilterSection>

                {/* Channel Type */}
                <FilterSection title="Channel Type" icon="📹">
                  <Pill label="⚡ Shorts" active={filters.channelType.includes("shorts")} onClick={() => toggleFilter("channelType", "shorts")} />
                  <Pill label="🎞️ Long Form" active={filters.channelType.includes("long-form")} onClick={() => toggleFilter("channelType", "long-form")} />
                </FilterSection>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Showing <span className="font-bold text-gray-900 dark:text-gray-100">{filteredChannels.length}</span> channels
          {totalActive > 0 && <span className="ml-1 text-purple-500">• {totalActive} filter{totalActive > 1 ? "s" : ""} active</span>}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-white/30 dark:bg-[#110C1F]/30 rounded-card h-96 shadow-sm border border-white/20 dark:border-white/10" />
            ))}
          </div>
        ) : filteredChannels.length > 0 ? (
          <div className="space-y-8">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <AnimatePresence>
                {filteredChannels.slice(0, visibleCount).map(channel => (
                  <motion.div
                    key={channel._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChannelCard channel={channel} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {visibleCount < filteredChannels.length && (
              <div ref={loadMoreRef} className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500" />
              </div>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No channels found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search term</p>
            <button onClick={resetFilters} className="px-6 py-3 bg-btn-gradient hover:shadow-purple-glow-soft hover:translate-y-[-3px] hover:scale-[1.03] transition-all text-white rounded-button font-semibold shadow-md">
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Channels;
