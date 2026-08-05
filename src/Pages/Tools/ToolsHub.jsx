import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CalculatorOutlined, 
  SearchOutlined, 
  DollarOutlined, 
  ToolOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import Header from '../../Component/Header/Header';
import Footer from '../../Component/Footer/Footer';
import SEOHead from '../../Component/SEO/SEOHead';

const ToolsHub = () => {
  const tools = [
    {
      id: 'revenue-calculator',
      title: 'Revenue Calculator',
      slug: 'Revenue-Calculator',
      description: 'Estimate potential revenue for YouTube channels based on daily views and RPM.',
      icon: <CalculatorOutlined className="text-white text-xl" />,
      color: 'bg-gradient-to-tr from-[#7C3AED] to-[#A855F7]',
      active: true
    },
    {
      id: 'fair-price-analyser',
      title: 'Fair Price Analyser',
      slug: 'Fair-Price-Analyser',
      description: 'See how your channel price compares to 1,000+ real marketplace transactions.',
      icon: <SearchOutlined className="text-white text-xl" />,
      color: 'bg-gradient-to-tr from-[#7C3AED] to-[#A855F7]',
      active: true
    },
    {
      id: 'channel-price-calculator',
      title: 'Channel Price Calculator',
      slug: 'Channel-Price-Calculator',
      description: 'Estimate the fair sale price of your YouTube channel instantly using revenue multiples.',
      icon: <DollarOutlined className="text-white text-xl" />,
      color: 'bg-gradient-to-tr from-[#7C3AED] to-[#A855F7]',
      active: true
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-text-primary flex flex-col transition-colors duration-300">
      <SEOHead title="Creator Tools | SocialSwap" description="Free YouTube tools for creators to grow their channels." />
      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-purple-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-text-primary font-semibold">Tools</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-lg shadow-purple-500/20 text-white">
              <ToolOutlined className="text-2xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7] dark:from-[#A855F7] to-[#C6B4FF] tracking-tight">
              Free YouTube Creator Tools
            </h1>
          </div>

          <p className="text-base sm:text-lg text-text-secondary max-w-3xl leading-relaxed">
            Free tools for YouTube channel sellers, buyers, and creators — channel valuation, RPM calculator, faceless niche explorer, AI content planner, and more. No signup required.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const cardContent = (
              <div
                className={`h-full bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-3xl p-6 sm:p-7 border border-white/40 dark:border-white/10 shadow-card hover:shadow-xl hover:border-purple-primary/50 dark:hover:border-purple-primary/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                  !tool.active ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tool.color} shadow-md`}>
                      {tool.icon}
                    </div>

                    {tool.badge && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold rounded-full text-[11px] border border-purple-300/40">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-purple-primary dark:group-hover:text-purple-hover transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {tool.active && (
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-1.5 text-xs font-bold text-purple-primary dark:text-purple-secondary group-hover:translate-x-1 transition-transform">
                    <span>Use tool</span>
                    <ArrowRightOutlined />
                  </div>
                )}
              </div>
            );

            return tool.active && tool.slug ? (
              <Link key={tool.id} to={`/tools/${tool.slug}`}>
                {cardContent}
              </Link>
            ) : (
              <div key={tool.id}>{cardContent}</div>
            );
          })}
        </div>

        {/* Informative Section: What are SocialSwap's free YouTube tools? */}
        <div className="pt-10 border-t border-gray-200 dark:border-white/10 space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
            What are SocialSwap's free YouTube tools?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/30 dark:bg-[#110C1F]/30 backdrop-blur-[12px] rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-card space-y-3">
              <h3 className="text-base font-bold text-text-primary">
                💰 Channel Valuation & Fair Price
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Accurately estimate what your YouTube channel is worth on the open marketplace based on real sales data across 50+ niches.
              </p>
            </div>

            <div className="bg-white/30 dark:bg-[#110C1F]/30 backdrop-blur-[12px] rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-card space-y-3">
              <h3 className="text-base font-bold text-text-primary">
                📊 Revenue & RPM Calculators
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Calculate daily, monthly, and annual AdSense earnings for both long-form videos and YouTube Shorts instantly.
              </p>
            </div>

            <div className="bg-white/30 dark:bg-[#110C1F]/30 backdrop-blur-[12px] rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-card space-y-3">
              <h3 className="text-base font-bold text-text-primary">
                🚀 Creator Growth & Escrow
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Analyze niche profitability, plan AI video content, and transfer verified YouTube channels safely with SocialSwap's escrow guarantee.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ToolsHub;
