import React, { useState, useEffect } from 'react';
import { Layout, Input, List, Typography, Select, DatePicker, Switch, Row, Col, Button, Drawer, message, Checkbox } from 'antd';
import { SearchOutlined, MenuOutlined, ClearOutlined } from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';
import ChannelCard from '../../Component/Card/Card';
import styled from 'styled-components';
import { useParams, useSearchParams } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const StyledLayout = styled(Layout)`
  .ant-layout-sider {
    @media (max-width: 1024px) {
      display: none;
    }
  }
`;

const StyledContent = styled(Content)`
  transition: margin-left 0.2s;
  background: white;
  overflow: hidden;
`;

const FilterSection = styled.div`
  
  border-right: 1px solid #e8e8e8;
  height: 100%;
  color:white;
  
  .filter-header {
    color: white;
    padding: 16px;
    margin-bottom: 24px;
  }

  .filter-group {
    padding: 0 16px;
    margin-bottom: 24px;
    
    .filter-title {
      color: black;
      font-weight: 600;
      margin-bottom: 12px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .ant-select {
    width: 100%;
    
    .ant-select-selector {
      border: 1px solid #d9d9d9;
      &:hover {
        border-color: #FF0000;
      }
    }
  }

  .ant-checkbox-wrapper {
    margin-left: 0;
    margin-bottom: 8px;
    
    &:hover {
      .ant-checkbox-inner {
        border-color: #FF0000;
      }
    }
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #FF0000;
    border-color: #FF0000;
  }

  .ant-switch-checked {
    background-color: #FF0000;
  }

  .ant-picker {
    width: 100%;
    &:hover {
      border-color: #FF0000;
    }
  }

  .ant-btn {
    &:hover {
      color: #FF0000;
      border-color: #FF0000;
    }
  }
`;

const MobileFilterButton = styled(Button)`
  @media (min-width: 1025px) {
    display: none;
  }
  background: #FF0000;
  border-color: #FF0000;
  
  &:hover {
    background: #D70000 !important;
    border-color: #D70000 !important;
  }
`;

const SearchBar = styled(Input)`
  .ant-input-prefix {
    color: #FF0000;
  }
  
  &:hover, &:focus {
    border-color: #FF0000;
  }
`;

