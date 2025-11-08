import React, { useState, useEffect } from 'react';
import { message, Spin, Result, Breadcrumb } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HomeOutlined, LoadingOutlined } from '@ant-design/icons';
import DetailPage from './DetailPage';
import axiosInstance, { api } from '../../API/api';

const DetailPageWrapper = () => {
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchChannelDetails();
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <Spin 
                    indicator={<LoadingOutlined style={{ fontSize: 48, color: '#2563eb' }} />} 
                    tip={<span className="text-gray-600 mt-4">Loading channel details...</span>}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <Result
                    status="error"
                    title="Failed to Load Channel"
                    subTitle={error}
                    extra={[
                        <button
                            key="retry"
                            onClick={fetchChannelDetails}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg mr-4 transition-colors"
                        >
                            Try Again
                        </button>,
                        <button
                            key="back"
                            onClick={() => navigate(-1)}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            Go Back
                        </button>
                    ]}
                />
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <Result
                    status="404"
                    title="Channel Not Found"
                    subTitle="Sorry, the channel you're looking for doesn't exist."
                    extra={
                        <button
                            onClick={() => navigate('/channels')}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            Back to Channels
                        </button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div >
                {/* Breadcrumb Navigation */}
                <Breadcrumb className="mb-6">
                    <Breadcrumb.Item>
                        <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                            <HomeOutlined /> Home
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/channels" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Channels
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="text-gray-900 font-medium">
                        {channel.name}
                    </Breadcrumb.Item>
                </Breadcrumb>

                {/* Detail Page Component */}
                <DetailPage channel={channel} refreshData={fetchChannelDetails} />
            </div>
        </div>
    );
};

export default DetailPageWrapper;