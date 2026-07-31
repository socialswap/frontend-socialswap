import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';
import SEOHead from '../../Component/SEO/SEOHead';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`${api}/services`);
        if (res.data.success) {
          setServices(res.data.services);
          setCategories(['all', ...(res.data.categories || [])]);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  // Filter by search query
  const searched = services.filter(svc => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      svc.serviceName?.toLowerCase().includes(query) ||
      svc.category?.toLowerCase().includes(query) ||
      svc.description?.toLowerCase().includes(query)
    );
  });

  // Group searched services by category
  const groupedServices = searched.reduce((acc, svc) => {
    const cat = svc.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {});

  const renderCard = (svc) => (
    <Link
      to={`/services/${svc.slug}`}
      className="relative group flex items-center min-h-[175px] overflow-hidden rounded-[24px] bg-gradient-to-r from-white/60 to-white/30 dark:from-[#1A142E]/70 dark:to-[#0D081F]/70 backdrop-blur-[20px] border border-white/60 dark:border-white/10 hover:border-purple-500/40 dark:hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)] dark:hover:shadow-[0_20px_50px_rgba(124,58,237,0.22)] hover:-translate-y-1.5 p-4 gap-4 sm:gap-6 w-full h-full text-left"
    >
      {/* Layered Colorful Wave Shapes Mockup Style */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 z-10 flex-shrink-0">
        {/* Yellow Wave behind */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-[24px] rotate-[-6deg] opacity-70 group-hover:rotate-[-10deg] group-hover:scale-105 transition-all duration-500" />
        {/* Blue/Cyan Wave middle */}
        <div className="absolute inset-0 bg-gradient-to-bl from-teal-400 to-indigo-500 rounded-[24px] rotate-[5deg] opacity-65 group-hover:rotate-[8deg] group-hover:scale-105 transition-all duration-500" />
        {/* Main front red-purple gradient container with circular image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#EF476F] via-[#EC4899] to-[#7C3AED] rounded-[24px] flex items-center justify-center shadow-lg group-hover:rotate-[-2deg] transition-all duration-500 overflow-hidden">
          {svc.images?.[0] ? (
            <img
              src={svc.images[0]}
              alt={svc.serviceName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white/20 shadow-md group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20 shadow-md">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1 min-w-0 h-full">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#7C3AED] dark:text-[#C6B4FF]">
            {svc.category}
          </span>
          <h2 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg group-hover:text-[#7C3AED] dark:group-hover:text-[#A855F7] transition-colors leading-snug line-clamp-1 mt-1">
            {svc.serviceName}
          </h2>
          {svc.description && (
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mt-2">
              {svc.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Starting from</span>
            <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7] dark:from-[#A855F7] to-[#C6B4FF]">
              ₹{svc.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-[#7C3AED] dark:text-[#C6B4FF] group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300 shadow-purple-glow-soft">
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans relative">
      <SEOHead title="Our Services | SocialSwap" description="Explore the professional services offered by SocialSwap." />
      {/* Scrollbar-hide helper styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full mb-4">
          What We Offer
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">Services</span>
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base">
          Everything you need to grow, transfer, and protect your social media presence — all in one place.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-md mx-auto relative z-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search services (e.g., youtube, design)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#A855F7] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all shadow-card"
          />
        </div>
      </div>

      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="max-w-6xl mx-auto mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-btn-gradient text-white shadow-purple-glow-soft'
                  : 'bg-white/45 dark:bg-[#110C1F]/45 border border-white/40 dark:border-white/10 text-text-secondary hover:border-[#8A6CFF]'
              }`}
            >
              {cat === 'all' ? 'All Services' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid / Rows */}
      {loading ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/30 dark:bg-[#110C1F]/30 rounded-[24px] h-[175px] animate-pulse border border-white/20 dark:border-white/10" />
          ))}
        </div>
      ) : searched.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          No services found matching your search.
        </div>
      ) : activeCategory === 'all' ? (
        <div className="max-w-6xl mx-auto space-y-12">
          {Object.keys(groupedServices).map(catName => (
            <div key={catName} className="relative">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white capitalize flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded bg-gradient-to-b from-[#7C3AED] to-[#A855F7]" />
                  {catName} Services
                </h2>
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                  {groupedServices[catName].length} {groupedServices[catName].length === 1 ? 'service' : 'services'}
                </span>
              </div>

              {/* Horizontal Scroll list */}
              <div className="flex overflow-x-auto gap-6 pb-6 pt-2 px-2 no-scrollbar scroll-smooth snap-x snap-mandatory">
                {groupedServices[catName].map(svc => (
                  <div key={svc._id} className="w-[360px] sm:w-[440px] shrink-0 snap-start">
                    {renderCard(svc)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Category Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white capitalize flex items-center gap-2">
              <span className="w-1.5 h-6 rounded bg-gradient-to-b from-[#7C3AED] to-[#A855F7]" />
              {activeCategory} Services
            </h2>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
              {groupedServices[activeCategory]?.length || 0} {(groupedServices[activeCategory]?.length || 0) === 1 ? 'service' : 'services'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupedServices[activeCategory]?.map(svc => (
              <div key={svc._id}>
                {renderCard(svc)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
