import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Youtube, Link, Tag, FileText, DollarSign,
  Users, Video, TrendingUp, Eye, Globe,
  Languages, Clock, Shield, BadgeCheck,
  Image as ImageIcon, ChevronRight, ChevronLeft,
  CheckCircle, AlertCircle, Upload, X, Loader2,
  Sparkles, Zap
} from 'lucide-react';
import axiosInstance, { api } from '../../API/api';
import { compressAndConvertToWebP } from '../../Utils/imageHelper';

const CATEGORY_OPTIONS = [
  'Gaming', 'Tech', 'Finance', 'Artificial intelligence',
  'Business & Entrepreneurship', 'Education', 'Health & Fitness',
  'Food', 'Infotainment', 'Vlogging', 'Sports', 'Commentary',
  'Entertainment', 'Music', 'Motivation & Self-Improvement'
];

const formatCompact = (num) => {
  if (!num) return '0';
  return Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
};

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Brazil', 'Pakistan', 'Bangladesh', 'Nigeria',
  'Philippines', 'Indonesia', 'Mexico', 'South Africa', 'Other'
];

const LANGUAGES = [
  'English', 'Hindi', 'Spanish', 'French', 'Arabic', 'Portuguese',
  'Bengali', 'Russian', 'Urdu', 'German', 'Japanese', 'Korean',
  'Tamil', 'Telugu', 'Marathi', 'Punjabi', 'Other'
];

const steps = [
  { id: 0, label: 'Basic Info', icon: Youtube },
  { id: 1, label: 'Stats', icon: TrendingUp },
  { id: 2, label: 'Details', icon: Shield },
  { id: 3, label: 'Media', icon: ImageIcon },
];

const initialForm = {
  name: '', channelLink: '', customUrl: '', category: '',
  channelType: '', description: '', price: '',
  subscriberCount: '', viewCount: '', videoCount: '',
  estimatedEarnings: '', averageViewsPerVideo: '', recentViews: '',
  watchTimeHours: '', country: '', joinedDate: '', my_language: '',
  copyrightStrike: '0', communityStrike: '0', monetized: false,
  organicGrowth: false, userEmail: '', contactNumber: '', avatar: '', sold: false
};

