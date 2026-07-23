import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Youtube, Plus, Users, Eye, Video, IndianRupee,
  Globe, Clock, BadgeCheck, TrendingUp, ExternalLink,
  AlertCircle, Loader2, CheckCircle, XCircle, Timer, Edit, Trash2
} from 'lucide-react';
import axiosInstance, { api } from '../../API/api';

const statusConfig = {
  Available:  { color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-550/10 dark:bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle, label: 'Available' },
  approved:   { color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-550/10 dark:bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle, label: 'Approved' },
  sold:       { color: 'text-red-500 dark:text-red-400',     bg: 'bg-red-550/10 dark:bg-red-500/10',     border: 'border-red-500/30',     icon: XCircle,     label: 'Sold' },
  unsold:     { color: 'text-amber-500 dark:text-amber-400',   bg: 'bg-amber-550/10 dark:bg-amber-500/10',   border: 'border-amber-500/30',   icon: Timer,       label: 'Pending' },
  pending:    { color: 'text-amber-500 dark:text-amber-400',   bg: 'bg-amber-550/10 dark:bg-amber-500/10',   border: 'border-amber-500/30',   icon: Timer,       label: 'Under Review' },
};

const fmt = (n) => {
  if (!n && n !== 0) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
};

const MyChannels = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchChannels(); }, []);

  const fetchChannels = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get(`${api}/my-channels`);
      setChannels(res.data?.data?.channels || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your channels.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?\nThis action cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`${api}/channels/${id}`);
      setChannels(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete channel.');
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <div className="w-full text-slate-800 dark:text-white transition-colors duration-200">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center text-white shrink-0">
            <Youtube size={20} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white m-0 tracking-tight">My Channels</h2>
            <p className="text-xs text-slate-500 dark:text-white/40 m-0">{channels.length} channel{channels.length !== 1 ? 's' : ''} listed</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/user/upload-channel')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> List New Channel
        </motion.button>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500 dark:text-white/40">
          <Loader2 size={34} className="animate-spin text-purple-500" />
          <p className="text-sm">Loading your channels…</p>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-655 dark:text-red-300 text-sm mb-4">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={fetchChannels}
            className="bg-red-500/20 border border-red-500/40 rounded-lg px-2.5 py-1 text-xs text-red-600 dark:text-red-300 hover:bg-red-500/30 transition-colors"
          >Retry</button>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && channels.length === 0 && (
        <motion.div
          className="flex flex-col items-center text-center py-16 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-18 h-18 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 dark:text-purple-400 mb-2 p-5">
            <Youtube size={36} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white m-0">No channels listed yet</h3>
          <p className="text-sm text-slate-500 dark:text-white/40 max-w-xs leading-relaxed m-0">
            List your first YouTube channel and reach thousands of buyers on SocialSwap.
          </p>
          <button
            onClick={() => navigate('/user/upload-channel')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity mt-2"
          >
            <Plus size={15} /> List Your First Channel
          </button>
        </motion.div>
      )}

      {/* ── Channel Grid ── */}
      {!loading && !error && channels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {channels.map((ch, i) => {
              const statusKey = ch.status || 'unsold';
              const status = statusConfig[statusKey] || statusConfig.unsold;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={ch._id}
                  onClick={() => navigate(`/channel/${ch._id}`)}
                  className="group relative bg-[#0f0a1c] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/20 transition-all flex flex-col h-full shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  {/* Banner */}
                  <div className="relative h-28 bg-gradient-to-br from-[#1a0f2e] to-[#2d1b5e] overflow-hidden">
                    {ch.bannerUrl
                      ? <img src={ch.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-white/10"><Youtube size={28} /></div>
                    }
                    {/* Status Badge */}
                    <div className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border backdrop-blur-sm ${status.color} ${status.bg} ${status.border}`}>
                      <StatusIcon size={10} />{status.label}
                    </div>
                    {/* Price Badge */}
                    {ch.price && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-sm text-white text-[0.65rem] font-bold">
                        <IndianRupee size={10} />{ch.price}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col gap-3.5">
                    {/* Title row */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-purple-400 shrink-0 overflow-hidden">
                        {ch.avatar ? <img src={ch.avatar} alt={ch.name} className="w-full h-full object-cover" /> : <Youtube size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white m-0 truncate">{ch.name}</h4>
                        <span className="text-[0.7rem] text-slate-500 dark:text-white/35">{ch.customUrl}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {ch.channelLink && (
                          <a
                            href={ch.channelLink} target="_blank" rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-500 dark:text-white/35 hover:bg-purple-500/20 hover:text-purple-400 transition-all shrink-0"
                            title="Visit Channel"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/edit-channel/${ch._id}`); }}
                          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-500 dark:text-white/35 hover:bg-blue-500/20 hover:text-blue-400 transition-all shrink-0"
                          title="Edit Channel"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(ch._id, ch.name); }}
                          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-500 dark:text-white/35 hover:bg-red-500/20 hover:text-red-400 transition-all shrink-0"
                          title="Delete Channel"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {ch.category && (
                        <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-semibold bg-purple-500/10 dark:bg-purple-500/15 text-purple-650 dark:text-purple-300 border border-purple-500/20">{ch.category}</span>
                      )}
                      {ch.channelType && (
                        <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-semibold bg-blue-500/10 dark:bg-blue-500/12 text-blue-650 dark:text-blue-300 border border-blue-500/20">{ch.channelType}</span>
                      )}
                      {ch.monetized && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.65rem] font-semibold bg-emerald-500/10 dark:bg-emerald-500/12 text-emerald-650 dark:text-emerald-300 border border-emerald-500/20">
                          <BadgeCheck size={9} /> Monetized
                        </span>
                      )}
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-white/[0.03] rounded-xl p-2.5 border border-slate-100 dark:border-white/[0.06]">
                      <StatCell icon={<Users size={11} />} label="Subs" value={fmt(ch.subscriberCount)} />
                      <StatCell icon={<Eye size={11} />} label="Views" value={fmt(ch.viewCount)} />
                      <StatCell icon={<Video size={11} />} label="Videos" value={fmt(ch.videoCount)} />
                      <StatCell icon={<IndianRupee size={11} />} label="Earnings" value={ch.estimatedEarnings ? `₹${fmt(ch.estimatedEarnings)}` : '—'} />
                      <StatCell icon={<TrendingUp size={11} />} label="Recent" value={fmt(ch.recentViews)} />
                      <StatCell icon={<Clock size={11} />} label="Hrs" value={fmt(ch.watchTimeHours)} />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-3 flex-wrap pt-1 border-t border-slate-100 dark:border-white/[0.05]">
                      {ch.country && (
                        <span className="flex items-center gap-1 text-[0.68rem] text-slate-400 dark:text-white/30">
                          <Globe size={11} /> {ch.country}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[0.68rem] text-slate-400 dark:text-white/30">
                        <Clock size={11} /> {formatDate(ch.createdAt)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

function StatCell({ icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-400 dark:text-white/30 shrink-0">{icon}</span>
      <div>
        <span className="block text-[0.75rem] font-bold text-slate-800 dark:text-white leading-tight">{value}</span>
        <span className="block text-[0.6rem] text-slate-400 dark:text-white/30 leading-tight">{label}</span>
      </div>
    </div>
  );
}

export default MyChannels;