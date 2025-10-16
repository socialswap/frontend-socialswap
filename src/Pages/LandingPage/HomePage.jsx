import React from 'react';
import { SearchIcon, HomeIcon, UserIcon, ShoppingCartIcon } from '@heroicons/react/outline';
import { FaYoutube, FaCheckCircle } from 'react-icons/fa';
import FeaturedListings from '../../Component/Feature/Feature';
import Stats from '../../Component/Stats/Stats';
import WhyChannelKart from '../../Component/WhyChannelCart/WhyChannelCard/WhyChannelCart';
import Hero from '../Hero/Hero';
import { ShopOutlined } from '@ant-design/icons';
import FeaturedCategories from '../Hero/Hero';
import Testimonials from '../../Component/Testimonials/Testimonials';
import Process from '../../Component/Steps/Buyer/Buyer';
import Footer from '../../Component/Footer/Footer';
import VideoSection from '../../Component/VideoSection/VideoSection';
import PromotionalBanner from '../../Component/Banner/Banner';
import MobileFooter from '../../Component/Header/MobileFooter';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import AllChannels from '../../Component/Feature/AllChannels';
import { WhatsappIcon } from 'react-share';
const ChannelCard = ({ channel }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex">
                {/* Channel Thumbnail */}
                <div className="w-1/3 mr-4">
                    <img
                        src={channel.thumbnailUrl}
                        alt={channel.name}
                        className="w-full h-auto rounded-lg"
                    />
                </div>

                {/* Channel Details */}
                <div className="w-2/3">
                    <div className="flex items-center mb-2">
                        <FaYoutube className="text-red-600 mr-2" />
                        <FaCheckCircle className="text-blue-500 mr-2" />
                        <span className="text-gray-500 text-sm">In Stock</span>
                    </div>

                    <h2 className="text-xl font-bold mb-2">{channel.subscriberCount} Subscribers {channel.name} YouTube channel</h2>

                    <p className="text-gray-600 mb-2">{channel.category}</p>

                    <p className="text-sm text-gray-500 mb-2">
                        Monetization enabled: {channel.monetizationEnabled ? 'yes' : 'no'}
                        Ways of promotion: {channel.promotionWays}
                        Sources of expense: {channel.expenseSources}
                        Sources of income: {channel.incomeSources}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                        <div>
                            <div className="flex items-center">
                                <span className="mr-2">👥 Followers</span>
                                <span className="font-bold">{channel.subscriberCount}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">📅 Listed</span>
                                <span className="font-bold">{channel.listedDate}</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-gray-500 line-through">USD ${channel.originalPrice}</p>
                            <p className="text-2xl font-bold text-blue-600">USD ${channel.currentPrice}</p>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded mr-2 hover:bg-blue-100">
                            View Detail
                        </button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const HomePage = () => {
const navigate = useNavigate()

    return (
        <div className="bg-white min-h-screen">
            {/* <header className="bg-white p-4 mx-auto flex item-center justify-end">
                <div className="flex items-center w-full mx-[3%]">
                    <input type="text" placeholder="Search channels" className="w-full p-2 outline-none rounded-md bg-gray-100" />
                    <SearchIcon className="h-6 w-6 text-gray-500 mr-2 absolute right-[5rem]" />
                </div>
            </header> */}
            <div className='max-w-[100%]  mx-auto mt-16'>
            <div className='w-[100vw] max-w-[100vw] sm:max-w-[90vw] sm:w-[100vw] m-auto'>
            <Button
  className="mx-auto flex items-center justify-center mt-28  px-6 py-5 bg-blue-600 text-white  font-bold text-md rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
  onClick={() => navigate('/seller-dashboard')}
>
  <ShopOutlined className="mr-2 text-lg" />
  Sell Your Channel
</Button>
                <FeaturedCategories />
                <Stats />

                <PromotionalBanner/>
                <VideoSection/>
                   </div>
                    <FeaturedListings />
                    <AllChannels/>
                <Testimonials />t
                <WhyChannelKart />
                <Process />
                </div>
            <Footer />
        </div>
    );
};

export default HomePage;