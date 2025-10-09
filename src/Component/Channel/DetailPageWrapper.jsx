import React, { useState, useEffect } from 'react';
import { message, Spin, Result, Breadcrumb, Layout, Typography, Button } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HomeOutlined, YoutubeFilled, LoadingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import DetailPage from './DetailPage';
import axiosInstance, { api } from '../../API/api';
import { jwtDecode } from 'jwt-decode';

const { Content } = Layout;
const { Title } = Typography;



const DetailPageWrapper = () => {
    const [channel, setChannel] = useState(null);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchChannelDetails();
        loadCart();
    }, [id]);

    const fetchChannelDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`${api}/channels/${id}`);
            setChannel(response?.data);
        } catch (err) {
            console.error('Error fetching channel details:', err);
            setError(err.response?.data?.message || 'Failed to load channel details');
        } finally {
            setLoading(false);
        }
    };

    const loadCart = () => {
        try {
            const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCart(savedCart);
        } catch (err) {
            console.error('Error loading cart:', err);
            message.error('Failed to load cart data');
        }
    };

    const handleAddToCart = (channel) => {
        try {
            const updatedCart = [...cart];
            const channelIndex = updatedCart.findIndex(item => item._id === channel._id);

            if (channelIndex === -1) {
                updatedCart.push(channel);
                message.success({
                    content: (
                        <div>
                            <YoutubeFilled style={{ color: '#ff0000' }} /> 
                            {channel.name} has been added to your cart!
                        </div>
                    ),
                    icon: null
                });
            } else {
                updatedCart.splice(channelIndex, 1);
                message.success({
                    content: `${channel.name} has been removed from your cart!`,
                    icon: null
                });
            }

            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } catch (err) {
            console.error('Error updating cart:', err);
            message.error('Failed to update cart');
        }
    };


    const isInCart = channel && cart.some(item => item?._id === channel._id);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin 
                    indicator={<LoadingOutlined style={{ fontSize: 48 }} />} 
                    tip="Loading channel details..."
                />
            </div>
        );
    }

    if (error) {
        return (
            <Result
                status="error"
                title="Failed to Load Channel"
                subTitle={error}
                extra={[
                    <button
                        key="retry"
                        onClick={fetchChannelDetails}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-4"
                    >
                        Try Again
                    </button>,
                    <button
                        key="back"
                        onClick={() => navigate(-1)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Go Back
                    </button>
                ]}
            />
        );
    }

    if (!channel) {
        return (
            <Result
                status="404"
                title="Channel Not Found"
                subTitle="Sorry, the channel you're looking for doesn't exist."
                extra={
                    <button
                        onClick={() => navigate('/channels')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Back to Channels
                    </button>
                }
            />
        );
    }

    return (
        <Layout className="min-h-screen bg-gray-50">
            <Content className="px-4 py-8 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumb className="mb-6">
                        <Breadcrumb.Item>
                            <Link to="/" className="flex items-center gap-1">
                                <HomeOutlined /> Home
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/channels">Channels</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{channel.name}</Breadcrumb.Item>
                    </Breadcrumb>

                    <header className="mb-8 text-center">
                        <Title level={2} className="mb-2 flex items-center justify-center gap-2">
                            <YoutubeFilled style={{ color: '#ff0000' }} />
                            {channel.name}
                        </Title>
                        <p className="text-gray-500">
                            {channel.category} • {channel.subscriberCount.toLocaleString()} subscribers
                        </p>
                        
                    </header>

                    <DetailPage
                        channel={channel}
                        onAddToCart={handleAddToCart}
                        isInCart={isInCart}
                        refreshData={fetchChannelDetails}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default DetailPageWrapper;