export default function UploadChannel() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [banner, setBanner] = useState(null);
  const [images, setImages] = useState([]);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      fetchChannelDetails();
    }
  }, [id]);

  const fetchChannelDetails = async () => {
    try {
      const res = await axiosInstance.get(`${api}/channels/${id}`);
      const data = res.data;
      
      setForm({
        ...initialForm,
        name: data.name || '',
        channelLink: data.channelLink || '',
        customUrl: data.customUrl || '',
        category: data.category || '',
        channelType: data.channelType || '',
        description: data.description || '',
        price: data.price || '',
        subscriberCount: data.subscriberCount || '',
        viewCount: data.viewCount || '',
        videoCount: data.videoCount || '',
        estimatedEarnings: data.estimatedEarnings || '',
        averageViewsPerVideo: data.averageViewsPerVideo || '',
        recentViews: data.recentViews || '',
        watchTimeHours: data.watchTimeHours || '',
        country: data.country || '',
        joinedDate: data.joinedDate ? new Date(data.joinedDate).toISOString().split('T')[0] : '',
        my_language: data.my_language || '',
        copyrightStrike: data.copyrightStrike || '0',
        communityStrike: data.communityStrike || '0',
        monetized: data.monetized || false,
        organicGrowth: data.organicGrowth || false,
        userEmail: data.contactInfo?.email || '',
        contactNumber: data.contactInfo?.phone || '',
        avatar: data.avatar || '',
        sold: data.sold || false
      });

      if (data.bannerUrl) {
        setBannerPreview(data.bannerUrl);
      }
      if (data.imageUrls) {
        setExistingImages(data.imageUrls);
        setImagePreviews(data.imageUrls);
      }
    } catch (err) {
      setError('Failed to fetch channel details for editing.');
    }
  };

  // ── YouTube Auto-fill State ──────────────────────────────────
  const [fetchInput, setFetchInput] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [fetchedChannel, setFetchedChannel] = useState(null); // preview card data

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  // ── YouTube Auto-fill Handler ────────────────────────────────
  const fetchChannelInfo = async () => {
    if (!fetchInput.trim()) {
      setFetchError('Please enter a YouTube channel link, ID, or handle.');
      return;
    }
    setFetchLoading(true);
    setFetchError('');
    setFetchedChannel(null);
    try {
      const res = await axiosInstance.get(`${api}/youtube/channel-info`, {
        params: { input: fetchInput.trim() }
      });
      const data = res.data.data;
      setFetchedChannel(data);

      // Auto-fill only fields that came back non-empty
      setForm(prev => ({
        ...prev,
        ...(data.name            && { name: data.name }),
        ...(data.description     && { description: data.description }),
        ...(data.customUrl       && { customUrl: data.customUrl }),
        ...(data.channelLink     && { channelLink: data.channelLink }),
        ...(data.country         && { country: data.country }),
        ...(data.my_language     && { my_language: data.my_language }),
        ...(data.joinedDate      && { joinedDate: data.joinedDate }),
        ...(data.subscriberCount && { subscriberCount: data.subscriberCount }),
        ...(data.viewCount       && { viewCount: data.viewCount }),
        ...(data.videoCount      && { videoCount: data.videoCount }),
        ...(data.averageViewsPerVideo && { averageViewsPerVideo: data.averageViewsPerVideo }),
        ...(data.avatar          && { avatar: data.avatar }),
      }));
    } catch (err) {
      setFetchError(err.response?.data?.message || 'Could not fetch channel info. Check the link and try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const clearFetch = () => {
    setFetchedChannel(null);
    setFetchInput('');
    setFetchError('');
  };

  const handleBanner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const webpFile = await compressAndConvertToWebP(file, 0.8);
      setBanner(webpFile);
      setBannerPreview(URL.createObjectURL(webpFile));
    } catch (err) {
      console.error('Error compressing banner:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    const totalCount = existingImages.length + images.length + files.length;
    if (totalCount > 4) {
      setError('Maximum 4 channel screenshots allowed');
      return;
    }
    setLoading(true);
    try {
      const webpFiles = await Promise.all(files.map(file => compressAndConvertToWebP(file, 0.8)));
      setImages(prev => [...prev, ...webpFiles]);
      setImagePreviews(prev => [...prev, ...webpFiles.map(f => URL.createObjectURL(f))]);
    } catch (err) {
      console.error('Error compressing screenshots:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (idx) => {
    if (idx < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== idx));
    } else {
      const newFileIdx = idx - existingImages.length;
      setImages(prev => prev.filter((_, i) => i !== newFileIdx));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const validateStep = () => {
    const errors = {};
    if (step === 0) {
      if (!form.name.trim()) errors.name = 'Channel name is required';
      if (!form.channelLink.trim()) errors.channelLink = 'Channel link is required';
      if (!form.customUrl.trim()) errors.customUrl = 'Custom URL / Handle is required';
      if (!form.description.trim()) errors.description = 'Description is required';
      
      if (!form.subscriberCount) errors.subscriberCount = 'This field is required';
      if (!form.viewCount) errors.viewCount = 'This field is required';
      if (!form.videoCount) errors.videoCount = 'This field is required';
      if (!form.averageViewsPerVideo) errors.averageViewsPerVideo = 'This field is required';
      if (!form.joinedDate) errors.joinedDate = 'Joined date is required';
    }
    if (step === 1) {
      if (!form.price.trim()) errors.price = 'Price is required';
      if (!form.category) errors.category = 'Category is required';
      if (!form.channelType) errors.channelType = 'Channel type is required';
      if (!form.country) errors.country = 'Country is required';
      if (!form.my_language) errors.my_language = 'Language is required';

      ['estimatedEarnings', 'recentViews', 'watchTimeHours'].forEach(f => {
        if (!form[f]) errors[f] = 'This field is required';
      });
    }
    if (step === 2) {
      if (!form.userEmail.trim()) errors.userEmail = 'Contact email is required';
      if (!form.contactNumber.trim()) errors.contactNumber = 'Contact number is required';
    }
    if (step === 3) {
      if (!banner && !bannerPreview) errors.banner = 'Banner image is required';
      const totalScreenshots = existingImages.length + images.length;
      if (totalScreenshots < 2) errors.images = 'At least 2 channel screenshots required';
      if (totalScreenshots > 4) errors.images = 'Maximum 4 channel screenshots allowed';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => Math.min(s + 1, 3)); };
  const prevStep = () => { setStep(s => Math.max(s - 1, 0)); setFieldErrors({}); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError('');
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, typeof v === 'boolean' ? String(v) : v));
    
    if (banner) {
      formData.append('banner', banner);
    }
    images.forEach(img => {
      formData.append('images', img);
    });
    if (isEditMode) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }

    try {
      if (isEditMode) {
        await axiosInstance.put(`${api}/channels/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axiosInstance.post(`${api}/channels`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload channel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d0b1a] flex items-center justify-center px-5 pt-24">
        <motion.div
          className="bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-10 text-center max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5 text-emerald-400">
            <CheckCircle size={44} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
            {isEditMode ? 'Channel Updated!' : 'Channel Listed!'}
          </h2>
          <p className="text-gray-500 dark:text-white/50 leading-relaxed mb-8 text-sm">
            {isEditMode ? 'Your channel details have been successfully updated.' : 'Your channel has been submitted for review. Our team will verify it within 24–48 hours.'}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate('/user/my-channels')}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              View My Channels
            </button>
            {!isEditMode && (
              <button
                onClick={() => { setSuccess(false); setStep(0); setForm(initialForm); setBanner(null); setImages([]); setBannerPreview(null); setImagePreviews([]); }}
                className="px-5 py-2.5 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 font-medium rounded-xl text-sm hover:bg-gray-200 dark:bg-white/10 transition-colors"
              >
                List Another
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0b1a] flex items-start justify-center px-5 pt-24 pb-12">
      <div className="w-full max-w-3xl flex flex-col gap-7">

        {/* ── Page Header ── */}
        <motion.div className="flex items-center gap-4" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center text-white flex-shrink-0 p-3">
            <Youtube size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight m-0">
              {isEditMode ? 'Edit Your Channel' : 'List Your Channel'}
            </h1>
            <p className="text-gray-500 dark:text-white/40 text-sm m-0">
              {isEditMode ? 'Update your YouTube channel details' : 'Fill in your YouTube channel details to list it for sale'}
            </p>
          </div>
        </motion.div>

        {/* ── Step Progress ── */}
        <div className="flex items-center">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isDone ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : isActive ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                    : 'border-gray-200 dark:border-white/15 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/30'
                  }`}>
                    {isDone ? <CheckCircle size={15} /> : <Icon size={15} />}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block transition-colors duration-300 ${
                    isDone ? 'text-emerald-400' : isActive ? 'text-purple-400' : 'text-gray-400 dark:text-white/30'
                  }`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 transition-all duration-500 ${isDone ? 'bg-emerald-500/40' : 'bg-gray-200 dark:bg-white/10'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Form Card ── */}
        <motion.div
          key={step}
          className="bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none backdrop-blur-2xl border border-gray-200 dark:border-white/[0.08] rounded-2xl p-8"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-300 text-sm mb-6">
              <AlertCircle size={15} className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError('')} className="text-red-300 hover:text-gray-900 dark:text-white"><X size={14} /></button>
            </div>
          )}

          {/* ── Step 0: Basic Info ── */}
          {step === 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-5">
                <Youtube size={17} className="text-purple-400" /> Basic Information
              </h3>

              {/* ── Auto-fill from YouTube Widget ── */}
              <div className="mb-6 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/[0.08] to-fuchsia-500/[0.04] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={15} className="text-purple-400" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Auto-fill from YouTube</span>
                  <span className="ml-auto text-[0.65rem] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/25 font-semibold">SMART FILL</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-white/40 mb-3 leading-relaxed">
                  Paste your YouTube channel link, Channel ID, or @handle and we'll auto-fill the form for you.
                </p>

                {/* Input Row */}
                <div className="flex gap-2">
                  <input
                    value={fetchInput}
                    onChange={e => { setFetchInput(e.target.value); setFetchError(''); }}
                    onKeyDown={e => e.key === 'Enter' && fetchChannelInfo()}
                    placeholder="https://youtube.com/@channel  ·  UCxxxxxx  ·  @handle"
                    className="flex-1 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none focus:border-purple-500 focus:bg-purple-500/[0.08] transition-all"
                  />
                  <button
                    onClick={fetchChannelInfo}
                    disabled={fetchLoading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shrink-0"
                  >
                    {fetchLoading
                      ? <><Loader2 size={14} className="animate-spin" /> Fetching…</>
                      : <><Zap size={14} /> Fetch Info</>
                    }
                  </button>
                </div>

                {/* Fetch Error */}
                {fetchError && (
                  <div className="flex items-center gap-2 mt-2.5 text-red-300 text-xs">
                    <AlertCircle size={13} />{fetchError}
                  </div>
                )}

                {/* Fetched Channel Preview Card */}
                {fetchedChannel && (
                  <motion.div
                    className="mt-6 relative bg-[#0f0f0f] border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 overflow-hidden"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Header Layout */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10">
                      {/* Avatar */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-white/10 shadow-xl bg-black">
                        {fetchedChannel.avatar ? (
                          <img src={fetchedChannel.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-purple-500/20 text-purple-400">
                            <Youtube size={40} />
                          </div>
                        )}
                      </div>
                      
                      {/* Info & Subscribe */}
                      <div className="flex-1 flex flex-col sm:flex-row gap-4 justify-between min-w-0 text-center sm:text-left w-full">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                            {fetchedChannel.name}
                          </h2>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-[0.85rem] text-gray-600 dark:text-white/60 mb-2.5">
                            <span className="font-medium text-gray-900 dark:text-white">{fetchedChannel.customUrl || '@channel'}</span>
                            <span className="text-gray-400 dark:text-white/30">•</span>
                            <span>{formatCompact(fetchedChannel.subscriberCount)} subscribers</span>
                            <span className="text-gray-400 dark:text-white/30">•</span>
                            <span>{formatCompact(fetchedChannel.videoCount)} videos</span>
                          </div>
                          
                          <p className="text-[0.8rem] text-gray-500 dark:text-white/50 line-clamp-2 mb-3 leading-relaxed max-w-xl">
                            {fetchedChannel.description || 'No description available for this channel.'}
                          </p>

                          {fetchedChannel.channelLink && (
                            <a href={fetchedChannel.channelLink} target="_blank" rel="noreferrer" className="inline-block text-[0.8rem] font-medium text-blue-400 hover:text-blue-300 transition-colors">
                              {fetchedChannel.channelLink.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          )}
                        </div>

                        {/* Static Subscribe Button */}
                        <div className="shrink-0 flex justify-center sm:justify-end mt-2 sm:mt-0">
                          <div className="px-4 py-1.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-gray-200 transition-colors cursor-default">
                            Subscribe
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Monetization & Earnings Badge (reads from form state) */}
                    {(form.monetized || form.estimatedEarnings) && (
                      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-white/10 flex flex-wrap items-center justify-center sm:justify-start gap-2 relative z-10">
                        {form.monetized && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[0.7rem] font-bold tracking-wide uppercase">
                            <BadgeCheck size={13} /> Monetized
                          </span>
                        )}
                        {form.estimatedEarnings && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[0.7rem] font-bold tracking-wide uppercase">
                            <DollarSign size={13} /> Earnings: ${form.estimatedEarnings}/mo
                          </span>
                        )}
                      </div>
                    )}
                    
                    <button onClick={clearFetch} className="absolute top-3 right-3 text-gray-400 dark:text-white/20 hover:text-gray-900 dark:text-white transition-colors z-20 bg-black/50 p-1.5 rounded-full" title="Clear">
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* ── Manual Fields ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Channel Name" icon={<Youtube size={13} />} error={fieldErrors.name}>
                  <input name="name" placeholder="e.g. TechWorld India" value={form.name} onChange={handleChange} />
                </Field>
                <Field label="YouTube Channel Link" icon={<Link size={13} />} error={fieldErrors.channelLink}>
                  <input name="channelLink" placeholder="https://youtube.com/@yourhandle" value={form.channelLink} onChange={handleChange} />
                </Field>
                <Field label="Channel Handle / Custom URL" icon={<Tag size={13} />} error={fieldErrors.customUrl}>
                  <input name="customUrl" placeholder="@yourhandle or /c/yourname" value={form.customUrl} onChange={handleChange} />
                </Field>
                <Field label="Channel Joined Date" icon={<Clock size={13} />} error={fieldErrors.joinedDate}>
                  <input name="joinedDate" type="date" value={form.joinedDate} onChange={handleChange} />
                </Field>
                
                <Field label="Subscriber Count" icon={<Users size={13} />} error={fieldErrors.subscriberCount}>
                  <input name="subscriberCount" type="number" placeholder="e.g. 150000" value={form.subscriberCount} onChange={handleChange} />
                </Field>
                <Field label="Total View Count" icon={<Eye size={13} />} error={fieldErrors.viewCount}>
                  <input name="viewCount" type="number" placeholder="e.g. 5000000" value={form.viewCount} onChange={handleChange} />
                </Field>
                <Field label="Video Count" icon={<Video size={13} />} error={fieldErrors.videoCount}>
                  <input name="videoCount" type="number" placeholder="e.g. 320" value={form.videoCount} onChange={handleChange} />
                </Field>
                <Field label="Avg Views Per Video" icon={<Eye size={13} />} error={fieldErrors.averageViewsPerVideo}>
                  <input name="averageViewsPerVideo" type="number" placeholder="e.g. 15000" value={form.averageViewsPerVideo} onChange={handleChange} />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Description" icon={<FileText size={13} />} error={fieldErrors.description}>
                    <textarea name="description" rows={4} placeholder="Describe your channel, its niche, content style, and audience..." value={form.description} onChange={handleChange} />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Stats ── */}
          {step === 1 && (
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-6">
                <TrendingUp size={17} className="text-purple-400" /> Stats & Pricing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={<span>Asking Price <span className="normal-case text-gray-500 dark:text-white/50 ml-1 font-normal tracking-normal">(Write your Selling price in Dollar)</span></span>} icon={<DollarSign size={13} />} error={fieldErrors.price}>
                  <input name="price" type="number" placeholder="e.g. 50000" value={form.price} onChange={handleChange} />
                </Field>
                <Field label="Category" icon={<Tag size={13} />} error={fieldErrors.category}>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Channel Type" icon={<Video size={13} />} error={fieldErrors.channelType}>
                  <select name="channelType" value={form.channelType} onChange={handleChange}>
                    <option value="">Select type</option>
                    <option value="Long Videos">Long Videos</option>
                    <option value="Short Videos">Short Videos</option>
                    <option value="Both Long & Short Videos">Both Long & Short Videos</option>
                  </select>
                </Field>
                <Field label="Country" icon={<Globe size={13} />} error={fieldErrors.country}>
                  <select name="country" value={form.country} onChange={handleChange}>
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Channel Language" icon={<Languages size={13} />} error={fieldErrors.my_language}>
                  <select name="my_language" value={form.my_language} onChange={handleChange}>
                    <option value="">Select language</option>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Estimated Monthly Earnings ($)" icon={<DollarSign size={13} />} error={fieldErrors.estimatedEarnings}>
                  <input name="estimatedEarnings" type="number" placeholder="e.g. 500" value={form.estimatedEarnings} onChange={handleChange} />
                </Field>
                <Field label="Recent Views (Last 48 Hours)" icon={<TrendingUp size={13} />} error={fieldErrors.recentViews}>
                  <input name="recentViews" type="number" placeholder="e.g. 80000" value={form.recentViews} onChange={handleChange} />
                </Field>
                <Field label="Total Watch Time Hours" icon={<Clock size={13} />} error={fieldErrors.watchTimeHours}>
                  <input name="watchTimeHours" type="number" placeholder="e.g. 200000" value={form.watchTimeHours} onChange={handleChange} />
                </Field>
              </div>
            </div>
          )}

          {/* ── Step 2: Details ── */}
          {step === 2 && (
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-6">
                <Shield size={17} className="text-purple-400" /> Channel Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Copyright Strikes" icon={<Shield size={13} />} error={fieldErrors.copyrightStrike}>
                  <select name="copyrightStrike" value={form.copyrightStrike} onChange={handleChange}>
                    <option value="0">0 Strikes</option>
                    <option value="1">1 Strike</option>
                    <option value="2">2 Strikes</option>
                  </select>
                </Field>
                <Field label="Community Strikes" icon={<Shield size={13} />} error={fieldErrors.communityStrike}>
                  <select name="communityStrike" value={form.communityStrike} onChange={handleChange}>
                    <option value="0">0 Strikes</option>
                    <option value="1">1 Strike</option>
                    <option value="2">2 Strikes</option>
                  </select>
                </Field>
                <Field label="Contact Email" icon={<BadgeCheck size={13} />} error={fieldErrors.userEmail}>
                  <input name="userEmail" type="email" placeholder="your@email.com" value={form.userEmail} onChange={handleChange} />
                </Field>
                <Field label="Contact Number" icon={<BadgeCheck size={13} />} error={fieldErrors.contactNumber}>
                  <input name="contactNumber" placeholder="+91 9999999999" value={form.contactNumber} onChange={handleChange} />
                </Field>
              </div>
              {/* Toggles */}
              <div className="mt-5 flex flex-col gap-3">
                <Toggle label="Monetized (YouTube Partner Program)" name="monetized" checked={form.monetized} onChange={handleChange} />
                <Toggle label="Organic Growth (No paid subscribers)" name="organicGrowth" checked={form.organicGrowth} onChange={handleChange} />
                {isEditMode && (
                  <Toggle label="Mark as Sold (Hide from public listings)" name="sold" checked={form.sold} onChange={handleChange} />
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Media ── */}
          {step === 3 && (
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-6">
                <ImageIcon size={17} className="text-purple-400" /> Channel Media
              </h3>
              
              {isEditMode && (
                <div className="bg-purple-500/10 border border-purple-500/20 text-purple-300 p-4 rounded-xl text-sm flex items-start gap-3 mb-6">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p>You can edit your channel media here. Existing images are shown below; you can delete them or upload new ones.</p>
                </div>
              )}

              {/* Banner Upload */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-500 dark:text-white/50 mb-2">
                      Banner / Thumbnail <span className="font-normal text-gray-400 dark:text-white/30">(1 image required)</span>
                    </p>
                    {bannerPreview ? (
                      <div className="relative rounded-xl overflow-hidden h-40">
                        <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                        <button
                          onClick={() => { setBanner(null); setBannerPreview(null); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white transition-colors"
                        ><X size={14} /></button>
                      </div>
                    ) : (
                      <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all
                        ${fieldErrors.banner ? 'border-red-500/40' : 'border-gray-300 dark:border-white/[0.12] hover:border-purple-500 hover:bg-purple-500/[0.06]'}
                        text-gray-400 dark:text-white/30 hover:text-purple-400`}>
                        <Upload size={30} />
                        <span className="text-sm font-medium">Click to upload banner image</span>
                        <span className="text-xs">PNG, JPG up to 10MB</span>
                        <input type="file" accept="image/*" onChange={handleBanner} className="hidden" />
                      </label>
                    )}
                    {fieldErrors.banner && <p className="text-red-400 text-xs mt-1">{fieldErrors.banner}</p>}
                  </div>

                  {/* Channel Screenshots */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-white/50 mb-2">
                      Channel Screenshots <span className="font-normal text-gray-400 dark:text-white/30">(2–4 images required)</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-white/5">
                          <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white transition-colors"
                          ><X size={12} /></button>
                        </div>
                      ))}
                      {(existingImages.length + images.length) < 4 && (
                        <label className={`flex flex-col items-center justify-center gap-1.5 aspect-video border-2 border-dashed rounded-xl cursor-pointer transition-all text-xs font-medium
                          ${fieldErrors.images ? 'border-red-500/40 text-red-400' : 'border-gray-300 dark:border-white/[0.12] hover:border-purple-500 hover:bg-purple-500/[0.06] text-gray-400 dark:text-white/30 hover:text-purple-400'}`}>
                          <Upload size={18} />
                          <span>Add Image</span>
                          <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
                        </label>
                      )}
                    </div>
                    {fieldErrors.images && <p className="text-red-400 text-xs mt-1">{fieldErrors.images}</p>}
                  </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/[0.06]">
            {step > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 font-medium rounded-xl text-sm hover:bg-gray-200 dark:bg-white/10 transition-colors"
              >
                <ChevronLeft size={15} /> Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
              >
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> Submitting...</>
                  : <><CheckCircle size={15} /> Submit Channel</>
                }
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Reusable Field Component ────────────────────────────────────
function Field({ label, icon, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wide">
        <span className="text-gray-400 dark:text-white/35">{icon}</span>{label}
      </label>
      <div className={`[&_input]:w-full [&_select]:w-full [&_textarea]:w-full
        [&_input]:bg-white/[0.05] [&_select]:bg-white/[0.05] [&_textarea]:bg-white/[0.05]
        [&_input]:border [&_select]:border [&_textarea]:border
        ${error
          ? '[&_input]:border-red-500/40 [&_select]:border-red-500/40 [&_textarea]:border-red-500/40'
          : '[&_input]:border-gray-200 dark:border-white/10 [&_select]:border-gray-200 dark:border-white/10 [&_textarea]:border-gray-200 dark:border-white/10'
        }
        [&_input]:rounded-xl [&_select]:rounded-xl [&_textarea]:rounded-xl
        [&_input]:px-3.5 [&_select]:px-3.5 [&_textarea]:px-3.5
        [&_input]:py-2.5 [&_select]:py-2.5 [&_textarea]:py-2.5
        [&_input]:text-sm [&_select]:text-sm [&_textarea]:text-sm
        [&_input]:text-gray-900 dark:text-white [&_select]:text-gray-900 dark:text-white [&_textarea]:text-gray-900 dark:text-white
        [&_input]:outline-none [&_select]:outline-none [&_textarea]:outline-none
        [&_input]:transition-all [&_select]:transition-all [&_textarea]:transition-all
        [&_input:focus]:border-purple-500 [&_select:focus]:border-purple-500 [&_textarea:focus]:border-purple-500
        [&_input:focus]:bg-purple-500/[0.08] [&_select:focus]:bg-purple-500/[0.08] [&_textarea:focus]:bg-purple-500/[0.08]
        [&_select_option]:bg-[#1a1330] [&_textarea]:resize-y [&_input[type=date]]:color-scheme-dark`}>
        {children}
      </div>
      {error && <p className="text-red-400 text-[0.7rem]">{error}</p>}
    </div>
  );
}

// ── Toggle Component ─────────────────────────────────────────────
function Toggle({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <div
        className={`relative w-11 h-6 rounded-full border transition-all duration-300 shrink-0 ${
          checked ? 'bg-purple-600 border-purple-500' : 'bg-gray-200 dark:bg-white/10 border-gray-200 dark:border-white/15'
        }`}
        onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked } })}
      >
        <div className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm text-gray-600 dark:text-white/60 group-hover:text-gray-700 dark:text-white/80 transition-colors font-medium">{label}</span>
    </label>
  );
}