const ChannelList = () => {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSelected, setFilterSelected] = useState(false);
    const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [params,] = useSearchParams();
    const [filteredChannels, setFilteredChannels] = useState([]);

    const [filters, setFilters] = useState({
        channelName: '',
        category: [],
        subscriberRange: [],
        viewCountRange: [],
        videoCountRange: [],
        earningsRange: [],
        joinedDateRange: [null, null],
        country: [],
        averageViewsRange: [],
        my_language: [],
        channelType: [],
        contentType: [],
        recentViewsRange: [],
        copyrightStrike: null,
        communityStrike: null,
        monetized: null,
        watchTimeRange: [],
    });

    useEffect(() => {
        fetchChannels();
    }, [filters, filterSelected]);

    useEffect(() => {
        if (channels.length > 0) {
            const filtered = channels.filter(channel =>
                channel.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredChannels(filtered);
        }
    }, [searchTerm, channels]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const fetchChannels = async () => {
        try {
            setLoading(true);
            let params = new URLSearchParams();

            if (filterSelected) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) {
                        params.append(key, JSON.stringify(value));
                    } else if (value !== null && value !== '') {
                        params.append(key, JSON.stringify(value));
                    }
                });
            } else {
                params.append('filters', null);
            }

            const response = await axiosInstance.get(`${api}/channels`, { params });

            if (response.data && Array.isArray(response.data.channels)) {
                setChannels(response.data.channels);
            } else {
                console.error('Unexpected API response structure:', response.data);
                message.error('Error fetching channels. Please try again later.');
                setChannels([]);
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
            message.error('Error fetching channels. Please try again later.');
            setChannels([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (name, value) => {
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));

        setFilterSelected(() => {
            const updatedFilters = { ...filters, [name]: value };
            return Object.values(updatedFilters).some(val =>
                (Array.isArray(val) && val.length > 0) ||
                (val !== null && val !== '')
            );
        });
    };

    const clearFilters = () => {
        setFilters({
            channelName: '',
            category: [],
            subscriberRange: [],
            viewCountRange: [],
            videoCountRange: [],
            earningsRange: [],
            joinedDateRange: [null, null],
            country: [],
            averageViewsRange: [],
            my_language: [],
            channelType: [],
            contentType: [],
            recentViewsRange: [],
            copyrightStrike: null,
            communityStrike: null,
            monetized: null,
            watchTimeRange: [],
        });
        setFilterSelected(false);
    };

    const renderFilter = (title, filterName, component) => (
        <div className="filter-group">
            <div className="filter-title" >{title}</div>
            {component}
        </div>
    );

    const renderRangeCheckboxes = (filterName, options) => (
        <Checkbox.Group
            value={filters[filterName].map(range => JSON.stringify(range))}
            onChange={(checkedValues) => {
                const newRanges = checkedValues.map(value => JSON.parse(value));
                handleInputChange(filterName, newRanges);
            }}
        >
            <Row>
                {options.map((option, index) => (
                    <Col span={24} key={index}>
                        <Checkbox value={JSON.stringify(option.value)}>{option.label}</Checkbox>
                    </Col>
                ))}
            </Row>
        </Checkbox.Group>
    );

    const FiltersContent = () => (
        <FilterSection style={{ background: '#fff' }}>
            <div className="filter-header">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>FILTERS</Title>
                    </Col>
                    <Col>
                        <Button
                            icon={<ClearOutlined />}
                            onClick={clearFilters}
                            style={{ color: '#1e0000', borderColor: 'white' }}
                        >
                            <span style={{ color: '#1e0000', borderColor: 'white' }}
                            >Clear</span>
                        </Button>
                    </Col>
                </Row>
            </div>

            {renderFilter("Category", "category",
                <Select mode="multiple" value={filters.category} onChange={(value) => handleInputChange("category", value)}>
                    <Option value="Gaming">Gaming</Option>
                    <Option value="Vlogs">Vlogs</Option>
                    <Option value="Music">Music</Option>
                    <Option value="Tech">Tech</Option>
                    <Option value="Facts">Facts</Option>
                    <Option value="Entertainment">Entertainment</Option>
                    <Option value="Anime">Anime</Option>
                    <Option value="Education">Education</Option>
                    <Option value="Podcast">Podcast</Option>
                    <Option value="News">News</Option>
                    <Option value="Commentary">Commentary</Option>
                    <Option value="Reaction">Reaction</Option>
                    <Option value="Other">Other</Option>
                </Select>
            )}

            {renderFilter("Channel Type", "channelType",
                <Select mode="multiple" value={filters.channelType} onChange={(value) => handleInputChange("channelType", value)}>
                    <Option value="Long Videos">Long Videos</Option>
                    <Option value="Short Videos">Short Videos</Option>
                    <Option value="Both Long & Short Videos">Mixed</Option>
                </Select>
            )}

            {renderFilter("Subscriber Count", "subscriberRange",
                renderRangeCheckboxes("subscriberRange", [
                    { value: [0, 1000], label: '0 to 1k' },
                    { value: [1001, 10000], label: '1k to 10k' },
                    { value: [10001, 50000], label: '10k to 50k' },
                    { value: [50001, 100000], label: '50k to 100k' },
                    { value: [100001, 1000000000000000000000000], label: 'Above 100k' },
                ])
            )}

            {renderFilter("Total View Count", "viewCountRange",
                renderRangeCheckboxes("viewCountRange", [
                    { value: [0, 1000], label: '0 to 1k' },
                    { value: [1001, 10000], label: '1k to 10k' },
                    { value: [10001, 50000], label: '10k to 50k' },
                    { value: [50001, 100000], label: '50k to 100k' },
                    { value: [100001, 1000000000000000000000000], label: 'Above 100k' },
                ])
            )}

            {renderFilter("Video Count", "videoCountRange",
                renderRangeCheckboxes("videoCountRange", [
                    { value: [0, 10], label: '0 to 10' },
                    { value: [11, 50], label: '11 to 50' },
                    { value: [51, 100], label: '51 to 100' },
                    { value: [101, 500], label: '101 to 500' },
                    { value: [501, 1000000000000000000000000], label: 'Above 500' },
                ])
            )}

            {renderFilter("Estimated Monthly Earnings ($)", "earningsRange",
                renderRangeCheckboxes("earningsRange", [
                    { value: [0, 100], label: '0 to $100' },
                    { value: [101, 1000], label: '$101 to $1k' },
                    { value: [1001, 5000], label: '$1k to $5k' },
                    { value: [5001, 10000], label: '$5k to $10k' },
                    { value: [10001, 100000000000000000000], label: 'Above $10k' },
                ])
            )}

            {renderFilter("Joined Date", "joinedDateRange",
                <DatePicker.RangePicker
                    value={filters.joinedDateRange}
                    onChange={(dates) => handleInputChange("joinedDateRange", dates)}
                />
            )}

            {renderFilter(
                "Country",
                "country",
                <Select
                    mode="multiple"
                    value={filters.country}
                    onChange={(value) => handleInputChange("country", value)}
                >
                    <Option value="US">United States</Option>
                    <Option value="UK">United Kingdom</Option>
                    <Option value="CA">Canada</Option>
                    <Option value="IN">India</Option>
                    <Option value="CN">China</Option>
                    <Option value="JP">Japan</Option>
                    <Option value="DE">Germany</Option>
                    <Option value="FR">France</Option>
                    <Option value="IT">Italy</Option>
                    <Option value="BR">Brazil</Option>
                    <Option value="RU">Russia</Option>
                    <Option value="AU">Australia</Option>
                    <Option value="MX">Mexico</Option>
                    <Option value="ZA">South Africa</Option>
                    <Option value="KR">South Korea</Option>
                    <Option value="ES">Spain</Option>
                    <Option value="ID">Indonesia</Option>
                    <Option value="TR">Turkey</Option>
                    <Option value="SA">Saudi Arabia</Option>
                    <Option value="AR">Argentina</Option>
                </Select>
            )}


            {renderFilter("Average Views Per Video", "averageViewsRange",
                renderRangeCheckboxes("averageViewsRange", [
                    { value: [0, 1000], label: '0 to 1k' },
                    { value: [1001, 10000], label: '1k to 10k' },
                    { value: [10001, 50000], label: '10k to 50k' },
                    { value: [50001, 100000], label: '50k to 100k' },
                    { value: [100001, 1000000000000000000000000], label: 'Above 100k' },
                ])
            )}

            {renderFilter("Language", "my_language",
                <Select mode="multiple" value={filters.my_language} onChange={(value) => handleInputChange("my_language", value)}>
                    <Option value="English">English</Option>
                    <Option value="Hindi">Hindi</Option>
                    <Option value="Tamil">Tamil</Option>
                    <Option value="Telugu">Telugu</Option>
                    <Option value="Bengali">Bengali</Option>
                    <Option value="Marathi">Marathi</Option>
                    <Option value="Gujarati">Gujarati</Option>
                    <Option value="Kannada">Kannada</Option>
                    <Option value="Malayalam">Malayalam</Option>
                    <Option value="Punjabi">Punjabi</Option>
                    <Option value="Odia">Odia</Option>

                </Select>
            )}

            {renderFilter("Recent Views (Last 28 Days)", "recentViewsRange",
                renderRangeCheckboxes("recentViewsRange", [
                    { value: [0, 1000], label: '0 to 1k' },
                    { value: [1001, 10000], label: '1k to 10k' },
                    { value: [10001, 50000], label: '10k to 50k' },
                    { value: [50001, 100000], label: '50k to 100k' },
                    { value: [100001, 1000000000000000000000000], label: 'Above 100k' },
                ])
            )}

            {renderFilter("Watch Time (Hours)", "watchTimeRange",
                renderRangeCheckboxes("watchTimeRange", [
                    { value: [0, 1000], label: '0 to 1k' },
                    { value: [1001, 10000], label: '1k to 10k' },
                    { value: [10001, 50000], label: '10k to 50k' },
                    { value: [50001, 100000], label: '50k to 100k' },
                    { value: [100001, 1000000000000000000000000], label: 'Above 100k' },
                ])
            )}

            {renderFilter("Monetized", "monetized",
                <Switch
                    checked={filters.monetized}
                    onChange={(checked) => handleInputChange("monetized", checked)}
                />
            )}
        </FilterSection>
    );

    return (
        <div className="bg-white mt-16 mb-16">
            <StyledLayout>
                <div className='flex'>
                    <div className='w-[15%] hidden sm:flex'>
                        <FiltersContent />
                    </div>
                    <Drawer
                        title={<div style={{ color: 'white', margin: -24, padding: 24 }}>Filters</div>}
                        placement="left"
                        closable={true}
                        onClose={() => setMobileDrawerVisible(false)}
                        visible={mobileDrawerVisible}
                        bodyStyle={{ padding: 0 }}
                        width={300}
                    >
                        <FiltersContent />
                    </Drawer>

                    <StyledContent>
                        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '20px', marginLeft: '0' }} className='my-4 px-8 bg-white'>
                            <Col xs={24} sm={24} md={16} lg={18}>
                                <SearchBar
                                    placeholder="Search channels"
                                    prefix={<SearchOutlined />}
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    size="large"
                                />
                            </Col>
                            <Col xs={24} sm={24} md={8} lg={6}>
                                <MobileFilterButton
                                    type="primary"
                                    icon={<MenuOutlined />}
                                    onClick={() => setMobileDrawerVisible(true)}
                                    size="large"
                                    block
                                    className='w-50'
                                >
                                    Filters
                                </MobileFilterButton>
                            </Col>
                        </Row>

                        <List
                            style={{ marginLeft: '0' }}
                            grid={{
                                gutter: 24,
                                xs: 1,
                                sm: 2,
                                md: 2,
                                lg: 3,
                                xl: 3,
                                xxl: 4
                            }}
                            dataSource={filteredChannels.length > 0 ? filteredChannels : channels}
                            loading={loading}
                            className='bg-white px-8'
                            renderItem={channel => (
                                <List.Item>
                                    <ChannelCard channel={channel} />
                                </List.Item>
                            )}
                        />
                        {channels.length === 0 && !loading && (
                            <div style={{
                                textAlign: 'center',
                                margin: '20px 0',
                                color: 'white',
                                fontSize: '16px'
                            }}>
                                No channels found. Try adjusting your filters.
                            </div>
                        )}
                    </StyledContent>
                </div>
            </StyledLayout>
        </div>
    );
};

export default ChannelList;