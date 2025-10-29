import React, { useState, useEffect } from "react";
import { Row, Col, Checkbox, Input, Button, Slider } from "antd";
import axios from "axios";
import ChannelCard from "../../Component/ChannelCard.jsx";

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    subscribersRange: [],
    viewsRange: [],
    estimatedEarnings: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_BASE_URL}/channels`);
        setChannels(response.data);
        setFilteredChannels(response.data);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    fetchChannels();
  }, []);

  const handleInputChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applyFilters = () => {
    let filtered = [...channels];

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((channel) =>
        filters.category.includes(channel.category)
      );
    }

    // Subscribers range filter
    if (filters.subscribersRange.length > 0) {
      filtered = filtered.filter((channel) =>
        filters.subscribersRange.some(
          (range) =>
            channel.subscribers >= range[0] && channel.subscribers <= range[1]
        )
      );
    }

    // Views range filter
    if (filters.viewsRange.length > 0) {
      filtered = filtered.filter((channel) =>
        filters.viewsRange.some(
          (range) => channel.views >= range[0] && channel.views <= range[1]
        )
      );
    }

    // Estimated earnings filter
    if (filters.estimatedEarnings.length > 0) {
      filtered = filtered.filter((channel) =>
        filters.estimatedEarnings.some(
          (range) =>
            channel.estimatedEarnings >= range[0] &&
            channel.estimatedEarnings <= range[1]
        )
      );
    }

    // Search term filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((channel) =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredChannels(filtered);
  };

  const resetFilters = () => {
    setFilters({
      category: [],
      subscribersRange: [],
      viewsRange: [],
      estimatedEarnings: [],
    });
    setSearchTerm("");
    setFilteredChannels(channels);
  };

  const renderRangeCheckboxes = (filterName, options) => (
    <Checkbox.Group
      value={(filters[filterName] || []).map((range) => JSON.stringify(range))}
      onChange={(checkedValues) => {
        const newRanges = checkedValues.map((value) => JSON.parse(value));
        handleInputChange(filterName, newRanges);
      }}
    >
      <Row>
        {options.map((option, index) => (
          <Col span={24} key={index}>
            <Checkbox value={JSON.stringify(option.value)}>
              {option.label}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  );

  const renderFilter = (title, filterName, component) => (
    <div className="mb-4">
      <h4 className="font-semibold mb-2">{title}</h4>
      {component}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row p-6 bg-gray-50 min-h-screen">
      {/* Sidebar Filters */}
      <div className="md:w-1/4 bg-white p-4 rounded-2xl shadow-md mb-6 md:mb-0 md:mr-6">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        {/* Category Filter */}
        {renderFilter(
          "Category",
          "category",
          <Checkbox.Group
            value={filters.category}
            onChange={(checkedValues) =>
              handleInputChange("category", checkedValues)
            }
          >
            <Row>
              <Col span={24}>
                <Checkbox value="Technology">Technology</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="Gaming">Gaming</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="Music">Music</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="Education">Education</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="Lifestyle">Lifestyle</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        )}

        {/* Subscribers Range Filter */}
        {renderFilter(
          "Subscribers Range (in thousands)",
          "subscribersRange",
          renderRangeCheckboxes("subscribersRange", [
            { value: [0, 10], label: "0 - 10K" },
            { value: [10, 50], label: "10K - 50K" },
            { value: [50, 100], label: "50K - 100K" },
            { value: [100, 500], label: "100K - 500K" },
            { value: [500, 1000], label: "500K - 1M" },
            { value: [1000, 99999999], label: "1M+" },
          ])
        )}

        {/* Views Range Filter */}
        {renderFilter(
          "Views Range (in millions)",
          "viewsRange",
          renderRangeCheckboxes("viewsRange", [
            { value: [0, 1], label: "0 - 1M" },
            { value: [1, 5], label: "1M - 5M" },
            { value: [5, 10], label: "5M - 10M" },
            { value: [10, 50], label: "10M - 50M" },
            { value: [50, 99999999], label: "50M+" },
          ])
        )}

        {/* Estimated Earnings Filter — fixed key name */}
        {renderFilter(
          "Estimated Monthly Earnings ($)",
          "estimatedEarnings",
          renderRangeCheckboxes("estimatedEarnings", [
            { value: [0, 100], label: "0 - 100" },
            { value: [100, 500], label: "100 - 500" },
            { value: [500, 1000], label: "500 - 1000" },
            { value: [1000, 5000], label: "1000 - 5000" },
            { value: [5000, 9999999], label: "5000+" },
          ])
        )}

        <div className="flex justify-between mt-4">
          <Button type="primary" onClick={applyFilters}>
            Apply
          </Button>
          <Button onClick={resetFilters}>Reset</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:w-3/4">
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Search channels..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: "70%" }}
          />
          <Button type="primary" onClick={applyFilters}>
            Search
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          {filteredChannels.map((channel) => (
            <Col xs={24} sm={12} md={8} key={channel._id}>
              <ChannelCard channel={channel} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Channels;
