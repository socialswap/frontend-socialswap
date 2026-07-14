import React, { useState, useEffect, useRef } from 'react';
import { Modal, message } from 'antd';
import io from 'socket.io-client';
import axiosInstance, { api } from '../../API/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

const UserChat = () => {
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [deals, setDeals] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchDeal, setSearchDeal] = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isDealModalVisible, setIsDealModalVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');
  let currentUserId = null;
  let userRole = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.userId || decoded._id || decoded.id;
      userRole = decoded.role;
    } catch (e) {}
  }
  const navigate = useNavigate();
  const location = useLocation();
  const [requestProcessed, setRequestProcessed] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (userRole === 'admin') {
      navigate('/admin/chats', { replace: true });
      return;
    }

    fetchThread();
    fetchDeals();
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && thread) {
      socket.emit('join_thread', thread._id);
      
      socket.on('receive_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
      
      return () => socket.off('receive_message');
    }
  }, [socket, thread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (socket && thread && location.state?.requestDeal && !requestProcessed) {
      const channel = location.state.requestDeal;
      const msgData = {
        threadId: thread._id,
        sender: currentUserId,
        text: `I would like to start an Escrow Deal for this channel:`,
        isChannelCard: true,
        channelId: channel._id
      };
      socket.emit('send_message', msgData);
      
      // Clean up state to prevent resending on refresh
      setRequestProcessed(true);
      window.history.replaceState({}, document.title);
    }
  }, [socket, thread, location.state, currentUserId, requestProcessed]);

  const fetchThread = async () => {
    try {
      const res = await axiosInstance.get(`${api}/chat`);
      if (res.data.success) {
        setThread(res.data.thread);
        setMessages(res.data.thread.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDeals = async () => {
    try {
      const res = await axiosInstance.get(`${api}/deals`);
      if (res.data.success) {
        setDeals(res.data.deals);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !thread) return;
    
    const msgData = {
      threadId: thread._id,
      sender: currentUserId,
      text: newMessage
    };
    
    socket.emit('send_message', msgData);
    setNewMessage('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !thread) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axiosInstance.post(`${api}/chat/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        socket.emit('send_message', {
          threadId: thread._id,
          sender: currentUserId,
          imageUrl: res.data.imageUrl
        });
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const handleDealResponse = async (dealId, status) => {
    try {
      const res = await axiosInstance.patch(`${api}/deals/${dealId}/status`, { status });
      if (res.data.success) {
        if (status === 'accepted') {
          const channelId = res.data.deal.channel;
          navigate(`/payment-gateway/${channelId}`, { state: { dealId, price: res.data.deal.price }});
        } else {
          fetchThread();
          fetchDeals();
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update deal status');
    }
  };

  const handleDealPayment = async (deal) => {
    setPaymentLoading(true);
    try {
      const paymentResponse = await axiosInstance.post(`${api}/create-order`, { 
        amount: deal.dealPrice || deal.price,
        dealId: deal._id
      });
      
      if (paymentResponse.data.success) {
        const { data } = paymentResponse.data;
        if (data.data.instrumentResponse?.redirectInfo?.url) {
          window.location.href = data.data.instrumentResponse.redirectInfo.url;
        } else {
          message.error('No redirect URL found from gateway.');
        }
      } else {
        message.error('Failed to create payment order.');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      message.error(error.response?.data?.message || 'An error occurred while processing payment.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const filteredDeals = deals.filter(deal => 
    deal.channel?.name?.toLowerCase().includes(searchDeal.toLowerCase())
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#ffffff] to-[#fafafa] dark:bg-gradient-to-br dark:from-[#070312] dark:via-[#110824] dark:to-[#0D071C] pt-[100px] pb-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 h-[80vh]">
        
        {/* Left Pane: Chat */}
        <div className="flex-1 bg-white dark:bg-[#18112e] rounded-[20px] shadow-lg border border-gray-200 dark:border-purple-900/30 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] dark:from-[#6D28D9] dark:to-[#9333EA] flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <span className="font-semibold text-white">Chats</span>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/50 dark:bg-transparent">
            {!messages.length && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Escrow Agent</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">Say hi! The admin will assist you with a secure transfer.</p>
              </div>
            )}

            {messages.map((msg, idx) => {
              const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    isMe 
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white rounded-br-sm' 
                    : 'bg-white dark:bg-[#231542] border border-gray-100 dark:border-purple-900/20 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                  }`}>
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="Attachment" className="rounded-lg mb-2 w-full object-cover max-h-64 cursor-pointer" onClick={() => window.open(msg.imageUrl, '_blank')} />
                    )}
                    {msg.text && <p className="text-[14.5px] leading-relaxed">{msg.text}</p>}
                    
                    {msg.isChannelCard && msg.channelId && (
                      <div className="mt-3 p-3 bg-white dark:bg-[#18112e] rounded-xl border border-purple-200 dark:border-purple-800/40 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/channel/${msg.channelId._id || msg.channelId}`)}>
                        <img src={msg.channelId.imageUrls?.[0] || 'https://via.placeholder.com/80'} className="w-16 h-16 rounded-lg object-cover" alt="channel" />
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{msg.channelId.name || 'Unknown Channel'}</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{msg.channelId.category} • {msg.channelId.subscriberCount?.toLocaleString()} subs</p>
                          <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-1">${msg.channelId.price}</p>
                        </div>
                      </div>
                    )}

                    {msg.isDealCard && msg.dealId && (
                      <div className="mt-3 p-4 bg-white dark:bg-[#18112e] rounded-xl border border-gray-200 dark:border-purple-800/40 shadow-sm text-gray-800 dark:text-gray-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#7C3AED] to-[#A855F7]"></div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2 pl-2">Escrow Deal Proposed</h4>
                        
                        <div className="space-y-1 mb-4 bg-gray-50 dark:bg-[#231542] p-3 rounded-lg border border-gray-100 dark:border-purple-900/20 text-[13px]">
                          <p className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Status:</span> <span className={`font-semibold uppercase ${msg.dealId.status === 'accepted' ? 'text-green-600 dark:text-green-400' : msg.dealId.status === 'rejected' ? 'text-red-500 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{msg.dealId.status}</span></p>
                          {msg.dealId.payment && <p className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Payment:</span> <span className={`font-semibold uppercase ${msg.dealId.payment === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>{msg.dealId.payment}</span></p>}
                          {msg.dealId.channel?.name && <p className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Channel:</span> <span className="font-medium truncate max-w-[150px] text-gray-800 dark:text-gray-200">{msg.dealId.channel.name}</span></p>}
                          <p className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Price:</span> <span className="font-bold text-[#7C3AED] dark:text-[#A855F7]">${msg.dealId.dealPrice || msg.dealId.price}</span></p>
                        </div>

                        {msg.dealId.status === 'pending' && msg.dealId.buyer === currentUserId && (
                          <div className="flex space-x-2 mt-3">
                            <button 
                              onClick={() => handleDealResponse(msg.dealId._id, 'accepted')}
                              className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white py-2 rounded-lg font-medium text-sm transition-colors"
                            >
                              Accept & Pay
                            </button>
                            <button 
                              onClick={() => handleDealResponse(msg.dealId._id, 'rejected')}
                              className="flex-1 bg-white dark:bg-transparent border border-gray-200 dark:border-purple-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-gray-300 py-2 rounded-lg font-medium text-sm transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <span className={`text-[10px] block mt-1.5 ${isMe ? 'text-purple-100' : 'text-gray-400 dark:text-gray-500'}`}>
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-[#18112e] border-t border-gray-100 dark:border-purple-900/30">
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-[#231542] p-1.5 rounded-full border border-gray-200 dark:border-purple-900/40 focus-within:border-purple-400 dark:focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-50 dark:focus-within:ring-purple-900/20 transition-all">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current.click()}
                className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#7C3AED] dark:hover:text-[#A855F7] hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              </button>
              <input 
                type="text"
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white text-[14.5px] px-2 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter') handleSendMessage();
                }}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#7C3AED] to-[#A855F7] disabled:opacity-50 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-700 hover:shadow-lg hover:shadow-purple-500/20 rounded-full text-white transition-all"
              >
                <svg className="w-4 h-4 transform rotate-45 -ml-0.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Deals */}
        <div className="flex-1 bg-white dark:bg-[#18112e] rounded-[20px] shadow-lg border border-gray-200 dark:border-purple-900/30 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] dark:from-[#6D28D9] dark:to-[#9333EA] flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span className="font-semibold text-white">Deals</span>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100 dark:border-purple-900/30 bg-white dark:bg-[#18112e]">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search deals..." 
                value={searchDeal}
                onChange={(e) => setSearchDeal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#231542] border border-gray-200 dark:border-purple-900/40 rounded-xl focus:border-[#7C3AED] dark:focus:border-[#A855F7] focus:bg-white dark:focus:bg-[#1A1035] outline-none transition-all text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500" 
              />
              <svg className="absolute left-3.5 top-3 text-gray-400 dark:text-gray-500 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          {/* Deals List */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-transparent space-y-4">
            {filteredDeals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 mt-10">
                <svg className="w-12 h-12 mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <p>You don't have any deals yet</p>
              </div>
            ) : (
              filteredDeals.map(deal => (
                <div key={deal._id} className="bg-white dark:bg-[#231542] p-5 rounded-xl border border-gray-200 dark:border-purple-900/30 shadow-sm hover:shadow-md dark:shadow-none dark:hover:border-purple-700/50 transition-all relative overflow-hidden group">
                  <div className={`absolute left-0 top-0 w-1 h-full ${deal.status === 'accepted' ? 'bg-green-500' : deal.status === 'rejected' ? 'bg-red-500' : 'bg-gradient-to-b from-[#7C3AED] to-[#A855F7]'}`}></div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate pr-4">{deal.channel?.name || 'Unknown Channel'}</h4>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      deal.status === 'accepted' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
                      deal.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                    }`}>
                      {deal.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p className="mb-1">Role: <span className="font-medium text-gray-700 dark:text-gray-300">{deal.buyer?._id === currentUserId ? 'Buyer' : 'Seller'}</span></p>
                      <p className="mb-1">Payment: <span className={`font-semibold uppercase ${deal.payment === 'paid' ? 'text-green-500' : 'text-gray-500'}`}>{deal.payment || 'NOT PAID'}</span></p>
                      <p>Date: {new Date(deal.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      ${deal.dealPrice || deal.price}
                    </div>
                  </div>
                  
                  {deal.status === 'pending' && deal.buyer?._id === currentUserId && (
                     <div className="mt-4 pt-4 border-t border-gray-100 dark:border-purple-900/30 flex space-x-2">
                       <button onClick={() => handleDealResponse(deal._id, 'accepted')} className="flex-1 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 font-medium py-1.5 rounded text-sm transition-colors">Accept</button>
                       <button onClick={() => handleDealResponse(deal._id, 'rejected')} className="flex-1 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-medium py-1.5 rounded text-sm transition-colors">Reject</button>
                     </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-purple-900/20">
                    <button 
                      onClick={() => { setSelectedDeal(deal); setIsDealModalVisible(true); }} 
                      className="w-full text-center text-sm font-semibold text-[#7C3AED] dark:text-[#A855F7] hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>

      {/* Deal Details Modal */}
      <Modal
        title={<div className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2"><svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Deal Information</div>}
        open={isDealModalVisible}
        onCancel={() => {
          setIsDealModalVisible(false);
          setSelectedDeal(null);
        }}
        footer={null}
        className="dark:bg-gray-800"
      >
        {selectedDeal && (
          <div className="space-y-4 pt-2">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Channel Details</h4>
              <p className="flex justify-between mb-1 text-sm"><span className="text-gray-500 dark:text-gray-400">Name:</span> <span className="font-medium text-gray-800 dark:text-gray-200">{selectedDeal.channel?.name || 'N/A'}</span></p>
              <p className="flex justify-between mb-1 text-sm"><span className="text-gray-500 dark:text-gray-400">Deal Price:</span> <span className="font-bold text-purple-600 dark:text-purple-400">${selectedDeal.dealPrice || selectedDeal.price}</span></p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Status</h4>
              <p className="flex justify-between mb-1 text-sm"><span className="text-gray-500 dark:text-gray-400">Deal Status:</span> <span className={`font-semibold uppercase ${selectedDeal.status === 'accepted' ? 'text-green-500' : selectedDeal.status === 'rejected' ? 'text-red-500' : 'text-yellow-600'}`}>{selectedDeal.status}</span></p>
              <p className="flex justify-between mb-1 text-sm"><span className="text-gray-500 dark:text-gray-400">Payment Status:</span> <span className={`font-semibold uppercase ${selectedDeal.payment === 'paid' ? 'text-green-500' : 'text-gray-500'}`}>{selectedDeal.payment || 'NOT PAID'}</span></p>
              <p className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Created:</span> <span className="text-gray-800 dark:text-gray-200">{new Date(selectedDeal.createdAt).toLocaleString()}</span></p>
            </div>

            {selectedDeal.status === 'accepted' && (selectedDeal.payment === 'notpaid' || selectedDeal.payment === 'pending') && selectedDeal.buyer?._id === currentUserId && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => handleDealPayment(selectedDeal)}
                  disabled={paymentLoading}
                  className={`w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-500/30 transition-all flex justify-center items-center gap-2 ${paymentLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {paymentLoading ? 'Initiating Gateway...' : 'Pay Online Now'}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};

export default UserChat;
