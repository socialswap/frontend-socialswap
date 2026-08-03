import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputNumber, Select, Radio } from 'antd';
import { 
  CalculatorOutlined, 
  ArrowRightOutlined, 
  CheckCircleOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const ChannelPriceCalculator = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(800);
  const [subscribers, setSubscribers] = useState(50000);
  const [monthlyViews, setMonthlyViews] = useState(300000);
  const [niche, setNiche] = useState('Tech & Software');
  const [channelType, setChannelType] = useState('faceless'); // 'faceless' | 'personal'
  const [strikes, setStrikes] = useState('none'); // 'none' | 'active'

  const nicheMultipliers = {
    'Finance & Business': 22,
    'Tech & Software': 20,
    'Education & Tutorials': 19,
    'Vlogs & Lifestyle': 17,
    'Entertainment': 16,
    'Gaming': 15
  };

  const baseMultiple = nicheMultipliers[niche] || 18;
  const facelessBonus = channelType === 'faceless' ? 1.10 : 1.0; // 10% premium for easily transferable faceless channels
  const strikePenalty = strikes === 'active' ? 0.70 : 1.0; // 30% penalty for active strikes

  // Revenue Valuation
  const revenueValue = monthlyRevenue * baseMultiple * facelessBonus * strikePenalty;
  
  // Subscriber Bonus Valuation ($0.05 per sub for active sub base)
  const subscriberValue = subscribers * 0.05 * strikePenalty;

  // View Bonus Valuation ($0.002 per monthly view)
  const viewValue = (monthlyViews / 1000) * 2.0 * strikePenalty;

  const totalEstimatedValue = Math.round(revenueValue + subscriberValue + viewValue);
  const minValuation = Math.round(totalEstimatedValue * 0.9);
  const maxValuation = Math.round(totalEstimatedValue * 1.15);
  const escrowDeposit = Math.round(totalEstimatedValue * 0.10);

  const formatCurrency = (val) => `$${Number(val).toLocaleString()}`;

  return (
    <div className="space-y-12">
      {/* Top Grid: Calculator Form + Output Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left 2 Columns: Input Controls */}
        <div className="lg:col-span-2 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-3xl p-6 md:p-8 border border-white/40 dark:border-white/10 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <CalculatorOutlined className="text-purple-primary" />
              <span>Channel Valuation Inputs</span>
            </h2>
            <span className="text-xs text-text-secondary">
              Calculate instant fair sale price
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

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

            {/* Input: Monthly Views */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Monthly Views Count
              </label>
              <InputNumber
                min={0}
                max={100000000}
                value={monthlyViews}
                onChange={(val) => setMonthlyViews(val || 0)}
                className="w-full h-11 rounded-xl flex items-center text-base"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </div>

            {/* Input: Niche */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Primary Niche
              </label>
              <Select
                value={niche}
                onChange={setNiche}
                className="w-full h-11 rounded-xl"
                options={Object.keys(nicheMultipliers).map((n) => ({ label: n, value: n }))}
              />
            </div>

            {/* Input: Channel Type (Faceless vs Personal) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Channel Content Format
              </label>
              <Radio.Group
                value={channelType}
                onChange={(e) => setChannelType(e.target.value)}
                className="w-full grid grid-cols-2 gap-2"
              >
                <Radio.Button value="faceless" className="text-center rounded-xl py-1 text-xs font-medium">
                  Faceless / Automated
                </Radio.Button>
                <Radio.Button value="personal" className="text-center rounded-xl py-1 text-xs font-medium">
                  Personal Brand
                </Radio.Button>
              </Radio.Group>
            </div>

            {/* Input: Strike History */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Copyright / Community Strikes
              </label>
              <Radio.Group
                value={strikes}
                onChange={(e) => setStrikes(e.target.value)}
                className="w-full grid grid-cols-2 gap-2"
              >
                <Radio.Button value="none" className="text-center rounded-xl py-1 text-xs font-medium">
                  Clean (0 Strikes)
                </Radio.Button>
                <Radio.Button value="active" className="text-center rounded-xl py-1 text-xs font-medium">
                  Active Strikes
                </Radio.Button>
              </Radio.Group>
            </div>

          </div>
        </div>

        {/* Right Column: Calculated Channel Sale Price Box */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#064032] to-[#02241C] text-white rounded-3xl p-6 md:p-8 border border-emerald-500/20 shadow-xl relative overflow-hidden space-y-6">
            
            <div className="flex items-center justify-between border-b border-emerald-400/20 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <ThunderboltOutlined className="text-amber-400" />
                <span>Instant Valuation</span>
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-full text-xs border border-emerald-400/30">
                Verified Formula
              </span>
            </div>

            {/* Big Estimated Sale Price */}
            <div>
              <span className="text-xs text-emerald-200/80 block mb-1">Estimated Fair Channel Sale Price</span>
              <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {formatCurrency(totalEstimatedValue)}
              </div>
              <p className="text-xs text-emerald-200/70 mt-2">
                Suggested Listing Range: <strong className="text-white">{formatCurrency(minValuation)} – {formatCurrency(maxValuation)}</strong>
              </p>
            </div>

            {/* Valuation Drivers */}
            <div className="space-y-2 pt-2 border-t border-emerald-400/20">
              <div className="flex justify-between text-xs py-1 border-b border-emerald-400/10">
                <span className="text-emerald-200/80">Monthly Revenue Value ({baseMultiple}x)</span>
                <span className="font-bold text-white">{formatCurrency(Math.round(revenueValue))}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-emerald-400/10">
                <span className="text-emerald-200/80">Subscriber & View Base Bonus</span>
                <span className="font-bold text-white">+{formatCurrency(Math.round(subscriberValue + viewValue))}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-emerald-400/10">
                <span className="text-emerald-200/80">Channel Format Factor</span>
                <span className={`font-bold ${channelType === 'faceless' ? 'text-emerald-300' : 'text-gray-300'}`}>
                  {channelType === 'faceless' ? '+10% Faceless Premium' : 'Personal Brand'}
                </span>
              </div>
              {strikes === 'active' && (
                <div className="flex justify-between text-xs py-1 text-amber-300 font-semibold">
                  <span>Active Strikes Penalty</span>
                  <span>-30% Reduction</span>
                </div>
              )}
            </div>

            {/* Recommended Escrow Protection */}
            <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/30 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SafetyCertificateOutlined className="text-amber-400 text-lg" />
                <div>
                  <span className="font-bold text-white block">Escrow Deposit</span>
                  <span className="text-[10px] text-emerald-300">Standard 10% Buyer Guarantee</span>
                </div>
              </div>
              <span className="font-extrabold text-white text-sm">{formatCurrency(escrowDeposit)}</span>
            </div>

            <Link
              to="/user/upload-channel"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-purple-500/10 transition-all transform hover:-translate-y-0.5"
            >
              <span>List Your Channel on SocialSwap</span>
              <ArrowRightOutlined />
            </Link>

          </div>
        </div>

      </div>

      {/* Seller Tips & How to Calculate Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-white/10">
        
        {/* Tips to Increase Value */}
        <div className="bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-card space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <CheckCircleOutlined className="text-purple-primary" />
            <span>How to Increase Channel Sale Value by 20–40%</span>
          </h3>

          <ul className="space-y-3 text-xs text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-purple-primary font-bold">•</span>
              <span><strong>Clean Strike Record:</strong> Clear any active copyright or community guidelines warnings before listing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-primary font-bold">•</span>
              <span><strong>Diversify Income:</strong> Add affiliate links or sponsorship packages to boost net monthly profit.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-primary font-bold">•</span>
              <span><strong>Standardize SOPs:</strong> Document video editing and thumbnail creation so a buyer can run it faceless seamlessly.</span>
            </li>
          </ul>
        </div>

        {/* How to Use Calculator */}
        <div className="bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-card space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <InfoCircleOutlined className="text-purple-primary" />
            <span>Understanding YouTube Channel Valuations</span>
          </h3>

          <p className="text-xs text-text-secondary leading-relaxed">
            YouTube channel valuations are calculated primarily as a multiple of average monthly net revenue (typically 15x–24x). Additional factors like subscriber count, monthly viewership growth, monetization status, and automated content formats add bonus premiums.
          </p>

          <div className="p-3 bg-purple-50/50 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900/50 text-xs text-purple-800 dark:text-purple-300">
            SocialSwap provides full escrow protection for buyers and sellers to ensure safe channel transfer upon transaction completion.
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChannelPriceCalculator;
