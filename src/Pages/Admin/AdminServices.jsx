import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance, { api } from '../../API/api';
import { compressAndConvertToWebP } from '../../Utils/imageHelper';
import { message, Modal, Popconfirm } from 'antd';

const initialForm = {
  serviceName: '',
  category: '',
  price: '',
  description: '',
  faq: [],
  sortOrder: 0,
  isActive: true,
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [newImages, setNewImages] = useState([]);       // File[] — newly picked webp files
  const [newPreviews, setNewPreviews] = useState([]);   // string[] — object URLs for preview
  const [existingImages, setExistingImages] = useState([]); // string[] — already saved URLs
  const [removedImages, setRemovedImages] = useState([]); // string[] — URLs to delete from R2
  const [submitting, setSubmitting] = useState(false);
  const [slugPreview, setSlugPreview] = useState('');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${api}/admin/services`);
      if (res.data.success) setServices(res.data.services);
    } catch { message.error('Failed to fetch services'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // Auto-preview slug as user types
  useEffect(() => {
    const slug = form.serviceName
      .toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlugPreview(slug);
  }, [form.serviceName]);

  const openCreate = () => {
    setEditService(null);
    setForm(initialForm);
    setNewImages([]); setNewPreviews([]);
    setExistingImages([]); setRemovedImages([]);
    setModalOpen(true);
  };

  const openEdit = (svc) => {
    setEditService(svc);
    setForm({
      serviceName: svc.serviceName,
      category: svc.category,
      price: svc.price,
      description: svc.description,
      faq: svc.faq || [],
      sortOrder: svc.sortOrder || 0,
      isActive: svc.isActive !== undefined ? svc.isActive : true,
    });
    setExistingImages(svc.images || []);
    setNewImages([]); setNewPreviews([]);
    setRemovedImages([]);
    setModalOpen(true);
  };

  const handleImagePick = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const converted = await Promise.all(files.map(f => compressAndConvertToWebP(f, 0.82)));
    setNewImages(prev => [...prev, ...converted]);
    setNewPreviews(prev => [...prev, ...converted.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeNewImage = (idx) => {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewImages(prev => prev.filter((_, i) => i !== idx));
    setNewPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (url) => {
    setExistingImages(prev => prev.filter(u => u !== url));
    setRemovedImages(prev => [...prev, url]);
  };

  // FAQ helpers
  const addFaq = () => setForm(f => ({ ...f, faq: [...f.faq, { question: '', answer: '' }] }));
  const removeFaq = (idx) => setForm(f => ({ ...f, faq: f.faq.filter((_, i) => i !== idx) }));
  const updateFaq = (idx, field, value) => setForm(f => ({
    ...f, faq: f.faq.map((item, i) => i === idx ? { ...item, [field]: value } : item)
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceName.trim() || !form.category.trim() || !form.price) {
      return message.warning('Please fill in Name, Category and Price.');
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('serviceName', form.serviceName.trim());
      fd.append('category', form.category.trim());
      fd.append('price', form.price);
      fd.append('description', form.description.trim());
      fd.append('faq', JSON.stringify(form.faq.filter(f => f.question && f.answer)));
      fd.append('sortOrder', form.sortOrder);
      fd.append('isActive', form.isActive);

      if (editService) {
        fd.append('removedImages', JSON.stringify(removedImages));
      }
      newImages.forEach(file => fd.append('images', file));

      if (editService) {
        await axiosInstance.put(`${api}/admin/services/${editService._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Service updated!');
      } else {
        await axiosInstance.post(`${api}/admin/services`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Service created!');
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save service');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${api}/admin/services/${id}`);
      message.success('Service deleted');
      fetchServices();
    } catch { message.error('Failed to delete service'); }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Services</h2>
        <button
          onClick={openCreate}
          className="px-5 py-2 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white rounded-xl font-semibold text-sm shadow hover:opacity-90 transition"
        >
          + Add Service
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading…</div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No services yet. Click "Add Service" to create one.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-purple-900/30">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#18112e]">
              <tr>
                {['Image', 'Name', 'Category', 'Price', 'Status', 'FAQs', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-purple-900/20">
              {services.map(svc => (
                <tr key={svc._id} className="bg-white dark:bg-[#18112e] hover:bg-gray-50 dark:hover:bg-purple-900/10 transition-colors">
                  <td className="px-4 py-3">
                    {svc.images?.[0]
                      ? <img src={svc.images[0]} alt={svc.serviceName} className="w-14 h-10 object-cover rounded-lg" />
                      : <div className="w-14 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-xs">None</div>
                    }
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {svc.serviceName}
                    <div className="text-xs text-gray-400 font-mono">/services/{svc.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{svc.category}</td>
                  <td className="px-4 py-3 font-bold text-purple-600 dark:text-purple-400">₹{svc.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${svc.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {svc.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{svc.faq?.length || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(svc)} className="px-3 py-1 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 font-semibold transition">Edit</button>
                      <Popconfirm title="Delete this service?" onConfirm={() => handleDelete(svc._id)} okText="Yes" cancelText="No">
                        <button className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 font-semibold transition">Delete</button>
                      </Popconfirm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onCancel={() => { if (!submitting) setModalOpen(false); }}
        footer={null}
        width={700}
        title={<span className="font-bold text-lg">{editService ? 'Edit Service' : 'Create Service'}</span>}
        destroyOnClose
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-2 max-h-[75vh] overflow-y-auto pr-1">
          {/* Name + slug preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Service Name *</label>
            <input
              className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white dark:bg-[#231542] text-gray-900 dark:text-white"
              value={form.serviceName}
              onChange={e => setForm(f => ({ ...f, serviceName: e.target.value }))}
              placeholder="e.g. YouTube Channel Growth"
              required
            />
            {slugPreview && (
              <p className="text-xs text-gray-400 mt-1 font-mono">URL: /services/<span className="text-purple-500">{slugPreview}</span></p>
            )}
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <input
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white dark:bg-[#231542] text-gray-900 dark:text-white"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                placeholder="e.g. YouTube, Instagram…"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Price (₹) *</label>
              <input
                type="number" min="0"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white dark:bg-[#231542] text-gray-900 dark:text-white"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              rows={4}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white dark:bg-[#231542] text-gray-900 dark:text-white resize-none"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe the service in detail…"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Images <span className="text-gray-400 font-normal">(auto-converted to WebP)</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* Existing images */}
              {existingImages.map(url => (
                <div key={url} className="relative w-20 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(url)}
                    className="absolute inset-0 bg-red-600/70 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    ✕
                  </button>
                </div>
              ))}
              {/* New previews */}
              {newPreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden border border-purple-400 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewImage(i)}
                    className="absolute inset-0 bg-red-600/70 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    ✕
                  </button>
                </div>
              ))}
              {/* Add more */}
              <label className="w-20 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition text-gray-400 text-xs gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Add
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImagePick} />
              </label>
            </div>
          </div>

          {/* Sort order + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
              <input type="number" min="0"
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white dark:bg-[#231542] text-gray-900 dark:text-white"
                value={form.sortOrder}
                onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white dark:bg-[#231542] text-gray-900 dark:text-white"
                value={form.isActive ? 'true' : 'false'}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* FAQ section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">FAQs</label>
              <button type="button" onClick={addFaq}
                className="text-xs px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 font-semibold transition">
                + Add FAQ
              </button>
            </div>
            <div className="space-y-3">
              {form.faq.map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-[#231542] rounded-xl p-3 border border-gray-200 dark:border-purple-900/30">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-purple-500 bg-white dark:bg-[#18112e] text-gray-900 dark:text-white"
                        placeholder={`Question ${idx + 1}`}
                        value={item.question}
                        onChange={e => updateFaq(idx, 'question', e.target.value)}
                      />
                      <textarea
                        rows={2}
                        className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-purple-500 bg-white dark:bg-[#18112e] text-gray-900 dark:text-white resize-none"
                        placeholder={`Answer ${idx + 1}`}
                        value={item.answer}
                        onChange={e => updateFaq(idx, 'answer', e.target.value)}
                      />
                    </div>
                    <button type="button" onClick={() => removeFaq(idx)}
                      className="mt-1 text-red-400 hover:text-red-600 text-lg font-bold leading-none">×</button>
                  </div>
                </div>
              ))}
              {form.faq.length === 0 && (
                <p className="text-xs text-gray-400 italic">No FAQs yet. Click "+ Add FAQ" to add one.</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} disabled={submitting}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white font-bold text-sm shadow hover:opacity-90 transition disabled:opacity-60">
              {submitting ? 'Saving…' : editService ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminServices;
