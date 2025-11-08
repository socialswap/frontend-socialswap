import React from 'react';
import FeaturedListings from '../../Component/Feature/Feature';
import Stats from '../../Component/Stats/Stats';
import WhyChannelKart from '../../Component/WhyChannelCart/WhyChannelCard/WhyChannelCart';
import { ShopOutlined } from '@ant-design/icons';
import FeaturedCategories from '../Hero/Hero';
import Testimonials from '../../Component/Testimonials/Testimonials';
import Process from '../../Component/Steps/Buyer/Buyer';
import Footer from '../../Component/Footer/Footer';
import VideoSection from '../../Component/VideoSection/VideoSection';
import PromotionalBanner from '../../Component/Banner/Banner';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import AllChannels from '../../Component/Feature/AllChannels';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white min-h-screen">
            <div className='max-w-[100%] mx-auto mt-16'>
                <div className='w-[100vw] max-w-[100vw] sm:max-w-[100vw] sm:w-[100vw] m-auto'>
                    <FeaturedCategories />
                    <Stats />
                    <PromotionalBanner/>
                    <VideoSection/>
                </div>
                <FeaturedListings />
                <AllChannels/>
                <Testimonials />
                <WhyChannelKart />
                <Process />
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
