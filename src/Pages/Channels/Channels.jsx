import React, { useState, useEffect, useCallback } from "react";
import { Select, Input, Button, Checkbox, Row, Col } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ChannelCard from "../../Component/ChannelCard.jsx";
import { FaGamepad, FaUsers, FaEye, FaDollarSign, FaMoneyBillWave, FaVideo } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const { Option } = Select;
const CATEGORY_OPTIONS = [
  "Gaming",
  "Tech",
  "Finance",
  "Artificial intelligence",
  "Business & Entrepreneurship",
  "Education",
  "Health & Fitness",
  "Food",
  "Infotainment",
  "Vlogging",
  "Sports",
  "Commentary",
  "Entertainment",
  "Music",
  "Motivation & Self-Improvement"
];

const Channels = () => {
  const location = useLocation();
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    subscribersRange: [],
    viewsRange: [],
    estimatedEarnings: [],
    priceRange: [],
    monetization: [], // 'monetized' or 'non-monetized'
    channelType: [], // 'shorts' or 'long-form'
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Read category from URL on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');
    
    if (categoryFromUrl) {
      setFilters(prev => ({
        ...prev,
        category: [categoryFromUrl]
      }));
      setShowAdvancedFilters(true); // Open advanced filters to show the applied filter
    }
  }, [location.search]);

  useEffect(() => {
    const fetchAllChannels = async () => {
      try {
        let allChannels = [];
        let currentPage = 1;
        let totalPages = 1;

        // Fetch channels page by page (max 100 per page due to backend limit)
        while (currentPage <= totalPages) {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/channels?limit=100&page=${currentPage}`
          );
          
          const data = response.data;
          allChannels = [...allChannels, ...(data.channels || [])];
          totalPages = data.totalPages || 1;
          currentPage++;
        }

        setChannels(allChannels);
        setFilteredChannels(allChannels); // Show all channels initially
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

    // Category filter (array-based)
    if (filters.category.length > 0) {
      filtered = filtered.filter((channel) =>
        filters.category.includes(channel.category)
      );
    }

    // Subscribers range filter (array-based)
    if (filters.subscribersRange.length > 0) {
      filtered = filtered.filter((channel) =>
        filters.subscribersRange.some(
          (range) =>
            (channel.subscriberCount || 0) >= range[0] && 
            (channel.subscriberCount || 0) <= range[1]
        )
      );
    }

    // Views range filter (array-based)
    if (filters.viewsRange.length > 0) {
      filtered = filtered.filter((channel) =>
        filters.viewsRange.some(
          (range) => 
            (channel.viewCount || 0) >= range[0] && 
            (channel.viewCount || 0) <= range[1]
        )
      );
    }

    // Estimated earnings filter (array-based)
    if (filters.estimatedEarnings.length > 0) {
      filtered = filtered.filter((channel) =>
        filters.estimatedEarnings.some(
          (range) =>
            (channel.estimatedEarnings || 0) >= range[0] &&
            (channel.estimatedEarnings || 0) <= range[1]
        )
      );
    }

    // Price range filter (array-based)
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter((channel) => {
        const price = parseFloat(channel.price) || 0;
        return filters.priceRange.some(
          (range) => price >= range[0] && price <= range[1]
        );
      });
    }

    // Monetization filter
    if (filters.monetization.length > 0) {
      filtered = filtered.filter((channel) => {
        if (filters.monetization.includes('monetized') && channel.monetized === true) {
          return true;
        }
        if (filters.monetization.includes('non-monetized') && channel.monetized === false) {
          return true;
        }
        return false;
      });
    }

    // Channel type filter
    if (filters.channelType.length > 0) {
      filtered = filtered.filter((channel) => {
        if (filters.channelType.includes('shorts')) {
          if (channel.channelType === 'Short Videos' || channel.channelType === 'Both Long & Short Videos') {
            return true;
          }
        }
        if (filters.channelType.includes('long-form')) {
          if (channel.channelType === 'Long Videos' || channel.channelType === 'Both Long & Short Videos') {
            return true;
          }
        }
        return false;
      });
    }

    // Search term filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((channel) =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
        break;
      case "subscribers":
        filtered.sort((a, b) => (b.subscriberCount || 0) - (a.subscriberCount || 0));
        break;
      case "views":
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // popularity - by subscribers
        filtered.sort((a, b) => (b.subscriberCount || 0) - (a.subscriberCount || 0));
    }

    setFilteredChannels(filtered);
  }, [channels, filters, searchTerm, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleInputChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: [],
      subscribersRange: [],
      viewsRange: [],
      estimatedEarnings: [],
      priceRange: [],
      monetization: [],
      channelType: [],
    });
    setSearchTerm("");
    setSortBy("popularity");
  };

  const renderRangeCheckboxes = (filterName, options) => (
    <Checkbox.Group
      value={(filters[filterName] || [])?.map((range) => JSON.stringify(range))}
      onChange={(checkedValues) => {
        const newRanges = checkedValues?.map((value) => JSON.parse(value));
        handleInputChange(filterName, newRanges);
      }}
    >
      <Row>
        {options?.map((option, index) => (
          <Col span={24} key={index} className="mb-2">
            <Checkbox value={JSON.stringify(option.value)}>
              {option.label}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  );

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category.length > 0) count += filters.category.length;
    if (filters.subscribersRange.length > 0) count += filters.subscribersRange.length;
    if (filters.viewsRange.length > 0) count += filters.viewsRange.length;
    if (filters.estimatedEarnings.length > 0) count += filters.estimatedEarnings.length;
    if (filters.priceRange.length > 0) count += filters.priceRange.length;
    if (filters.monetization.length > 0) count += filters.monetization.length;
    if (filters.channelType.length > 0) count += filters.channelType.length;
    return count;
  };

  const categories = Array.from(
    new Set([
      ...CATEGORY_OPTIONS,
      ...channels.map((ch) => ch.category).filter(Boolean),
    ])
  );

  // Group filtered channels by category
  const groupedChannels = filteredChannels.reduce((acc, channel) => {
    const category = channel.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {});

  // Get category icons
  const getCategoryIcon = (category) => {
    const icons = {
      'Gaming': '🎮',
      'Technology': '💻',
      'Music': '🎵',
      'Education': '📚',
      'Entertainment': '🎬',
      'Lifestyle': '🌟',
      'Sports': '⚽',
      'News': '📰',
      'Comedy': '😂',
      'Food': '🍔',
      'Travel': '✈️',
      'Fashion': '👗',
      'Beauty': '💄',
      'Health': '💪',
      'Science': '🔬',
      'Business': '💼',
    };
    return icons[category] || '📺';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-[4rem]">
      {/* Sticky Quick Search Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined className="text-gray-400" />}
                size="large"
                allowClear
              />
            </div>

            <Select
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              style={{ width: 200 }}
              size="large"
            >
              <Option value="popularity">Popularity</Option>
              <Option value="price-low">Price: Low to High</Option>
              <Option value="price-high">Price: High to Low</Option>
              <Option value="subscribers">Most Subscribers</Option>
              <Option value="views">Most Views</Option>
              <Option value="recent">Recently Added</Option>
            </Select>

            <Button
              type={showAdvancedFilters ? "primary" : "default"}
              icon={<FilterOutlined />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              size="large"
            >
              Advanced Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Button>

            {getActiveFiltersCount() > 0 && (
              <Button onClick={resetFilters} size="large">
                Reset All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters Section (Collapsible) */}
      {showAdvancedFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border-b border-gray-200 shadow-inner"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaGamepad className="text-blue-500" />
                  Category
                </h4>
          <Checkbox.Group
            value={filters.category}
            onChange={(checkedValues) =>
              handleInputChange("category", checkedValues)
            }
          >
            <Row>
                    {categories.map((cat) => (
                      <Col span={24} key={cat} className="mb-2">
                        <Checkbox value={cat}>{cat}</Checkbox>
              </Col>
                    ))}
            </Row>
          </Checkbox.Group>
              </div>

        {/* Subscribers Range Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaUsers className="text-purple-500" />
                  Subscribers Range
                </h4>
                {renderRangeCheckboxes("subscribersRange", [
                  { value: [0, 10000], label: "0 - 10K" },
                  { value: [10000, 50000], label: "10K - 50K" },
                  { value: [50000, 100000], label: "50K - 100K" },
                  { value: [100000, 500000], label: "100K - 500K" },
                  { value: [500000, 1000000], label: "500K - 1M" },
                  { value: [1000000, 99999999], label: "1M+" },
                ])}
              </div>

        {/* Views Range Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaEye className="text-green-500" />
                  Views Range
                </h4>
                {renderRangeCheckboxes("viewsRange", [
                  { value: [0, 1000000], label: "0 - 1M" },
                  { value: [1000000, 5000000], label: "1M - 5M" },
                  { value: [5000000, 10000000], label: "5M - 10M" },
                  { value: [10000000, 50000000], label: "10M - 50M" },
                  { value: [50000000, 99999999], label: "50M+" },
                ])}
              </div>

              {/* Estimated Earnings Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaDollarSign className="text-yellow-500" />
                  Est. Monthly Earnings
                </h4>
                {renderRangeCheckboxes("estimatedEarnings", [
                  { value: [0, 100], label: "₹0 - ₹100" },
                  { value: [100, 500], label: "₹100 - ₹500" },
                  { value: [500, 1000], label: "₹500 - ₹1000" },
                  { value: [1000, 5000], label: "₹1000 - ₹5000" },
                  { value: [5000, 9999999], label: "₹5000+" },
                ])}
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-600" />
                  Price Range
                </h4>
                {renderRangeCheckboxes("priceRange", [
                  { value: [1000, 10000], label: "₹1K - ₹10K" },
                  { value: [10000, 100000], label: "₹10K - ₹1 Lakh" },
                  { value: [100000, 99999999], label: "More than ₹1 Lakh" },
                ])}
              </div>

              {/* Monetization Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaDollarSign className="text-emerald-500" />
                  Monetization Status
                </h4>
                <Checkbox.Group
                  value={filters.monetization}
                  onChange={(checkedValues) =>
                    handleInputChange("monetization", checkedValues)
                  }
                >
                  <Row>
                    <Col span={24} className="mb-2">
                      <Checkbox value="monetized">Monetized Channels</Checkbox>
                    </Col>
                    <Col span={24} className="mb-2">
                      <Checkbox value="non-monetized">Non-Monetized Channels</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </div>

              {/* Channel Type Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaVideo className="text-red-500" />
                  Channel Type
                </h4>
                <Checkbox.Group
                  value={filters.channelType}
                  onChange={(checkedValues) =>
                    handleInputChange("channelType", checkedValues)
                  }
                >
                  <Row>
                    <Col span={24} className="mb-2">
                      <Checkbox value="shorts">Shorts Channels</Checkbox>
                    </Col>
                    <Col span={24} className="mb-2">
                      <Checkbox value="long-form">Long Form Channels</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredChannels.length}</span> channels
            {sortBy && (
              <span className="text-sm text-gray-500 ml-2">
                • Sorted by {sortBy === 'price-low' ? 'Price: Low to High' : 
                           sortBy === 'price-high' ? 'Price: High to Low' : 
                           sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </span>
            )}
          </p>
      </div>

        {/* Channel Cards - Grouped by Category */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl p-4 h-96"
                style={{
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                }}
              />
            ))}
          </div>
        ) : filteredChannels.length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedChannels).map(([category, categoryChannels], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(248, 55, 88, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%)',
                      border: '2px solid rgba(248, 55, 88, 0.2)',
                    }}
                  >
                    <span className="text-3xl">{getCategoryIcon(category)}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                      <p className="text-sm text-gray-600">{categoryChannels.length} channels</p>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>

                {/* Category Channels Grid */}
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {categoryChannels.map((channel) => (
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
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No channels found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
            <Button type="primary" onClick={resetFilters} size="large">
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>

    </div>
  );
};

export default Channels;
