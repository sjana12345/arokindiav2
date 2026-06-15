import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-purple-500 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold">
            <ChevronLeft size={20} />
            Back to Home
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-invert prose-purple max-w-none"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white border-b border-zinc-800 pb-6">Privacy Policy</h1>
          
          <p className="text-gray-400 text-lg mb-8 leading-relaxed italic">Last updated: March 31, 2026</p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">1. Information We Collect</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              At AROK INDIA, we respect your privacy. We collect minimal information necessary to provide our services and communicate with you about your event inquiries. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Name and contact details (email, phone number).</li>
              <li>Event details (location, date, type of event).</li>
              <li>Any additional message you provide through our contact forms.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">2. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your information is used strictly for:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Responding to your booking inquiries.</li>
              <li>Providing you with quotes and contract information.</li>
              <li>Sending occasional updates about our performances (only if you opt-in).</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">3. Third-Party Sharing</h2>
            <p className="text-gray-300 leading-relaxed">
              We never sell or rent your personal data to third parties. We only share information with our immediate crew and logistical partners (like venue managers or travel coordinators) when necessary to fulfill your booking requirements.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">4. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your information. However, please note that no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">5. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to request access to the data we hold about you, or to request its deletion at any time by contacting us at <span className="text-white font-medium">bookings@arokindia.com</span>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">6. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please reach out to us at:
              <br />
              <span className="block mt-4 text-white">
                AROK INDIA Collective<br />
                Kolkata, West Bengal, India<br />
                Email: bookings@arokindia.com
              </span>
            </p>
          </section>
        </motion.article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
