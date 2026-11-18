import React, { useState } from 'react';
import axiosInstance, { api } from '../../API/api';

// Shown in place of the message box until the buyer gives a number,
// so support can call them when a chat reply goes unseen.
const ChatPhonePrompt = ({ onSaved }) => {
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async (e) => {
    e.preventDefault();
    if (!phone.trim() || saving) return;
    setSaving(true);
    setError('');
    try {
      const res = await axiosInstance.put(`${api}/chat/phone`, { phone });
      if (res.data?.success) onSaved(res.data.mobile);
      else setError(res.data?.message || 'Could not save the number.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the number. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-bold text-gray-900 dark:text-white">Add your mobile number to chat</p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
          Our team will call you here if you miss a reply. We only use it for your enquiry.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-gray-50 dark:bg-[#231542] rounded-full border border-gray-200 dark:border-purple-900/40 focus-within:border-purple-400 dark:focus-within:border-purple-600 px-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 pr-2 border-r border-gray-200 dark:border-purple-900/40">+91</span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={16}
            className="flex-1 min-w-0 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white text-[14.5px] px-2 py-2.5 outline-none placeholder-gray-500"
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d+\-\s]/g, ''))}
            aria-label="Mobile number"
          />
        </div>
        <button
          type="submit"
          disabled={!phone.trim() || saving}
          className="shrink-0 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-sm font-bold disabled:opacity-50 transition-opacity"
        >
          {saving ? 'Saving…' : 'Continue'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
};

export default ChatPhonePrompt;
