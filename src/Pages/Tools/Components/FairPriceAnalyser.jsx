import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputNumber, Select, Switch } from 'antd';
import { 
  SafetyCertificateOutlined, 
  ArrowRightOutlined, 
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FundOutlined
} from '@ant-design/icons';

const FairPriceAnalyser = () => {
  const [askingPrice, setAskingPrice] = useState(15000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(750);
  const [subscribers, setSubscribers] = useState(45000);
  const [isMonetized, setIsMonetized] = useState(true);
  const [niche, setNiche] = useState('Tech & Software');
  const [channelAge, setChannelAge] = useState(2);

  // Niche Multiplier modifier
  const nicheMultipliers = {
    'Finance & Investing': 1.25,
    'Tech & Software': 1.15,
    'Education & Business': 1.10,
    'Vlogs & Lifestyle': 0.95,
    'Entertainment & Comedy': 0.90,
    'Gaming': 0.85
  };

  const multiplier = nicheMultipliers[niche] || 1.0;

  // Valuation algorithm
  // Monetized channel baseline: 18x to 24x monthly revenue adjusted by niche & age
  // Non-monetized channel baseline: subscriber value ($0.08 - $0.20 per sub depending on niche)
  const baseMonthlyMultipleMin = isMonetized ? 18 * multiplier : 0;
  const baseMonthlyMultipleMax = isMonetized ? 24 * multiplier : 0;

  const subValueMin = subscribers * (isMonetized ? 0.05 : 0.12) * multiplier;
  const subValueMax = subscribers * (isMonetized ? 0.10 : 0.22) * multiplier;

  const estimatedMin = Math.round(monthlyRevenue * baseMonthlyMultipleMin + subValueMin);
  const estimatedMax = Math.round(monthlyRevenue * baseMonthlyMultipleMax + subValueMax);
  const estimatedMid = Math.round((estimatedMin + estimatedMax) / 2);

  // Calculate price evaluation tag
  const getDealAssessment = () => {
    if (askingPrice <= 0) return { label: 'Invalid Price', color: 'gray', bg: 'bg-gray-500/20 text-gray-400', icon: <InfoCircleOutlined /> };
    if (askingPrice < estimatedMin * 0.9) {
      return { 
        label: 'Great Deal (Bargain)', 
        color: 'emerald', 
        bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        badgeBg: 'from-emerald-600 to-teal-600',
        desc: 'Asking price is well below fair market value. High ROI potential!',
        icon: <SafetyCertificateOutlined className="text-emerald-400" />
      };
    }
    if (askingPrice <= estimatedMax * 1.1) {
      return { 
        label: 'Fair Market Price', 
        color: 'blue', 
        bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        badgeBg: 'from-blue-600 to-indigo-600',
        desc: 'Asking price is consistent with 1,000+ recent marketplace sales.',
        icon: <CheckCircleOutlined className="text-blue-400" />
      };
    }
    return { 
      label: 'Overpriced', 
      color: 'amber', 
      bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badgeBg: 'from-amber-600 to-orange-600',
      desc: 'Asking price is higher than standard valuation multiples for this niche.',
      icon: <WarningOutlined className="text-amber-400" />
    };
  };

  const assessment = getDealAssessment();
  const multiple = monthlyRevenue > 0 ? (askingPrice / monthlyRevenue).toFixed(1) : 'N/A';
  const paybackMonths = monthlyRevenue > 0 ? (askingPrice / monthlyRevenue).toFixed(1) : 'N/A';
  const pricePerSub = subscribers > 0 ? (askingPrice / subscribers).toFixed(3) : '0';

  const formatCurrency = (val) => `$${Number(val).toLocaleString()}`;

  return (
    <div className="space-y-12">
      {/* Top Grid: Input Form + Assessment Output Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left 2 Columns: Input Controls */}
        <div className="lg:col-span-2 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-3xl p-6 md:p-8 border border-white/40 dark:border-white/10 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <FundOutlined className="text-purple-primary" />
              <span>Channel Details</span>
            </h2>
            <span className="text-xs text-text-secondary">
              Enter metrics to calculate fair value
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Input: Asking Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Asking Price ($ USD)
              </label>
              <InputNumber
                prefix="$"
                min={0}
                max={1000000}
                value={askingPrice}
                onChange={(val) => setAskingPrice(val || 0)}
                className="w-full h-11 rounded-xl flex items-center text-base"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </div>

            {/* Input: Monthly Revenue */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Monthly Net Revenue ($ USD)
              </label>
              <InputNumber
                prefix="$"
                min={0}
                max={500000}
                value={monthlyRevenue}
                onChange={(val) => setMonthlyRevenue(val || 0)}
                className="w-full h-11 rounded-xl flex items-center text-base"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </div>

            {/* Input: Subscriber Count */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Subscriber Count
              </label>
              <InputNumber
                min={0}
                max={50000000}
                value={subscribers}
                onChange={(val) => setSubscribers(val || 0)}
                className="w-full h-11 rounded-xl flex items-center text-base"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </div>

            {/* Input: Channel Niche */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Channel Category / Niche
              </label>
              <Select
                value={niche}
                onChange={setNiche}
                className="w-full h-11 rounded-xl"
                options={Object.keys(nicheMultipliers).map((n) => ({ label: n, value: n }))}
              />
            </div>

            {/* Input: Channel Age */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Channel Age (Years)
              </label>
              <InputNumber
                min={0.5}
                max={15}
                step={0.5}
                value={channelAge}
                onChange={(val) => setChannelAge(val || 1)}
                className="w-full h-11 rounded-xl flex items-center text-base"
              />
            </div>

            {/* Input: Monetization Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10">
              <div>
                <span className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                  YouTube Monetization
                </span>
                <span className="text-[11px] text-gray-400">
                  Is AdSense enabled on channel?
                </span>
              </div>
              <Switch
                checked={isMonetized}
                onChange={setIsMonetized}
                checkedChildren="Active"
                unCheckedChildren="Off"
              />
            </div>

          </div>
        </div>

        {/* Right Column: Valuation Report Banner */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#1A1035] to-[#0D071F] text-white rounded-3xl p-6 md:p-8 border border-purple-500/20 shadow-xl relative overflow-hidden space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Fair Market Analysis
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${assessment.bg}`}>
                {assessment.icon}
                <span>{assessment.label}</span>
              </span>
            </div>

            {/* Estimated Value Display */}
            <div>
              <span className="text-xs text-gray-400 block mb-1">Estimated Fair Market Value</span>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(estimatedMin)} – {formatCurrency(estimatedMax)}
              </div>
              <p className="text-xs text-purple-200/80 mt-1">
                Midpoint Benchmark: <strong className="text-white">{formatCurrency(estimatedMid)}</strong>
              </p>
            </div>

            {/* Valuation Breakdown Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-[11px] text-gray-400 block">Revenue Multiple</span>
                <span className="text-lg font-bold text-white">{multiple}x</span>
                <span className="text-[10px] text-gray-400 block">Monthly Profit</span>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-[11px] text-gray-400 block">Payback Period</span>
                <span className="text-lg font-bold text-white">{paybackMonths} mo</span>
                <span className="text-[10px] text-gray-400 block">To Break Even</span>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-[11px] text-gray-400 block">Per Sub Value</span>
                <span className="text-lg font-bold text-white">${pricePerSub}</span>
                <span className="text-[10px] text-gray-400 block">USD / Subscriber</span>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-[11px] text-gray-400 block">Niche Multiplier</span>
                <span className="text-lg font-bold text-emerald-400">{multiplier}x</span>
                <span className="text-[10px] text-gray-400 block">{niche.split(' ')[0]}</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
              {assessment.desc}
            </p>

            <Link
              to="/channels"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-purple-500/10 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Verified Marketplace Deals</span>
              <ArrowRightOutlined />
            </Link>

          </div>
        </div>

      </div>

      {/* Guide Section */}
      <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-white/10">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary">
          How to Analyze YouTube Channel Fair Price
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/30 dark:bg-[#110C1F]/30 backdrop-blur-[12px] rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-card space-y-3">
            <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-primary dark:text-purple-300 font-extrabold text-xs rounded-lg">
              Step 01
            </span>
            <h3 className="text-base font-bold text-text-primary">
              Evaluate Monthly Revenue Multiple
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Most monetized YouTube channels sell for between 18x to 26x their average net monthly revenue based on standard industry valuation standards.
            </p>
          </div>

          <div className="bg-white/30 dark:bg-[#110C1F]/30 backdrop-blur-[12px] rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-card space-y-3">
            <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-primary dark:text-purple-300 font-extrabold text-xs rounded-lg">
              Step 02
            </span>
            <h3 className="text-base font-bold text-text-primary">
              Factor Niche Demand & Growth
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              High RPM niches like Finance and Tech command premium multipliers (up to 30x), whereas low RPM channels trade at lower revenue multiples.
            </p>
          </div>

          <div className="bg-white/30 dark:bg-[#110C1F]/30 backdrop-blur-[12px] rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-card space-y-3">
            <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-primary dark:text-purple-300 font-extrabold text-xs rounded-lg">
              Step 03
            </span>
            <h3 className="text-base font-bold text-text-primary">
              Check Copyright & Ownership Risk
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Faceless organic channels carry higher buyer demand because they are easier to hand over to a new owner without losing viewer trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FairPriceAnalyser;
