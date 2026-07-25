import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';
import SEOHead from '../../Component/SEO/SEOHead';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/20 dark:border-white/5 rounded-2xl overflow-hidden bg-white/20 dark:bg-white/5 backdrop-blur-[8px] transition-all duration-300 hover:border-[#7C3AED]/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
      >
        <span className="text-sm md:text-base pr-4">{question}</span>
        <span className={`transform transition-transform duration-300 text-purple-500 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-300 border-t border-purple-500/10 pt-3 leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      </div>
    </div>
  );
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await axiosInstance.get(`${api}/services/${slug}`);
        if (res.data.success) {
          setService(res.data.service);
          setActiveImage(0);
        }
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
      }
      setLoading(false);
    };
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent pt-28 px-4 font-sans">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-72 bg-gray-100 dark:bg-[#18112e] rounded-2xl" />
          <div className="h-8 w-2/3 bg-gray-100 dark:bg-[#18112e] rounded-xl" />
          <div className="h-4 w-full bg-gray-100 dark:bg-[#18112e] rounded-xl" />
          <div className="h-4 w-5/6 bg-gray-100 dark:bg-[#18112e] rounded-xl" />
        </div>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 font-sans dark:bg-[#070312]">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Service not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The service you're looking for doesn't exist or has been removed.</p>
        <Link to="/services" className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white rounded-xl font-bold text-sm">
          Browse All Services
        </Link>
      </div>
    );
  }

  const faqSchema = service.faq?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      }
    }))
  } : null;

  return (
    <>
      <SEOHead
        title={`${service.serviceName} | SocialSwap Services`}
        description={service.description?.substring(0, 150) || `Buy ${service.serviceName} service on SocialSwap.`}
        canonicalUrl={`https://www.socialswap.in/services/${service.slug}`}
        faqSchema={faqSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: service.serviceName },
        ]}
      />
      <div className="min-h-screen bg-transparent pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-8">
          <Link to="/" className="hover:text-purple-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-purple-500 transition-colors">Services</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">{service.serviceName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: Images */}
          <div className="lg:col-span-3">
            {/* Main image */}
            <div className="rounded-card overflow-hidden bg-white/20 dark:bg-black/20 h-64 sm:h-80 lg:h-96 border border-white/40 dark:border-white/10 shadow-card">
              {service.images?.length > 0 ? (
                <img
                  src={service.images[activeImage]}
                  alt={service.serviceName}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                  onClick={() => setIsImageModalOpen(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-purple-200 dark:text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {service.images?.length > 1 && (
              <div className="flex gap-2 mt-3">
                {service.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-12 rounded-image overflow-hidden border-2 transition-all duration-200 ${i === activeImage ? 'border-[#6E4BFF] shadow-md shadow-purple-500/20' : 'border-transparent hover:border-[#8A6CFF]'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Price & Quick Actions (beneath photo) */}
            <div className="mt-6 p-4 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Starting from</span>
                <span className="text-2xl font-extrabold text-[#7C3AED] dark:text-[#A855F7]">
                  ₹{service.price.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-1 sm:flex-initial">
                <Link
                  to="/user/chat"
                  state={{ requestDeal: service }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-btn-gradient text-white font-bold text-sm shadow-purple-glow-soft hover:shadow-purple-glow-hover transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat with Us
                </Link>
                <button
                  onClick={() => {
                    const msg = encodeURIComponent(`Hello, I'm interested in the "${service.serviceName}" service on SocialSwap. Let's discuss details.`);
                    window.open(`https://wa.me/+919423523291?text=${msg}`, '_blank');
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.112-2.905-6.986-1.875-1.875-4.37-2.907-7.011-2.908-5.438 0-9.863 4.421-9.866 9.865-.001 1.77.461 3.5 1.336 5.025l-.972 3.551 3.638-.954zm10.902-5.433c-.299-.149-1.77-.875-2.044-.975-.275-.1-.475-.149-.675.15-.2.299-.774.975-.949 1.174-.175.199-.349.224-.648.075-.3-.15-1.266-.467-2.41-1.485-.89-.793-1.49-1.773-1.665-2.072-.175-.3-.019-.462.13-.611.134-.133.3-.349.449-.523.15-.174.2-.299.3-.499.1-.2.05-.375-.025-.524-.075-.15-.675-1.625-.925-2.224-.244-.589-.493-.51-.675-.519-.174-.009-.374-.01-.574-.01-.2 0-.524.075-.798.374-.275.299-1.048 1.024-1.048 2.5 0 1.475 1.073 2.899 1.223 3.099.15.2 2.11 3.224 5.116 4.519.715.309 1.273.493 1.707.63.718.228 1.37.196 1.885.12.573-.086 1.77-.724 2.02-1.424.25-.699.25-1.299.175-1.424-.075-.125-.275-.199-.574-.349z"/>
                  </svg>
                  WhatsApp Chat
                </button>
              </div>
            </div>

            {/* Description */}
            {service.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About This Service</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            )}

            {/* FAQs */}
            {service.faq && service.faq.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {service.faq.map((item, index) => (
                    <FAQItem key={item._id || index} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Info Card */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-card shadow-card border border-white/40 dark:border-white/10 overflow-hidden">
              {/* Purple gradient header */}
              <div className="bg-gradient-to-br from-[#7B61FF] to-[#B88DFF] px-6 py-5">
                <span className="text-purple-100 text-xs font-bold uppercase tracking-widest">{service.category}</span>
                <h1 className="text-white font-extrabold text-xl leading-tight mt-1">{service.serviceName}</h1>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Starting from</span>
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">
                    ₹{service.price.toLocaleString()}
                  </span>
                </div>

                <hr className="border-gray-100 dark:border-purple-900/20" />

                {/* CTA — links to chat */}
                <Link
                  to="/user/chat"
                  state={{ requestDeal: service }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-button bg-btn-gradient text-white font-bold text-sm shadow-purple-glow-soft hover:shadow-purple-glow-hover hover:translate-y-[-3px] hover:scale-[1.03] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Get Started — Chat with Us
                </Link>

                <Link
                  to="/services"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-button border border-white/40 dark:border-white/10 text-text-secondary font-semibold text-sm hover:bg-white/10 transition"
                >
                  ← Back to All Services
                </Link>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Image Modal */}
    {isImageModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md" onClick={() => setIsImageModalOpen(false)}>
        <button 
          className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 z-[101]"
          onClick={() => setIsImageModalOpen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <img
          src={service.images[activeImage]}
          alt={service.serviceName}
          className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )}
    </>
  );
};

export default ServiceDetail;
