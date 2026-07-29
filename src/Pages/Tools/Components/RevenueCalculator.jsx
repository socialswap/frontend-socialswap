import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Slider, Tooltip } from 'antd';
import { 
  DollarOutlined, 
  EyeOutlined, 
  ArrowRightOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const RevenueCalculator = () => {
  const [contentType, setContentType] = useState('long'); // 'long' | 'shorts'
  const [dailyViews, setDailyViews] = useState(500000);
  const [rpm, setRpm] = useState(5.0);
  const [selectedTab, setSelectedTab] = useState('month'); // 'day' | 'week' | 'month' | 'year'

  // Presets by Niche
  const nichePresets = [
    { name: 'Finance & Investing', rpm: 12.0, icon: '📈' },
    { name: 'Tech & Software', rpm: 8.5, icon: '💻' },
    { name: 'Vlogs & Lifestyle', rpm: 4.0, icon: '🎥' },
    { name: 'Entertainment', rpm: 3.2, icon: '🎬' },
    { name: 'Gaming', rpm: 2.2, icon: '🎮' }
  ];

  // Adjust RPM when switching content type
  const handleContentTypeChange = (type) => {
    setContentType(type);
    if (type === 'shorts') {
      setRpm(0.08);
    } else {
      setRpm(5.0);
    }
  };

  // Calculations
  const dailyEarnings = (dailyViews / 1000) * rpm;
  const weeklyEarnings = dailyEarnings * 7;
  const monthlyEarnings = dailyEarnings * 30.416; // avg days in month
  const yearlyEarnings = dailyEarnings * 365;

  const formatCurrency = (val) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(1)}K`;
    }
    return `$${val.toFixed(0)}`;
  };

  const formatViews = (val) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}K`;
    }
    return val;
  };

  const getDisplayedRevenue = () => {
    switch (selectedTab) {
      case 'day': return { amount: formatCurrency(dailyEarnings), label: '/ day' };
      case 'week': return { amount: formatCurrency(weeklyEarnings), label: '/ week' };
      case 'year': return { amount: formatCurrency(yearlyEarnings), label: '/ year' };
      case 'month':
      default: return { amount: formatCurrency(monthlyEarnings), label: '/ month' };
    }
  };

  return (
    <div className="space-y-12">
      {/* Top Main Interactive Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Blue Main Banner & Sliders */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Blue Banner Display */}
          <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2 text-purple-200 text-sm font-medium mb-3">
              <ThunderboltOutlined className="text-amber-300" />
              <span>Estimated Revenue</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="text-4xl md:text-6xl font-extrabold tracking-tight">
                {getDisplayedRevenue().amount}
              </span>
              <span className="text-xl md:text-2xl text-purple-200 font-medium">
                {getDisplayedRevenue().label}
              </span>
            </div>

            <p className="text-purple-100/80 text-sm mb-6">
              {formatViews(dailyViews)} views/day × ${rpm.toFixed(contentType === 'shorts' ? 2 : 1)} RPM
            </p>

            {/* Timeframe Tabs */}
            <div className="grid grid-cols-4 gap-2 bg-purple-900/40 p-1.5 rounded-2xl border border-purple-400/20 backdrop-blur-md">
              {[
                { key: 'day', label: 'Day', val: formatCurrency(dailyEarnings) },
                { key: 'week', label: 'Week', val: formatCurrency(weeklyEarnings) },
                { key: 'month', label: 'Month', val: formatCurrency(monthlyEarnings) },
                { key: 'year', label: 'Year', val: formatCurrency(yearlyEarnings) }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`flex flex-col items-center py-2.5 px-2 rounded-xl transition-all text-xs md:text-sm font-medium ${
                    selectedTab === tab.key
                      ? 'bg-white text-purple-900 shadow-md font-bold'
                      : 'text-purple-100 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[11px] opacity-80">{tab.label}</span>
                  <span className="font-bold">{tab.val}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Controls Box */}
          <div className="bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-3xl p-6 md:p-8 border border-white/40 dark:border-white/10 shadow-card space-y-8">
            
            {/* Slider 1: Views Per Day */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <EyeOutlined className="text-purple-primary" />
                  <span>Views per day</span>
                </label>
                <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-primary dark:text-purple-300 font-bold rounded-lg text-sm border border-purple-200 dark:border-purple-800">
                  {formatViews(dailyViews)} views
                </span>
              </div>
              <Slider
                min={1000}
                max={5000000}
                step={1000}
                value={dailyViews}
                onChange={setDailyViews}
                tooltip={{ formatter: (val) => `${formatViews(val)} views` }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1K</span>
                <span>500K</span>
                <span>1M</span>
                <span>5M</span>
              </div>
            </div>

            {/* Slider 2: RPM (Revenue per 1000 views) */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <DollarOutlined className="text-emerald-500" />
                  <span>RPM (Revenue per 1000 views)</span>
                  <Tooltip title="RPM represents net revenue earned per 1,000 views after YouTube's 45% revenue cut.">
                    <InfoCircleOutlined className="text-gray-400 cursor-pointer" />
                  </Tooltip>
                </label>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg text-sm border border-emerald-200 dark:border-emerald-800">
                  ${rpm.toFixed(contentType === 'shorts' ? 2 : 1)} RPM
                </span>
              </div>
              <Slider
                min={contentType === 'shorts' ? 0.01 : 0.1}
                max={contentType === 'shorts' ? 0.5 : 15.0}
                step={contentType === 'shorts' ? 0.01 : 0.1}
                value={rpm}
                onChange={setRpm}
                tooltip={{ formatter: (val) => `$${val.toFixed(2)} RPM` }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>${contentType === 'shorts' ? '0.01' : '0.1'}</span>
                <span>${contentType === 'shorts' ? '0.25' : '7.5'}</span>
                <span>${contentType === 'shorts' ? '0.50' : '15.0'} max</span>
              </div>
            </div>

            {/* Niche RPM Quick Pickers */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Popular Niche Benchmarks (Long-form)
              </p>
              <div className="flex flex-wrap gap-2">
                {nichePresets.map((niche) => (
                  <button
                    key={niche.name}
                    onClick={() => {
                      setContentType('long');
                      setRpm(niche.rpm);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                      rpm === niche.rpm && contentType === 'long'
                        ? 'bg-purple-primary text-white border-purple-primary shadow-sm'
                        : 'bg-white/30 dark:bg-white/5 text-text-secondary border-white/20 dark:border-white/10 hover:border-purple-primary/45'
                    }`}
                  >
                    <span>{niche.icon}</span>
                    <span>{niche.name}</span>
                    <span className="font-semibold opacity-75">(${niche.rpm})</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right 1 Column: Content Type & Marketplace CTA */}
        <div className="space-y-6">
          
          {/* Content Type Selector */}
          <div className="bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-card space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Content Type
            </h3>

            <div className="grid grid-cols-2 gap-2 p-1 bg-white/30 dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/10">
              <button
                onClick={() => handleContentTypeChange('long')}
                className={`py-3 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                  contentType === 'long'
                    ? 'bg-purple-primary text-white shadow-md font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Long-form
              </button>
              <button
                onClick={() => handleContentTypeChange('shorts')}
                className={`py-3 px-4 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                  contentType === 'shorts'
                    ? 'bg-purple-primary text-white shadow-md font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Shorts
              </button>
            </div>

            <div className="p-3 bg-purple-50/50 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900/50 text-xs text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <InfoCircleOutlined />
              <span>
                {contentType === 'long' 
                  ? 'Long-form RPM typically ranges from $0.1 to $15+ depending on niche.' 
                  : 'Shorts RPM typically ranges from $0.01 to $0.15 per 1,000 views.'}
              </span>
            </div>
          </div>

          {/* Yellow Marketplace CTA Card */}
          <div className="bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-indigo-500/10 dark:from-purple-950/40 dark:to-indigo-950/20 rounded-3xl p-6 border border-purple-300/40 dark:border-purple-700/40 shadow-card relative overflow-hidden space-y-4">
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold rounded-full text-[11px] uppercase tracking-wide">
              🔥 Real Sellers, Real Money
            </span>

            <h3 className="text-xl font-extrabold text-text-primary leading-tight">
              Stop calculating.<br />Start earning.
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed">
              Every month you spend growing from zero is a month of revenue lost. Monetized channels on SocialSwap are already making exactly what you're calculating — <strong>right now</strong>.
            </p>

            <Link
              to="/channels"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-purple-500/10 transition-all transform hover:-translate-y-0.5"
            >
              <span>Browse channels now</span>
              <ArrowRightOutlined />
            </Link>

            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
              * Based on verified channel metrics across 50+ YouTube categories.
            </p>
          </div>

        </div>

      </div>

      {/* How to Use Section */}
      <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-white/10">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary">
          How to Use the YouTube Money Calculator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Enter your daily views',
              desc: 'Use the slider or switch to Shorts mode. Adjust to your channel\'s average daily view count.'
            },
            {
              step: '02',
              title: 'Adjust your RPM',
              desc: 'Choose Long-form or Shorts, then fine-tune RPM by niche — Finance channels earn far more than Gaming.'
            },
            {
              step: '03',
              title: 'Get instant results',
              desc: 'See estimated daily, weekly, monthly, and yearly YouTube earnings calculated in real time.'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white/30 dark:bg-[#110C1F]/30 backdrop-blur-[12px] rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-card space-y-3"
            >
              <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-primary dark:text-purple-300 font-extrabold text-xs rounded-lg">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-text-primary">
                {item.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueCalculator;
