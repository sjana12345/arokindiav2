import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const TermsOfService = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white border-b border-zinc-800 pb-6">Terms of Service</h1>
          
          <p className="text-gray-400 text-lg mb-8 leading-relaxed italic">Last updated: March 31, 2026</p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing our website and services, you agree to comply with and be bound by the following terms and conditions. If you do not agree, please do not use this site or our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">2. Services Provided</h2>
            <p className="text-gray-300 leading-relaxed">
              AROK INDIA is a performance-driven live music collective. We provide musical entertainment services for weddings, corporate events, and live concerts. All bookings are subject to availability and formal agreement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">3. Booking and Payments</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-4">
              <li>
                <span className="text-white font-bold">Inquiry:</span> Submitting a contact form does not constitute a booking.
              </li>
              <li>
                <span className="text-white font-bold">Deposit:</span> A non-refundable booking deposit is required to secure a specific date for your event.
              </li>
              <li>
                <span className="text-white font-bold">Final Payment:</span> The remaining balance is due strictly before or on the day of the event as per the contract.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">4. Cancellation and Rescheduling</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Cancellations made less than 30 days before the event will result in the forfeiture of all payments made to date. Rescheduling is subject to our availability and may incur additional fees.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">5. Technical and Logistical Requirements</h2>
            <p className="text-gray-300 leading-relaxed">
              Clients are responsible for providing adequate stage space, power supply, and environmental protection (for outdoor events) as outlined in our technical rider.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">6. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content on this website, including media, text, and design elements, is the property of AROK INDIA and may not be used without explicit permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-500 uppercase tracking-wide">7. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts of West Bengal.
            </p>
          </section>
        </motion.article>
      </div>
    </div>
  );
};

export default TermsOfService;
