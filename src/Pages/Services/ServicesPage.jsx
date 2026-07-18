import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

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

  const filtered = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ff] via-white to-[#faf8ff] dark:from-[#070312] dark:via-[#110824] dark:to-[#0D071C] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full mb-4">
          What We Offer
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">Services</span>
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base">
          Everything you need to grow, transfer, and protect your social media presence — all in one place.
        </p>
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
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white dark:bg-[#18112e] border border-gray-200 dark:border-purple-900/30 text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-600'
              }`}
            >
              {cat === 'all' ? 'All Services' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#18112e] rounded-2xl h-72 animate-pulse border border-gray-100 dark:border-purple-900/20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No services found in this category.</div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(svc => (
            <Link
              key={svc._id}
              to={`/services/${svc.slug}`}
              className="group bg-white dark:bg-[#18112e] rounded-2xl shadow-sm border border-gray-100 dark:border-purple-900/20 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-purple-50 dark:bg-[#231542]">
                {svc.images?.[0] ? (
                  <img
                    src={svc.images[0]}
                    alt={svc.serviceName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-purple-200 dark:text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Category badge */}
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-white/90 dark:bg-black/60 text-xs font-bold text-purple-700 dark:text-purple-300 rounded-full backdrop-blur-sm">
                  {svc.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="font-bold text-gray-900 dark:text-white text-base mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
                  {svc.serviceName}
                </h2>
                {svc.description && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">
                    {svc.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">
                    ₹{svc.price.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:gap-2 transition-all">
                    View Details
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
