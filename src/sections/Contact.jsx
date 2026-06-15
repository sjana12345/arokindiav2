import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, Phone, MapPin, Loader2, CheckCircle, XCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    eventType: 'Wedding',
    date: '',
    location: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus({ type: 'success', message: 'Enquiry sent successfully!' });
        setFormData({ name: '', eventType: 'Wedding', date: '', location: '', message: '' });
      } else {
        setStatus({ type: 'error', message: result.message || 'Failed to send enquiry' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <section id="contact" className="bg-zinc-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Book Us For Your Event</h2>
            <p className="text-gray-400 text-lg mb-12">
              Let's create something memorable together. Whether it's a grand wedding, a corporate gala, or a live concert, we bring the energy and the sound.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-500 flex-shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">WhatsApp Us</h4>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-500 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Email Inquiry</h4>
                  <p className="text-gray-400">bookings@arokindia.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-500 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Base Location</h4>
                  <p className="text-gray-400">Kolkata, West Bengal, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-zinc-900/50 p-8 md:p-12 rounded-3xl border border-zinc-800"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Event Type</label>
                  <select 
                    name="eventType"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.eventType}
                    onChange={handleChange}
                  >
                    <option>Wedding</option>
                    <option>Corporate</option>
                    <option>Concert</option>
                    <option>Private Party</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Event City"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Tell us more about your event..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              {status && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-600/20 border border-green-600' : 'bg-red-600/20 border border-red-600'}`}>
                  {status.type === 'success' ? <CheckCircle className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />}
                  <span className={`font-bold ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? <><Loader2 className="animate-spin" size={20} /> Sending...</> : 'Send Inquiry'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
