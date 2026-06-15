import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../hooks/useContent';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Save, Image as ImageIcon, Layout, Users, Calendar, Video, Grid, CheckCircle2, AlertCircle } from 'lucide-react';
import { ICON_MAP } from '../sections/Intro';
import { cn } from '../utils/cn';

const Admin = () => {
  const { user, token, logout, loading: authLoading } = useAuth();
  const { content, loading: contentLoading, updateContent } = useContent();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');
  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [newGig, setNewGig] = useState({ date: '', title: '', location: '', type: 'Wedding', status: 'upcoming', image: '' });
  const [newPortfolio, setNewPortfolio] = useState({ title: '', category: 'Live Shows', thumbnail: '', videoUrl: '' });
  const [newGallery, setNewGallery] = useState({ category: 'Concerts', url: '', title: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  if (authLoading || contentLoading || !formData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  const handleInputChange = (section, field, value, index = null, subfield = null) => {
    setFormData(prev => {
      const updated = { ...prev };
      if (index !== null && subfield) {
        updated[section][index][subfield] = value;
      } else if (index !== null) {
        updated[section][index][field] = value;
      } else {
        updated[section][field] = value;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    setStatus({ type: 'loading', message: 'Saving changes...' });
    const result = await updateContent(formData, token);
    if (result.success) {
      setStatus({ type: 'success', message: 'Website updated successfully!' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  const handleAddGig = () => {
    if (!newGig.date || !newGig.title || !newGig.location) {
      setStatus({ type: 'error', message: 'Please fill in date, title, and location' });
      return;
    }
    const gig = { ...newGig, id: Date.now() };
    setFormData(prev => ({
      ...prev,
      gigs: [...prev.gigs, gig]
    }));
    setNewGig({ date: '', title: '', location: '', type: 'Wedding', status: 'upcoming', image: '' });
    setStatus({ type: 'success', message: 'Gig added successfully!' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const handleDeleteGig = (index) => {
    setFormData(prev => ({
      ...prev,
      gigs: prev.gigs.filter((_, i) => i !== index)
    }));
    setStatus({ type: 'success', message: 'Gig deleted!' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const handleAddPortfolio = () => {
    if (!newPortfolio.title || !newPortfolio.videoUrl) {
      setStatus({ type: 'error', message: 'Please fill in title and video URL' });
      return;
    }
    const item = { ...newPortfolio, id: Date.now() };
    setFormData(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, item]
    }));
    setNewPortfolio({ title: '', category: 'Live Shows', thumbnail: '', videoUrl: '' });
    setStatus({ type: 'success', message: 'Portfolio item added!' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const handleDeletePortfolio = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
    setStatus({ type: 'success', message: 'Portfolio item deleted!' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const handleAddGallery = () => {
    if (!newGallery.url || !newGallery.title) {
      setStatus({ type: 'error', message: 'Please fill in image URL and title' });
      return;
    }
    const item = { ...newGallery, id: Date.now() };
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, item]
    }));
    setNewGallery({ category: 'Concerts', url: '', title: '' });
    setStatus({ type: 'success', message: 'Gallery item added!' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const handleDeleteGallery = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
    setStatus({ type: 'success', message: 'Gallery item deleted!' });
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      setStatus({ type: 'error', message: 'Please select an image file' });
      return;
    }
    setStatus({ type: 'loading', message: 'Uploading logo...' });
    const formData = new FormData();
    formData.append('logo', logoFile);
    try {
      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, logo: result.logoUrl }));
        setLogoFile(null);
        setStatus({ type: 'success', message: 'Logo uploaded successfully!' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Upload failed' });
    }
  };

  const handleLogoRemove = async () => {
    setStatus({ type: 'loading', message: 'Removing logo...' });
    const updated = { ...formData, logo: '' };
    const result = await updateContent(updated, token);
    if (result.success) {
      setFormData(updated);
      setLogoPreview('');
      setStatus({ type: 'success', message: 'Logo removed!' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  const tabs = [
    { id: 'logo', label: 'Logo', icon: ImageIcon },
    { id: 'hero', label: 'Hero', icon: Layout },
    { id: 'intro', label: 'Intro', icon: Layout },
    { id: 'about', label: 'About', icon: Layout },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'gigs', label: 'Gigs', icon: Calendar },
    { id: 'portfolio', label: 'Portfolio', icon: Video },
    { id: 'gallery', label: 'Gallery', icon: Grid },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Admin <span className="text-purple-500">Dashboard</span></h1>
            <p className="text-gray-400 mt-2">Manage your website content and media</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20"
            >
              <Save size={20} /> Save Changes
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-red-600/20 hover:text-red-500 text-gray-400 px-6 py-3 rounded-xl font-bold transition-all"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "mb-8 p-4 rounded-xl flex items-center gap-3 border",
                status.type === 'success' ? "bg-green-500/10 border-green-500/50 text-green-500" :
                status.type === 'error' ? "bg-red-500/10 border-red-500/50 text-red-500" :
                "bg-purple-500/10 border-purple-500/50 text-purple-500"
              )}
            >
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-left",
                  activeTab === tab.id ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <tab.icon size={20} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-3 bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 border-b border-zinc-800 pb-4">
              Edit {tabs.find(t => t.id === activeTab).label} Content
            </h3>

            <div className="space-y-8">
              {/* Dynamic Content Rendering based on Tab */}
              {activeTab === 'logo' && (
                <div className="space-y-8">
                  {/* Current Logo */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Current Logo</label>
                    {(logoPreview || formData.logo) ? (
                      <div className="flex items-center gap-6 p-6 bg-black rounded-2xl border border-zinc-800">
                        <img
                          src={logoPreview || formData.logo}
                          alt="Band Logo"
                          className="h-16 w-auto object-contain"
                        />
                        <div>
                          <p className="text-sm text-gray-400 mb-3">{logoPreview ? 'Preview (not yet uploaded)' : 'Active logo shown in navbar'}</p>
                          {!logoPreview && (
                            <button
                              onClick={handleLogoRemove}
                              className="text-red-500 hover:text-red-400 text-sm font-bold"
                            >
                              Remove Logo
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-black rounded-2xl border border-zinc-800 text-gray-500 text-sm">
                        No logo uploaded — navbar shows text fallback (AROKINDIA)
                      </div>
                    )}
                  </div>

                  {/* Logo Size */}
                  {formData.logo && (
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Logo Size</label>
                      <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-4">
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="24"
                            max="120"
                            value={formData.logoHeight || 40}
                            onChange={(e) => setFormData(prev => ({ ...prev, logoHeight: Number(e.target.value) }))}
                            className="flex-1 accent-purple-500"
                          />
                          <span className="text-white font-bold w-16 text-right">{formData.logoHeight || 40}px</span>
                        </div>
                        <div className="flex items-end gap-4 p-4 bg-zinc-900 rounded-xl">
                          <span className="text-xs text-gray-500 uppercase tracking-widest">Preview</span>
                          <img
                            src={formData.logo}
                            alt="Logo preview"
                            style={{ height: (formData.logoHeight || 40) + 'px' }}
                            className="w-auto object-contain"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Click <span className="text-purple-400 font-bold">Save Changes</span> to apply the new size.</p>
                      </div>
                    </div>
                  )}

                  {/* Upload New Logo */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Upload New Logo</label>
                    <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-4">
                      <p className="text-xs text-gray-500">PNG, JPG, SVG or WEBP · Max 5 MB · Recommended: transparent background PNG</p>
                      <label className="flex items-center gap-3 w-full cursor-pointer border-2 border-dashed border-zinc-700 hover:border-purple-500 rounded-xl px-6 py-8 transition-colors">
                        <ImageIcon size={24} className="text-purple-500 shrink-0" />
                        <span className="text-gray-400">
                          {logoFile ? logoFile.name : 'Click to select logo image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoFileChange}
                        />
                      </label>
                      <button
                        onClick={handleLogoUpload}
                        disabled={!logoFile}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                          logoFile
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-zinc-800 text-gray-600 cursor-not-allowed"
                        )}
                      >
                        <ImageIcon size={18} /> Upload Logo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Headline Title</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      value={formData.hero.title}
                      onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subtitle / Tagline</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      value={formData.hero.subtitle}
                      onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                    />
                    <p className="text-xs text-gray-600">e.g. Live Performances • Wedding Events • Concert Shows</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">CTA Button Text</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      value={formData.hero.ctaText}
                      onChange={(e) => handleInputChange('hero', 'ctaText', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Poster Image URL</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      value={formData.hero.poster}
                      onChange={(e) => handleInputChange('hero', 'poster', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video URL (MP4)</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      value={formData.hero.videoUrl}
                      onChange={(e) => handleInputChange('hero', 'videoUrl', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'intro' && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Section Title</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      value={formData.intro.title}
                      onChange={(e) => handleInputChange('intro', 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                    <textarea
                      rows="3"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                      value={formData.intro.description}
                      onChange={(e) => handleInputChange('intro', 'description', e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Service Cards</label>
                    {formData.intro.services.map((service, index) => (
                      <div key={index} className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-4">
                        <h4 className="text-xs font-bold text-purple-500 uppercase tracking-widest">Service {index + 1}</h4>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title</label>
                          <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            value={service.title}
                            onChange={(e) => {
                              const updated = [...formData.intro.services];
                              updated[index] = { ...updated[index], title: e.target.value };
                              handleInputChange('intro', 'services', updated);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                          <textarea
                            rows="2"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                            value={service.description}
                            onChange={(e) => {
                              const updated = [...formData.intro.services];
                              updated[index] = { ...updated[index], description: e.target.value };
                              handleInputChange('intro', 'services', updated);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Icon</label>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(ICON_MAP).map(([name, Icon]) => (
                              <button
                                key={name}
                                type="button"
                                title={name}
                                onClick={() => {
                                  const updated = [...formData.intro.services];
                                  updated[index] = { ...updated[index], icon: name };
                                  handleInputChange('intro', 'services', updated);
                                }}
                                className={cn(
                                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                                  service.icon === name
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white'
                                )}
                              >
                                <Icon size={18} />
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-gray-600">Selected: <span className="text-purple-400">{service.icon || 'Music'}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-12">
                  {formData.team.map((member, index) => (
                    <div key={member.id} className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-6">
                      <h4 className="font-bold text-purple-500 uppercase tracking-widest text-sm">Member: {member.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name</label>
                          <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            value={member.name}
                            onChange={(e) => handleInputChange('team', 'name', e.target.value, index)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Designation / Role</label>
                          <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            value={member.role}
                            onChange={(e) => handleInputChange('team', 'role', e.target.value, index)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
                          <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            value={member.image}
                            onChange={(e) => handleInputChange('team', 'image', e.target.value, index)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                          <select
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            value={member.category}
                            onChange={(e) => handleInputChange('team', 'category', e.target.value, index)}
                          >
                            <option value="Musicians">Musicians</option>
                            <option value="Crew">Crew</option>
                            <option value="Management">Management</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Social Media Links</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="Instagram URL"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                            value={member.social?.instagram || ''}
                            onChange={(e) => handleInputChange('team', 'social', { ...member.social, instagram: e.target.value }, index)}
                          />
                          <input
                            type="text"
                            placeholder="Twitter URL"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                            value={member.social?.twitter || ''}
                            onChange={(e) => handleInputChange('team', 'social', { ...member.social, twitter: e.target.value }, index)}
                          />
                          <input
                            type="text"
                            placeholder="LinkedIn URL"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                            value={member.social?.linkedin || ''}
                            onChange={(e) => handleInputChange('team', 'social', { ...member.social, linkedin: e.target.value }, index)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Biography</label>
                        <textarea
                          rows="3"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          value={member.bio}
                          onChange={(e) => handleInputChange('team', 'bio', e.target.value, index)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">About Title</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      value={formData.about.title}
                      onChange={(e) => handleInputChange('about', 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Main Description (Rich Text)</label>
                    <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                      <ReactQuill 
                        theme="snow"
                        value={formData.about.description1}
                        onChange={(value) => handleInputChange('about', 'description1', value)}
                        className="text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Secondary Description (Rich Text)</label>
                    <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                      <ReactQuill 
                        theme="snow"
                        value={formData.about.description2}
                        onChange={(value) => handleInputChange('about', 'description2', value)}
                        className="text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">About Image URL</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      value={formData.about.image}
                      onChange={(e) => handleInputChange('about', 'image', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Simplified other tabs for brevity */}
              {activeTab === 'gigs' && (
                <div className="space-y-8">
                  {/* Add New Gig Form */}
                  <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-6">
                    <h4 className="font-bold text-purple-500 uppercase tracking-widest text-sm">Add New Gig</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date</label>
                        <input
                          type="text"
                          placeholder="e.g., 19 June 2026"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          value={newGig.date}
                          onChange={(e) => setNewGig({ ...newGig, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Event Title</label>
                        <input
                          type="text"
                          placeholder="e.g., Sangeet & Mehendi Performance"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          value={newGig.title}
                          onChange={(e) => setNewGig({ ...newGig, title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Location</label>
                        <input
                          type="text"
                          placeholder="e.g., Kolkata, India"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          value={newGig.location}
                          onChange={(e) => setNewGig({ ...newGig, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Type</label>
                        <select
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          value={newGig.type}
                          onChange={(e) => setNewGig({ ...newGig, type: e.target.value })}
                        >
                          <option value="Wedding">Wedding</option>
                          <option value="Corporate">Corporate</option>
                          <option value="Concert">Concert</option>
                          <option value="Festival">Festival</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
                        <select
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          value={newGig.status}
                          onChange={(e) => setNewGig({ ...newGig, status: e.target.value })}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="past">Past</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="Image URL for the gig"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        value={newGig.image}
                        onChange={(e) => setNewGig({ ...newGig, image: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={handleAddGig}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                    >
                      Add Gig
                    </button>
                  </div>

                  {/* Existing Gigs List */}
                  <div className="space-y-6">
                    <h4 className="font-bold text-purple-500 uppercase tracking-widest text-sm">Existing Gigs</h4>
                    {formData.gigs.map((gig, index) => (
                      <div key={gig.id} className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-6">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-white">Gig #{index + 1}</h5>
                          <button
                            onClick={() => handleDeleteGig(index)}
                            className="text-red-500 hover:text-red-400 text-sm font-bold"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                              value={gig.date}
                              onChange={(e) => handleInputChange('gigs', 'date', e.target.value, index)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Event Title</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                              value={gig.title}
                              onChange={(e) => handleInputChange('gigs', 'title', e.target.value, index)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Location</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                              value={gig.location}
                              onChange={(e) => handleInputChange('gigs', 'location', e.target.value, index)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Type</label>
                            <select
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                              value={gig.type}
                              onChange={(e) => handleInputChange('gigs', 'type', e.target.value, index)}
                            >
                              <option value="Wedding">Wedding</option>
                              <option value="Corporate">Corporate</option>
                              <option value="Concert">Concert</option>
                              <option value="Festival">Festival</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
                            <select
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                              value={gig.status}
                              onChange={(e) => handleInputChange('gigs', 'status', e.target.value, index)}
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="past">Past</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
                          <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            value={gig.image}
                            onChange={(e) => handleInputChange('gigs', 'image', e.target.value, index)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="space-y-8">
                  {/* Add New Portfolio Form */}
                  <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-6">
                    <h4 className="font-bold text-purple-500 uppercase tracking-widest text-sm">Add New Portfolio Item</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title</label>
                        <input
                          type="text"
                          placeholder="e.g., Live at Mumbai Arena"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          value={newPortfolio.title}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                        <select
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          value={newPortfolio.category}
                          onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                        >
                          <option value="Live Shows">Live Shows</option>
                          <option value="Wedding Events">Wedding Events</option>
                          <option value="Corporate">Corporate</option>
                          <option value="Studio">Studio</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video URL (YouTube Embed)</label>
                      <input
                        type="text"
                        placeholder="e.g., https://www.youtube.com/embed/..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        value={newPortfolio.videoUrl}
                        onChange={(e) => setNewPortfolio({ ...newPortfolio, videoUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Thumbnail URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        value={newPortfolio.thumbnail}
                        onChange={(e) => setNewPortfolio({ ...newPortfolio, thumbnail: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={handleAddPortfolio}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                    >
                      Add Portfolio Item
                    </button>
                  </div>

                  {/* Existing Portfolio List */}
                  <div className="space-y-6">
                    <h4 className="font-bold text-purple-500 uppercase tracking-widest text-sm">Existing Portfolio Items</h4>
                    {formData.portfolio.map((item, index) => (
                      <div key={item.id} className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-6">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-white">Item #{index + 1}</h5>
                          <button
                            onClick={() => handleDeletePortfolio(index)}
                            className="text-red-500 hover:text-red-400 text-sm font-bold"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                              value={item.title}
                              onChange={(e) => handleInputChange('portfolio', 'title', e.target.value, index)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                            <select
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                              value={item.category}
                              onChange={(e) => handleInputChange('portfolio', 'category', e.target.value, index)}
                            >
                              <option value="Live Shows">Live Shows</option>
                              <option value="Wedding Events">Wedding Events</option>
                              <option value="Corporate">Corporate</option>
                              <option value="Studio">Studio</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Video URL</label>
                          <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            value={item.videoUrl}
                            onChange={(e) => handleInputChange('portfolio', 'videoUrl', e.target.value, index)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Thumbnail URL</label>
                          <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            value={item.thumbnail}
                            onChange={(e) => handleInputChange('portfolio', 'thumbnail', e.target.value, index)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-8">
                  {/* Add New Gallery Form */}
                  <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-6">
                    <h4 className="font-bold text-purple-500 uppercase tracking-widest text-sm">Add New Gallery Image</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                        <select
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          value={newGallery.category}
                          onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                        >
                          <option value="Concerts">Concerts</option>
                          <option value="Wedding Events">Wedding Events</option>
                          <option value="Backstage">Backstage</option>
                          <option value="Studio Moments">Studio Moments</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title</label>
                        <input
                          type="text"
                          placeholder="e.g., Live at Arena"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                          value={newGallery.title}
                          onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        value={newGallery.url}
                        onChange={(e) => setNewGallery({ ...newGallery, url: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={handleAddGallery}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                    >
                      Add Gallery Image
                    </button>
                  </div>

                  {/* Existing Gallery List */}
                  <div className="space-y-6">
                    <h4 className="font-bold text-purple-500 uppercase tracking-widest text-sm">Existing Gallery Images</h4>
                    {formData.gallery.map((item, index) => (
                      <div key={item.id} className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-6">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-white">Image #{index + 1}</h5>
                          <button
                            onClick={() => handleDeleteGallery(index)}
                            className="text-red-500 hover:text-red-400 text-sm font-bold"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                            <select
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                              value={item.category}
                              onChange={(e) => handleInputChange('gallery', 'category', e.target.value, index)}
                            >
                              <option value="Concerts">Concerts</option>
                              <option value="Wedding Events">Wedding Events</option>
                              <option value="Backstage">Backstage</option>
                              <option value="Studio Moments">Studio Moments</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                              value={item.title}
                              onChange={(e) => handleInputChange('gallery', 'title', e.target.value, index)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
                          <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            value={item.url}
                            onChange={(e) => handleInputChange('gallery', 'url', e.target.value, index)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
