import React, { useState, useEffect, useRef } from 'react';
import { Modal, message, Form, Select, InputNumber } from 'antd';
import io from 'socket.io-client';
import axiosInstance, { api } from '../../API/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const { Option } = Select;

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

const AdminChat = ({ isEmbedded = false }) => {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [deals, setDeals] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchChat, setSearchChat] = useState('');
  const [searchDeal, setSearchDeal] = useState('');
  const [channels, setChannels] = useState([]);
  const [searchChannelTerm, setSearchChannelTerm] = useState('');
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isDealModalVisible, setIsDealModalVisible] = useState(false);

  const [users, setUsers] = useState([]);
  const [searchUserTerm, setSearchUserTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const [socket, setSocket] = useState(null);
  const [dealDetails, setDealDetails] = useState({ channelId: '', price: '', buyerId: '' });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const selectedSellerId = Form.useWatch('sellerId', form);
  
  useEffect(() => {
    const fetchSellerChannels = async () => {
      if (!selectedSellerId) {
        setChannels([]);
        return;
      }
      try {
        const response = await axiosInstance.get(`${api}/admin/users/${selectedSellerId}/channels`);
        if (response.data?.success) {
          setChannels(response.data.channels || []);
        }
      } catch (error) {
        console.error('Error fetching seller channels:', error);
      }
    };
    fetchSellerChannels();
  }, [selectedSellerId]);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const token = localStorage.getItem('token');
  let currentUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.userId || decoded._id || decoded.id;
    } catch (e) {}
  }
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.prefillDeal) {
      setCreateModalVisible(true);
      const ch = location.state.prefillDeal;
      form.setFieldsValue({
        sellerId: ch.seller?._id || ch.seller,
        channelId: ch._id,
        dealPrice: ch.price
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state, form]);

  useEffect(() => {
    fetchThreads();
    fetchDeals();
    fetchAvailableChannels();
    fetchUsers();
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      fetchThreads();
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (activeThread && socket) {
      socket.emit('join_thread', activeThread._id);
    }
  }, [activeThread, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchThreads = async () => {
    try {
      const res = await axiosInstance.get(`${api}/admin/chats`);
      if (res.data.success) setThreads(res.data.threads);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDeals = async () => {
    try {
      const res = await axiosInstance.get(`${api}/admin/deals`);
      if (res.data.success) setDeals(res.data.deals);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailableChannels = async () => {
    // Only fetch globally if needed elsewhere, but we fetch by seller now
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`${api}/users`);
      if (res.data) setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadThread = async (thread) => {
    try {
      const res = await axiosInstance.get(`${api}/admin/chats/${thread._id}`);
      if (res.data.success) {
        setActiveThread(res.data.thread);
        setMessages(res.data.thread.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeThread) return;
    
    const msgData = {
      threadId: activeThread._id,
      sender: currentUserId, 
      text: newMessage
    };
    
    socket.emit('send_message', msgData);
    setNewMessage('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeThread) return;

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
          threadId: activeThread._id,
          sender: currentUserId,
          imageUrl: res.data.imageUrl
        });
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const handleChannelChange = (channelId) => {
    const channel = channels.find(c => c._id === channelId);
    if (channel) {
      form.setFieldsValue({ dealPrice: channel.price });
    }
  };

  const handleCreateDealSubmit = async (values) => {
    try {
      const res = await axiosInstance.post(`${api}/admin/deals`, {
        channelId: values.channelId,
        buyerId: values.buyerId,
        dealPrice: values.dealPrice
      });

      if (res.data.success) {
        message.success('Escrow Deal created and dispatched successfully!');
        setCreateModalVisible(false);
        form.resetFields();
        fetchDeals(); // Refresh deals
      }
    } catch (err) {
      console.error('Error creating deal:', err);
      message.error(err.response?.data?.message || 'Failed to create deal');
    }
  };

  const openCreateModal = () => {
    form.resetFields();
    setChannels([]);
    setCreateModalVisible(true);
  };

  const handlePaymentOverride = async (dealId, paymentStatus) => {
    try {
      const res = await axiosInstance.patch(`${api}/admin/deals/${dealId}/payment`, { payment: paymentStatus });
      if (res.data.success) {
        setSelectedDeal(res.data.deal);
        fetchDeals();
        message.success(`Payment status updated to ${paymentStatus.toUpperCase()}`);
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to update payment status');
    }
  };

  const filteredThreads = threads.filter(t => 
    t.user?.name?.toLowerCase().includes(searchChat.toLowerCase()) || 
    t.user?.email?.toLowerCase().includes(searchChat.toLowerCase())
  );

  const filteredDeals = deals.filter(deal => 
    deal.channel?.name?.toLowerCase().includes(searchDeal.toLowerCase()) ||
    deal.buyer?.name?.toLowerCase().includes(searchDeal.toLowerCase())
  );

  return (
    <div className={`flex justify-center items-center bg-gradient-to-br from-[#f5f5f5] via-[#ffffff] to-[#fafafa] dark:bg-gradient-to-br dark:from-[#070312] dark:via-[#110824] dark:to-[#0D071C] font-sans ${isEmbedded ? 'w-full h-full p-0 bg-transparent dark:bg-transparent' : 'min-h-screen pt-[100px] pb-10 px-4 sm:px-6 lg:px-8'}`}>
      <div className={`w-full max-w-7xl flex flex-col md:flex-row gap-6 ${isEmbedded ? 'h-[75vh]' : 'h-[80vh]'}`}>
        
        {/* Left Pane: Chats */}
        <div className="flex-1 bg-white dark:bg-[#18112e] rounded-[20px] shadow-lg border border-gray-200 dark:border-purple-900/30 overflow-hidden flex flex-col relative">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] dark:from-[#6D28D9] dark:to-[#9333EA] flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center">
              {activeThread && (
                <button onClick={() => setActiveThread(null)} className="mr-3 text-white hover:bg-purple-700 dark:hover:bg-purple-900/50 p-1 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
              )}
              <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <span className="font-semibold text-white">
                {activeThread ? `Chat with ${activeThread.user?.name}` : 'Chats'}
              </span>
            </div>
          </div>

          {!activeThread ? (
            // Chat List View
            <>
              <div className="p-4 border-b border-gray-100 dark:border-purple-900/30 bg-white dark:bg-[#18112e]">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search chats..." 
                    value={searchChat}
                    onChange={(e) => setSearchChat(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#231542] border border-gray-200 dark:border-purple-900/40 rounded-xl focus:border-[#7C3AED] dark:focus:border-[#A855F7] focus:bg-white dark:focus:bg-[#1A1035] outline-none transition-all text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500" 
                  />
                  <svg className="absolute left-3.5 top-3 text-gray-400 dark:text-gray-500 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 bg-white dark:bg-[#18112e]">
                {filteredThreads.map(thread => {
                  const unreadCount = thread.messages?.filter(m => !m.read && m.sender?._id !== currentUserId && m.sender !== currentUserId).length || 0;
                  return (
                  <div 
                    key={thread._id} 
                    onClick={() => {
                      loadThread(thread);
                      if (unreadCount > 0 && socket) {
                         socket.emit('mark_read', { threadId: thread._id, userId: currentUserId });
                         setThreads(prev => prev.map(t => t._id === thread._id ? {...t, messages: t.messages.map(m => ({...m, read: true}))} : t));
                      }
                    }}
                    className="flex items-center p-3 mb-1 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors border-b border-gray-50 dark:border-purple-900/10 last:border-0 group relative"
                  >
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center text-[#7C3AED] dark:text-[#A855F7] font-bold text-lg mr-4 uppercase shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60 transition-colors">
                      {thread.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{thread.user?.name}</h3>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                          {new Date(thread.lastMessageAt || thread.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate pr-6">{thread.user?.email}</p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#F83758] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </>
          ) : (
            // Active Chat View
            <div className="flex flex-col h-full overflow-hidden bg-gray-50/50 dark:bg-transparent">

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {messages.map((msg, idx) => {
                  const isAdmin = msg.sender?.role === 'admin' || msg.sender === currentUserId;
                  
                  return (
                    <div key={idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                        isAdmin 
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
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 pl-2">Escrow Deal Issued</h4>
                        <div className="space-y-1 mb-2 bg-gray-50 dark:bg-[#231542] p-3 rounded-lg border border-gray-100 dark:border-purple-900/20 text-[13px]">
                              <p className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Status:</span> <span className={`font-semibold uppercase ${msg.dealId.status === 'accepted' ? 'text-green-600 dark:text-green-400' : msg.dealId.status === 'rejected' ? 'text-red-500 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{msg.dealId.status}</span></p>
                              {msg.dealId.payment && <p className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Payment:</span> <span className={`font-semibold uppercase ${msg.dealId.payment === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>{msg.dealId.payment}</span></p>}
                              <p className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Price:</span> <span className="font-bold text-[#7C3AED] dark:text-[#A855F7]">${msg.dealId.dealPrice || msg.dealId.price}</span></p>
                            </div>
                          </div>
                        )}
                        <span className={`text-[10px] block mt-1.5 ${isAdmin ? 'text-purple-100' : 'text-gray-400 dark:text-gray-500'}`}>
                          {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-white dark:bg-[#18112e] border-t border-gray-100 dark:border-purple-900/30">
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-[#231542] p-1.5 rounded-full border border-gray-200 dark:border-purple-900/40 focus-within:border-purple-400 dark:focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-50 dark:focus-within:ring-purple-900/20 transition-all">
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  <button onClick={() => fileInputRef.current.click()} className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#7C3AED] dark:hover:text-[#A855F7] hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  </button>
                  <input 
                    type="text"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white text-[14.5px] px-2 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Type to user..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#7C3AED] to-[#A855F7] disabled:opacity-50 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-700 hover:shadow-lg hover:shadow-purple-500/20 rounded-full text-white transition-all">
                    <svg className="w-4 h-4 transform rotate-45 -ml-0.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Pane: Deals */}
        <div className="flex-1 bg-white dark:bg-[#18112e] rounded-[20px] shadow-lg border border-gray-200 dark:border-purple-900/30 overflow-hidden flex flex-col relative">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] dark:from-[#6D28D9] dark:to-[#9333EA] flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="font-semibold text-white">Escrow Deals</span>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={openCreateModal}
                className="px-4 py-1.5 text-xs font-bold rounded-md bg-white text-[#7C3AED] hover:bg-gray-100 transition-colors shadow-sm"
              >
                + Create New Deal
              </button>
            </div>
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
                <p>No deals found</p>
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
                      <p className="mb-1">Buyer: <span className="font-medium text-gray-700 dark:text-gray-300">{deal.buyer?.name || 'Unknown'}</span></p>
                      <p className="mb-1">Payment: <span className={`font-semibold uppercase ${deal.payment === 'paid' ? 'text-green-500' : 'text-gray-500'}`}>{deal.payment || 'NOT PAID'}</span></p>
                      <p>Date: {new Date(deal.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      ${deal.dealPrice || deal.price}
                    </div>
                  </div>

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

      {/* Admin Deal Details Modal */}
      <Modal
        title={<div className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2"><svg className="w-5 h-5 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Deal Administration</div>}
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
              <p className="flex justify-between mb-1 text-sm"><span className="text-gray-500 dark:text-gray-400">Deal Price:</span> <span className="font-bold text-[#7C3AED] dark:text-[#A855F7]">${selectedDeal.dealPrice || selectedDeal.price}</span></p>
              <p className="flex justify-between mb-1 text-sm"><span className="text-gray-500 dark:text-gray-400">Buyer:</span> <span className="text-gray-800 dark:text-gray-200">{selectedDeal.buyer?.name} ({selectedDeal.buyer?.email})</span></p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">Status</h4>
              <p className="flex justify-between mb-1 text-sm"><span className="text-gray-500 dark:text-gray-400">Deal Status:</span> <span className={`font-semibold uppercase ${selectedDeal.status === 'accepted' ? 'text-green-500' : selectedDeal.status === 'rejected' ? 'text-red-500' : 'text-yellow-600'}`}>{selectedDeal.status}</span></p>
              <p className="flex justify-between mb-1 text-sm"><span className="text-gray-500 dark:text-gray-400">Payment Status:</span> <span className={`font-semibold uppercase ${selectedDeal.payment === 'paid' ? 'text-green-500' : 'text-gray-500'}`}>{selectedDeal.payment || 'NOT PAID'}</span></p>
              <p className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Created:</span> <span className="text-gray-800 dark:text-gray-200">{new Date(selectedDeal.createdAt).toLocaleString()}</span></p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/40 mt-4">
              <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-3 text-sm">Admin Controls</h4>
              <label className="block text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1.5">Override Payment Status</label>
              <select
                value={selectedDeal.payment || 'notpaid'}
                onChange={(e) => handlePaymentOverride(selectedDeal._id, e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#231542] border border-purple-200 dark:border-purple-800 rounded-lg text-sm outline-none focus:border-purple-500 transition-colors cursor-pointer"
              >
                <option value="notpaid">NOT PAID</option>
                <option value="pending">PENDING</option>
                <option value="paid">PAID</option>
              </select>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-2">Only Admins can manually update payment status. This will override the gateway.</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Deal Modal */}
      <Modal
        title={
          <div className="font-bold text-lg text-gray-900 dark:text-white">Create New Escrow Deal</div>
        }
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        destroyOnClose
        className="dark:bg-gray-800"
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleCreateDealSubmit}
          className="mt-4"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/40 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              This wizard will dispatch a deal card to both the Buyer's and Seller's chat threads.
            </p>
          </div>

          <Form.Item 
            name="sellerId" 
            label={<span className="text-gray-700 dark:text-gray-300 font-semibold">1. Select Seller</span>}
            rules={[{ required: true, message: 'Please select a seller' }]}
          >
            <Select 
              showSearch
              placeholder="Search and select seller..."
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={users.map(u => ({ value: u._id, label: `${u.name} (${u.email})` }))}
              onChange={() => {
                form.setFieldsValue({ channelId: undefined, dealPrice: undefined });
              }}
              className="w-full"
            />
          </Form.Item>

          <Form.Item 
            name="channelId" 
            label={<span className="text-gray-700 dark:text-gray-300 font-semibold">2. Select Channel</span>}
            rules={[{ required: true, message: 'Please select a channel' }]}
            tooltip="Only channels owned by the selected Seller are shown."
          >
            <Select 
              showSearch
              placeholder="Search and select channel..."
              disabled={!selectedSellerId}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={channels.map(c => ({ value: c._id, label: `${c.name} - $${c.price}` }))}
              onChange={handleChannelChange}
              className="w-full"
            />
          </Form.Item>

          <Form.Item 
            name="buyerId" 
            label={<span className="text-gray-700 dark:text-gray-300 font-semibold">3. Select Buyer</span>}
            rules={[{ required: true, message: 'Please select a buyer' }]}
          >
            <Select 
              showSearch
              placeholder="Search and select buyer..."
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={users.filter(u => u._id !== selectedSellerId).map(u => ({ value: u._id, label: `${u.name} (${u.email})` }))}
              className="w-full"
            />
          </Form.Item>

          <Form.Item 
            name="dealPrice" 
            label={<span className="text-gray-700 dark:text-gray-300 font-semibold">4. Negotiated Deal Price ($)</span>}
            rules={[{ required: true, message: 'Please enter the deal price' }]}
          >
            <InputNumber 
              className="w-full"
              placeholder="0.00"
              prefix="$"
              min={0}
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white py-3.5 rounded-xl font-bold transition shadow-md shadow-purple-500/20 text-sm"
            >
              Dispatch Escrow Deal
            </button>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default AdminChat;
