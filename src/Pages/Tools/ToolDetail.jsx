import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalculatorOutlined, SearchOutlined, DollarOutlined, ToolOutlined } from '@ant-design/icons';
import Header from '../../Component/Header/Header';
import Footer from '../../Component/Footer/Footer';
import NotFoundPage from '../../Component/PageNotFound/PageNotFound';

// Tool Components
import RevenueCalculator from './Components/RevenueCalculator';
import FairPriceAnalyser from './Components/FairPriceAnalyser';
import ChannelPriceCalculator from './Components/ChannelPriceCalculator';
import SEOHead from '../../Component/SEO/SEOHead';

const ToolDetail = () => {
  const { toolSlug } = useParams();

  // Normalize slug for robust URL matching
  const normalizedSlug = (toolSlug || '').toLowerCase().replace(/[^a-z0-0]/g, '');

  // Tool Definitions Map
  const toolRegistry = {
    // 1. Revenue Calculator Slugs
    'revenuecalculator': {
      id: 'revenue-calculator',
      title: 'YouTube Money Calculator — Estimate Your Earnings',
      slug: 'Revenue-Calculator',
      subtitle: 'Estimate how much any YouTube channel earns per day, month, and year. Free YouTube earnings estimator — instant results, no signup required.',
      icon: <CalculatorOutlined className="text-white text-2xl" />,
      component: <RevenueCalculator />
    },
    'youtubemoneycalculator': {
      id: 'revenue-calculator',
      title: 'YouTube Money Calculator — Estimate Your Earnings',
      slug: 'Revenue-Calculator',
      subtitle: 'Estimate how much any YouTube channel earns per day, month, and year. Free YouTube earnings estimator — instant results, no signup required.',
      icon: <CalculatorOutlined className="text-white text-2xl" />,
      component: <RevenueCalculator />
    },
    'youtuberevenuecalculator': {
      id: 'revenue-calculator',
      title: 'YouTube Money Calculator — Estimate Your Earnings',
      slug: 'Revenue-Calculator',
      subtitle: 'Estimate how much any YouTube channel earns per day, month, and year. Free YouTube earnings estimator — instant results, no signup required.',
      icon: <CalculatorOutlined className="text-white text-2xl" />,
      component: <RevenueCalculator />
    },

    // 2. Fair Price Analyser Slugs
    'fairpriceanalyser': {
      id: 'fair-price-analyser',
      title: 'Fair Price Analyser — Compare Marketplace Transactions',
      slug: 'Fair-Price-Analyser',
      subtitle: 'See how your channel price compares to 1,000+ real marketplace transactions. Get instant fair market valuation reports.',
      icon: <SearchOutlined className="text-white text-2xl" />,
      component: <FairPriceAnalyser />
    },
    'fairpriceanalyzer': {
      id: 'fair-price-analyser',
      title: 'Fair Price Analyser — Compare Marketplace Transactions',
      slug: 'Fair-Price-Analyser',
      subtitle: 'See how your channel price compares to 1,000+ real marketplace transactions. Get instant fair market valuation reports.',
      icon: <SearchOutlined className="text-white text-2xl" />,
      component: <FairPriceAnalyser />
    },
    'youtubechannelfairprice': {
      id: 'fair-price-analyser',
      title: 'Fair Price Analyser — Compare Marketplace Transactions',
      slug: 'Fair-Price-Analyser',
      subtitle: 'See how your channel price compares to 1,000+ real marketplace transactions. Get instant fair market valuation reports.',
      icon: <SearchOutlined className="text-white text-2xl" />,
      component: <FairPriceAnalyser />
    },

    // 3. Channel Price Calculator Slugs
    'channelpricecalculator': {
      id: 'channel-price-calculator',
      title: 'Channel Price Calculator — Estimate Sale Price',
      slug: 'Channel-Price-Calculator',
      subtitle: 'Estimate the fair sale price of your YouTube channel instantly using revenue multiples, subscriber base, and niche benchmarks.',
      icon: <DollarOutlined className="text-white text-2xl" />,
      component: <ChannelPriceCalculator />
    },
    'youtubechannelpricecalculator': {
      id: 'channel-price-calculator',
      title: 'Channel Price Calculator — Estimate Sale Price',
      slug: 'Channel-Price-Calculator',
      subtitle: 'Estimate the fair sale price of your YouTube channel instantly using revenue multiples, subscriber base, and niche benchmarks.',
      icon: <DollarOutlined className="text-white text-2xl" />,
      component: <ChannelPriceCalculator />
    }
  };

  const currentTool = toolRegistry[normalizedSlug];

  // If slug doesn't match any valid tool, render 404 page as requested
  if (!currentTool) {
    return <NotFoundPage />;
  }

  // Tool Navigation Pills
  const navPills = [
    { label: 'Free Tools', path: '/tools', icon: <ToolOutlined /> },
    { label: 'Youtube money calculator', path: '/tools/Revenue-Calculator', id: 'revenue-calculator' },
    { label: 'Youtube channel fair price', path: '/tools/Fair-Price-Analyser', id: 'fair-price-analyser' },
    { label: 'Youtube channel price calculator', path: '/tools/Channel-Price-Calculator', id: 'channel-price-calculator' }
  ];

  return (
    <div className="min-h-screen bg-transparent text-text-primary flex flex-col transition-colors duration-300">
      <SEOHead title="Creator Tool | SocialSwap" description="Use our free YouTube creator tools to analyze and optimize your channel." />
      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-purple-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/tools" className="hover:text-purple-primary transition-colors">
            Tools
          </Link>
          <span>/</span>
          <span className="text-text-primary font-semibold truncate max-w-xs">
            {currentTool.slug.replace(/-/g, ' ')}
          </span>
        </nav>

        {/* Hero Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-lg shadow-purple-500/20 text-white shrink-0">
              {currentTool.icon}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
              {currentTool.title}
            </h1>
          </div>

          <p className="text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            {currentTool.subtitle}
          </p>
        </div>

        {/* Tool Component Render */}
        <div className="bg-transparent">
          {currentTool.component}
        </div>

        {/* Bottom Tool Pill Switcher (matching screenshot 3) */}
        <div className="pt-8 border-t border-gray-200 dark:border-white/10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {navPills.map((pill, idx) => {
              const isActive = currentTool.id && pill.id === currentTool.id;
              return (
                <Link
                  key={idx}
                  to={pill.path}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-primary dark:text-purple-300 border-purple-300 dark:border-purple-700 shadow-sm font-bold'
                      : 'bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[12px] text-text-secondary border-white/40 dark:border-white/10 hover:border-purple-primary/50 hover:text-purple-primary'
                  }`}
                >
                  {pill.icon && <span>{pill.icon}</span>}
                  <span>{pill.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ToolDetail;
