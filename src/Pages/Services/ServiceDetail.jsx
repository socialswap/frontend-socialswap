import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance, { api } from '../../API/api';
import SEOHead from '../../Component/SEO/SEOHead';

const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-purple-900/30 rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-[#18112e] hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-800 dark:text-white text-[15px] pr-4">{question}</span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${open ? 'bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rotate-45' : 'bg-gray-100 dark:bg-[#231542]'}`}>
          <svg className={`w-4 h-4 ${open ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '600px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="px-5 py-4 bg-gray-50 dark:bg-[#231542] text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-purple-900/20">
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
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5ff] via-white to-[#faf8ff] dark:from-[#070312] dark:via-[#110824] dark:to-[#0D071C] pt-28 px-4 font-sans">
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
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5ff] via-white to-[#faf8ff] dark:from-[#070312] dark:via-[#110824] dark:to-[#0D071C] pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
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
            <div className="rounded-2xl overflow-hidden bg-purple-50 dark:bg-[#18112e] h-64 sm:h-80 lg:h-96 border border-gray-100 dark:border-purple-900/20 shadow-lg">
              {service.images?.length > 0 ? (
                <img
                  src={service.images[activeImage]}
                  alt={service.serviceName}
                  className="w-full h-full object-cover transition-all duration-300"
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
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${i === activeImage ? 'border-purple-500 shadow-md shadow-purple-500/20' : 'border-transparent hover:border-purple-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            {service.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About This Service</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>
            )}

            {/* FAQ */}
            {service.faq?.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {service.faq.map((item, i) => (
                    <FaqItem key={i} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Info Card */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 bg-white dark:bg-[#18112e] rounded-2xl shadow-xl border border-gray-100 dark:border-purple-900/20 overflow-hidden">
              {/* Purple gradient header */}
              <div className="bg-gradient-to-br from-[#7C3AED] to-[#A855F7] px-6 py-5">
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
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-sm shadow-lg shadow-purple-500/20 hover:opacity-90 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Get Started — Chat with Us
                </Link>

                <Link
                  to="/services"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-purple-900/30 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-purple-900/20 transition"
                >
                  ← Back to All Services
                </Link>

                {/* FAQ count */}
                {service.faq?.length > 0 && (
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                    {service.faq.length} FAQ{service.faq.length !== 1 ? 's' : ''} answered below ↓
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ServiceDetail;
