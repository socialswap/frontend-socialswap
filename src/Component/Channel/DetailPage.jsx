import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { message, Image } from 'antd';
import {
  UserOutlined, WhatsAppOutlined, 
  CheckCircleFilled, GlobalOutlined,
  SafetyOutlined,
  YoutubeOutlined, ShoppingCartOutlined, MessageOutlined,
  ShareAltOutlined, CopyOutlined, CheckOutlined
} from '@ant-design/icons';
import axiosInstance, { api } from '../../API/api';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import ChannelCard from '../ChannelCard';

const DetailPage = ({ channel: initialChannel, refreshData }) => {
  const [channel, setChannel] = useState(initialChannel);
  const [isInCart, setIsInCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [relatedChannels, setRelatedChannels] = useState([]);
  const [sellerChannels, setSellerChannels] = useState([]);

  const allImages = useMemo(() => {
    const images = [];
    if (channel?.dashboardImage) {
      images.push(channel.dashboardImage);
    }
    if (channel?.imageUrls && channel.imageUrls.length > 0) {
      images.push(...channel.imageUrls);
    }
    if (images.length === 0 && channel) {
      images.push(channel.logoUrl || channel.avatar || '/images/yt.png');
    }
    return images;
  }, [channel]);

  useEffect(() => {
    if (!isPreviewVisible || !allImages || allImages.length <= 1) return;

    let startX = 0;
    let startY = 0;
    let isMouseDown = false;

    const handleStart = (clientX, clientY) => {
      startX = clientX;
      startY = clientY;
    };

    const handleEnd = (clientX, clientY) => {
      const diffX = clientX - startX;
      const diffY = clientY - startY;
      const swipeThreshold = 60; // minimum swipe distance in pixels

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        if (diffX < 0) {
          // Swipe Left -> Next
          setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        } else {
          // Swipe Right -> Prev
          setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        }
      }
    };

    const handleTouchStart = (e) => {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = (e) => {
      handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    };

    const handleMouseDown = (e) => {
      isMouseDown = true;
      handleStart(e.clientX, e.clientY);
    };

    const handleMouseUp = (e) => {
      if (isMouseDown) {
        isMouseDown = false;
        handleEnd(e.clientX, e.clientY);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPreviewVisible, allImages]);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      if (allImages && allImages.length > 1) {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }
    } else if (info.offset.x > swipeThreshold) {
      if (allImages && allImages.length > 1) {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
    }
  };
  
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef(null);

  // Close share dropdown when clicking outside
  useEffect(() => {
    if (!showShare) return;
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showShare]);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialChannel) {
      setChannel(initialChannel);
    }
  }, [initialChannel]);

  const fetchAdditionalChannels = useCallback(async (chan) => {
    try {
      if (chan.category) {
        const catRes = await axiosInstance.get(`${api}/channels?category=["${chan.category}"]&limit=5`);
        if (catRes.data.success) {
          setRelatedChannels(catRes.data.channels.filter(c => c._id !== chan._id).slice(0, 4));
        }
      }
      if (chan.createdBy) {
        const sellRes = await axiosInstance.get(`${api}/channels?createdBy=${chan.createdBy}&limit=3`);
        if (sellRes.data.success) {
          setSellerChannels(sellRes.data.channels.filter(c => c._id !== chan._id).slice(0, 2));
        }
      }
    } catch(e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    // If we're on a new channel and channel isn't loaded via props, fetch it
    const loadData = async () => {
      try {
        if (!initialChannel && username) {
          const res = await axiosInstance.get(`${api}/channels/username/${username}`);
          setChannel(res.data);
          fetchAdditionalChannels(res.data);
        } else if (channel) {
          fetchAdditionalChannels(channel);
        }
      } catch (err) {
        console.error('Failed to fetch channel', err);
      }
    };
    loadData();
  }, [username, initialChannel, fetchAdditionalChannels, channel]);

  // Keep existing logic
  const checkCartStatus = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const response = await axiosInstance.get(`${api}/cart`);
      const cartItems = response.data.channels || []; // Ensure array
      const currentChannelId = channel?._id || initialChannel?._id;
      setIsInCart(cartItems.some((item) => item._id === currentChannelId));
    } catch (err) {
      console.error('Cart check failed:', err);
    }
  }, [channel?._id, initialChannel?._id]);

  useEffect(() => { checkCartStatus(); }, [checkCartStatus]);

  const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try { return { decoded: jwtDecode(token), userId: jwtDecode(token)._id }; } 
    catch (error) { return null; }
  };

  const handleAddToCart = async () => {
    if (!localStorage.getItem('token')) return navigate('/login');
    try {
      if (isInCart) {
        await axiosInstance.delete(`${api}/cart/remove/${channel._id}`);
        setIsInCart(false);
        message.success(`${channel.name} removed from cart`);
      } else {
        await axiosInstance.post(`${api}/cart/add`, { channelId: channel._id, quantity: 1 });
        setIsInCart(true);
        message.success(`${channel.name} added to cart!`);
      }
    } catch (err) { message.error('Error updating cart'); }
  };

  const handleBuyNow = async () => {
    if (!channel) return message.error('Channel data not available');
    try {
        const user = decodeToken();
        const paymentResponse = await axiosInstance.post(`${api}/create-order`, {
            amount: channel.price,
            cartItems: [{ id: channel._id, name: channel.name, price: channel.price, quantity: 1 }],
            user: user?.decoded
        });
        if (paymentResponse.data.success) {
            const { data } = paymentResponse.data;
            localStorage.setItem('currentTransaction', JSON.stringify({
                transactionId: data.transactionId, amount: channel.price, cartItems: [channel]
            }));
            if (data.data.instrumentResponse?.redirectInfo?.url) {
                window.location.href = data.data.instrumentResponse.redirectInfo.url;
            } else message.error('No redirect URL found');
        } else message.error('Failed to create payment order');
    } catch (error) { message.error('Payment processing failed'); }
  };

  if (!channel) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const mainImage = allImages[currentImageIndex];

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-8 font-sans text-text-primary transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-text-secondary mb-6 flex gap-2">
          <Link to="/" className="hover:text-[#6E4BFF] transition font-medium">Home</Link>
          <span>/</span>
          <span className="text-text-primary font-medium">{channel.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ================= LEFT COLUMN: MAIN CONTENT ================= */}
          <div className="flex-1 space-y-8 min-w-0">
            
            {/* Header Box (New YouTube Style Layout) */}
            <div className="bg-white/65 dark:bg-[#110C1F]/65 backdrop-blur-[20px] rounded-card p-6 shadow-card border border-white/60 dark:border-white/15 relative">
              


              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left mt-2 md:mt-0">
                
                {/* Circular Logo on the Left */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border-2 border-[#C6B4FF]/40 dark:border-purple-800 shadow-md flex items-center justify-center bg-white/40 dark:bg-purple-900/30 text-purple-400 mx-auto md:mx-0">
                  {channel.logoUrl || channel.avatar || mainImage ? (
                    <Image 
                      src={channel.logoUrl || channel.avatar || mainImage} 
                      alt={channel.name}
                      rootClassName="w-full h-full"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl"><YoutubeOutlined /></span>
                  )}
                </div>

                {/* Channel Details on the Right */}
                <div className="flex-1 min-w-0">
                  {/* Title & Badge */}
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary truncate">{channel.name}</h1>
                    <CheckCircleFilled className="text-[#6E4BFF] text-lg" />
                  </div>
                  
                  {/* Handle, Subs, Videos */}
                  <div className="text-sm text-text-secondary mb-3 flex flex-wrap items-center justify-center md:justify-start gap-1">
                    <span className="font-semibold text-text-primary">@{channel.customUrl ? channel.customUrl.split('/').pop().replace('https:', '').replace('http:', '').replace(/^@+/, '') : channel.name.replace(/\s+/g, '')}</span>
                    <span>•</span>
                    <span>{formatNumber(channel.subscriberCount)} subscribers</span>
                    <span>•</span>
                    <span>{channel.videoCount || '1.4K'} videos</span>
                  </div>

                  <div className="text-text-secondary text-sm mb-4 leading-relaxed bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-input p-3 inline-block text-left w-full">
                     <span className="font-semibold text-text-primary">Category:</span> {channel.category || 'Premium'} • 
                     {channel.monetized && <span> <span className="font-semibold text-text-primary ml-1">Monetized:</span> Yes •</span>} 
                     <span className="font-semibold text-[#111827] dark:text-white ml-1">Views:</span> {formatNumber(channel.viewCount)} 
                  </div>

                  {/* Links */}
                  <div className="mb-6 flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm">
                    {channel.customUrl ? (
                      <a href={channel.customUrl} target="_blank" rel="noopener noreferrer" className="text-[#6E4BFF] dark:text-[#C6B4FF] font-semibold hover:underline flex items-center gap-1">
                        <GlobalOutlined /> {channel.customUrl}
                      </a>
                    ) : (
                       <span className="text-text-secondary italic">No external link provided</span>
                    )}
                    {/* YouTube Visit Button */}
                    <a
                      href={(() => {
                        const url = channel.customUrl || '';
                        if (url.startsWith('http')) return url;
                        if (url.startsWith('@') || url.startsWith('UC')) return `https://www.youtube.com/${url}`;
                        if (url) return `https://www.youtube.com/@${url}`;
                        return `https://www.youtube.com/results?search_query=${encodeURIComponent(channel.name)}`;
                      })()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-button bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-bold transition shadow-md shadow-red-500/20 active:scale-95"
                    >
                      <YoutubeOutlined className="text-sm" /> View on YouTube
                    </a>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-auto">
                    {/* Row 1: Contract + Buy (mobile), just Contract (desktop) */}
                    <div className="flex items-center justify-center md:justify-start gap-3 w-full flex-wrap">
                      {decodeToken()?.decoded?.role === 'admin' ? (
                        <button onClick={() => {
                          navigate('/admin/chats', { state: { prefillDeal: channel } });
                        }} className="flex-1 md:flex-none bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] shadow-[0_4px_15px_rgba(16,185,129,0.15)] hover:translate-y-[-3px] hover:scale-[1.03] text-white text-xs md:text-sm font-bold py-2.5 px-3 md:py-3 md:px-5 rounded-button transition-all flex items-center justify-center gap-1.5">
                          <SafetyOutlined /> Make a Contract
                        </button>
                      ) : (
                        <button onClick={() => {
                          if (!localStorage.getItem('token')) {
                            message.info('Please login to request an Escrow Deal.');
                            navigate('/login');
                            return;
                          }
                          navigate('/user/chat', { state: { requestDeal: channel } });
                        }} className="flex-1 md:flex-none bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] shadow-[0_4px_15px_rgba(16,185,129,0.15)] hover:translate-y-[-3px] hover:scale-[1.03] text-white text-xs md:text-sm font-bold py-2.5 px-3 md:py-3 md:px-5 rounded-button transition-all flex items-center justify-center gap-1.5">
                          <MessageOutlined /> Contact Admin to Buy
                        </button>
                      )}
                      <button onClick={handleBuyNow} className="flex-1 md:flex-none bg-white/60 dark:bg-[#1C1438]/80 text-[#6E4BFF] dark:text-[#C6B4FF] border border-[#C6B4FF] dark:border-purple-600/40 text-xs md:text-sm font-bold py-2.5 px-3 md:py-3 md:px-5 rounded-button hover:bg-[#6E4BFF] hover:text-white transition-all shadow-sm">
                        Buy ${channel.price || 0}
                      </button>
                    </div>
                    {/* Row 2: Cart + WhatsApp + Share */}
                    <div className="flex items-center justify-center md:justify-start gap-3 relative">
                      <button onClick={handleAddToCart} className={`w-11 h-11 flex items-center justify-center rounded-button border transition active:scale-95 ${isInCart ? 'bg-purple-50 dark:bg-purple-900/30 text-[#6E4BFF] border-purple-200 dark:border-purple-800' : 'bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-white/60 dark:border-white/10 hover:text-[#6E4BFF] hover:border-purple-200/50 shadow-sm'}`} title="Add to Cart">
                        <ShoppingCartOutlined className="text-base" />
                      </button>
                      {/* WhatsApp Chat Button */}
                      <button
                        onClick={() => {
                          const msg = encodeURIComponent(`Hello, I'm interested in the "${channel.name}" channel on SocialSwap. Let's discuss details.`);
                          window.open(`https://wa.me/+919423523291?text=${msg}`, '_blank');
                        }}
                        className="w-11 h-11 flex items-center justify-center rounded-button border border-green-200 dark:border-green-800/40 bg-green-500 text-white hover:bg-green-600 transition shadow-sm active:scale-95"
                        title="Chat on WhatsApp"
                      >
                        <WhatsAppOutlined className="text-xl" />
                      </button>
                      {/* Share Button */}
                      <div className="relative" ref={shareRef}>
                        <button
                          onClick={() => setShowShare(v => !v)}
                          className="w-11 h-11 flex items-center justify-center rounded-button bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-[#6E4BFF] hover:border-purple-200/50 transition shadow-sm active:scale-95"
                          title="Share this channel"
                        >
                          <ShareAltOutlined className="text-base" />
                        </button>
                        {/* Share Dropdown — opens upward */}
                        <AnimatePresence>
                          {showShare && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 8 }}
                              transition={{ duration: 0.15 }}
                              className="absolute bottom-14 right-0 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 z-50"
                            >
                              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Share this channel</p>

                              {/* Copy Link */}
                              <button
                                onClick={() => {
                                  const url = `https://www.socialswap.in/channel/${channel.customUrl || channel._id}`;
                                  navigator.clipboard.writeText(url).then(() => {
                                    setCopied(true);
                                    message.success('Link copied!');
                                    setTimeout(() => setCopied(false), 2000);
                                  });
                                }}
                                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
                              >
                                <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600">
                                  {copied ? <CheckOutlined /> : <CopyOutlined />}
                                </span>
                                <div>
                                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{copied ? 'Copied!' : 'Copy Link'}</p>
                                  <p className="text-xs text-gray-400 truncate max-w-[150px]">/channel/{channel.customUrl || channel._id}</p>
                                </div>
                              </button>

                              {/* WhatsApp Share */}
                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(`🎬 ${channel.name} YouTube channel for sale! Check it out on SocialSwap 👇 https://www.socialswap.in/channel/${channel.customUrl || channel._id}`)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition mt-1"
                              >
                                <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600">
                                  <WhatsAppOutlined />
                                </span>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Share on WhatsApp</p>
                              </a>

                              {/* Facebook Share */}
                              <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.socialswap.in/channel/${channel.customUrl || channel._id}`)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition mt-1"
                              >
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 font-bold text-sm">f</span>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Share on Facebook</p>
                              </a>

                              {/* Twitter/X Share */}
                              <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🎬 ${channel.name} YouTube channel for sale! ${channel.subscriberCount?.toLocaleString()} subscribers. Check it out on SocialSwap 👇`)}&url=${encodeURIComponent(`https://www.socialswap.in/channel/${channel.customUrl || channel._id}`)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition mt-1"
                              >
                                <span className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 font-bold text-sm">𝕏</span>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Share on X</p>
                              </a>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Channel Images Section (Moved Below Header) */}
            <div className="bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-card p-6 shadow-card border border-white/40 dark:border-white/10">
              <h3 className="text-lg font-bold text-text-primary mb-4">Channel Gallery</h3>
              <div className="flex flex-col gap-4">
                <div className="w-full bg-white/30 dark:bg-[#110C1F]/30 backdrop-blur-md rounded-card overflow-hidden aspect-video flex items-center justify-center border border-white/40 dark:border-white/10 shadow-sm relative group max-h-[400px] select-none">
                  {mainImage ? (
                    <>
                      <Image.PreviewGroup 
                        items={allImages}
                        preview={{ 
                          visible: isPreviewVisible,
                          onVisibleChange: (value) => setIsPreviewVisible(value),
                          current: currentImageIndex, 
                          onChange: (current) => setCurrentImageIndex(current) 
                        }}
                      >
                        <motion.div
                          key={currentImageIndex}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.2}
                          onDragEnd={handleDragEnd}
                          onTap={() => {
                            setIsPreviewVisible(true);
                          }}
                          className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
                        >
                          <Image 
                            src={mainImage} 
                            alt={channel.name} 
                            preview={false}
                            rootClassName="w-full h-full flex items-center justify-center pointer-events-none"
                            className="w-full h-full object-contain transition duration-300 group-hover:scale-[1.01]" 
                            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                          />
                        </motion.div>
                      </Image.PreviewGroup>
 
                      {/* Hover/Touch Navigation Arrows */}
                      {allImages && allImages.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition z-20 active:scale-90 cursor-pointer lg:opacity-0 lg:group-hover:opacity-100"
                            aria-label="Previous image"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 md:w-5 md:h-5"><polyline points="15 18 9 12 15 6"/></svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition z-20 active:scale-90 cursor-pointer lg:opacity-0 lg:group-hover:opacity-100"
                            aria-label="Next image"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 md:w-5 md:h-5"><polyline points="9 18 15 12 9 6"/></svg>
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-5xl text-gray-300"><YoutubeOutlined /></span>
                  )}
                </div>
                {allImages && allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {allImages.map((img, i) => (
                      <div 
                        key={i} 
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-image overflow-hidden shrink-0 cursor-pointer border-2 transition ${currentImageIndex === i ? 'border-[#6E4BFF] shadow-md ring-2 ring-[#C6B4FF]/50' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* General Info & Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white/45 dark:bg-[#110C1F]/45 backdrop-blur-[18px] rounded-card p-6 shadow-card border border-white/40 dark:border-white/10">
              
              {/* General Info */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-text-primary mb-4">General Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-xs md:text-sm">
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Subscribers:</span>
                    <span className="font-bold text-text-primary">{formatNumber(channel.subscriberCount)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Content Type:</span>
                    <span className="font-bold text-text-primary">{channel.channelType || '-'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Language:</span>
                    <span className="font-bold text-text-primary">{channel.my_language || '-'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Country:</span>
                    <span className="font-bold text-text-primary">{channel.country || '-'}</span>
                  </div>
                  {channel.monetized && (
                    <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                      <span className="text-text-secondary">Monetized:</span>
                      <span className="font-bold text-text-primary">Yes</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Gender of viewers:</span>
                    <span className="font-bold text-text-primary">-</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Age of viewers:</span>
                    <span className="font-bold text-text-primary">-</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Last upload date:</span>
                    <span className="font-bold text-text-primary">-</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Channel creation year:</span>
                    <span className="font-bold text-text-primary">{channel.joinedDate ? new Date(channel.joinedDate).getFullYear() : '-'}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-text-secondary">Advanced features enabled:</span>
                    <span className="font-bold text-text-primary">-</span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">Metrics</h3>
                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">RPM:</span>
                    <span className="font-bold text-text-primary">-</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Revenue Monthly:</span>
                    <span className="font-bold text-text-primary">₹{formatNumber(channel.estimatedEarnings)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Revenue last year:</span>
                    <span className="font-bold text-text-primary">-</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Views Last 48h:</span>
                    <span className="font-bold text-text-primary">{formatNumber(channel.recentViews)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Views Last 28 days:</span>
                    <span className="font-bold text-text-primary">-</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 dark:border-white/10 pb-3">
                    <span className="text-text-secondary">Views Last Year:</span>
                    <span className="font-bold text-text-primary">-</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-text-secondary">Watch time (hours) last 90 days:</span>
                    <span className="font-bold text-text-primary">{formatNumber(channel.watchTimeHours)}</span>
                  </div>
                </div>
              </div>
            </div>



          </div>


          {/* ================= RIGHT COLUMN: SIDEBAR ================= */}
          <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 space-y-5">
            
            {/* Seller Profile Card */}
            <div className="bg-white/65 dark:bg-[#110C1F]/65 backdrop-blur-[20px] rounded-card p-6 shadow-card border border-white/60 dark:border-white/15 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full bg-btn-gradient flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-[#110C1F] shadow-purple-glow-soft overflow-hidden">
                  {(channel.createdBy?.avatar || channel.seller?.avatar) ? <img src={channel.createdBy?.avatar || channel.seller?.avatar} alt="Seller" className="w-full h-full object-cover"/> : <UserOutlined />}
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              {channel.createdBy?.username ? (
                <Link to={`/userprofile/@${channel.createdBy.username}`} className="group hover:underline flex flex-col items-center">
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-[#6E4BFF] transition-colors mb-0.5">{channel.createdBy?.name || channel.seller?.name || 'Seller'}</h3>
                  <p className="text-xs text-[#6E4BFF] dark:text-[#C6B4FF] font-bold mb-2">@{channel.createdBy.username}</p>
                </Link>
              ) : (
                <h3 className="text-lg font-bold text-text-primary mb-1">{channel.createdBy?.name || channel.seller?.name || 'Seller'}</h3>
              )}
              <p className="text-sm text-text-secondary mb-4 flex items-center gap-1 justify-center">
                <span className="text-green-500 text-lg"><CheckCircleFilled /></span>
                <span className="ml-2 text-text-secondary">●</span> 
                <span className="ml-1 text-text-secondary">6 min ago</span>
              </p>

              <div className="bg-[#6E4BFF]/10 text-[#6E4BFF] dark:text-[#C6B4FF] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 inline-block border border-[#6E4BFF]/20">
                Since {channel.joinedDate ? new Date(channel.joinedDate).getFullYear() : '2026'}
              </div>

            </div>



            {/* Other channels from this seller */}
            {sellerChannels.length > 0 && (
              <div className="bg-transparent pt-4">
                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Other channels from this Seller</h4>
                <div className="space-y-4">
                  {sellerChannels.map(c => (
                    <ChannelCard key={c._id} channel={c} />
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Related Category Channels (Full Width Bottom Grid) */}
        {relatedChannels.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/20 dark:border-white/10">
            <h3 className="text-xl font-extrabold text-text-primary mb-6">Related Category Channels</h3>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {relatedChannels.map(c => (
                  <motion.div
                    key={c._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChannelCard channel={c} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
