import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Facebook, Music2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & About */}
          <div className="lg:col-span-1">
            <span className="text-2xl font-bold tracking-tighter text-white mb-6 block">
              AROK<span className="text-purple-500">INDIA</span>
            </span>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              A performance-driven live music collective delivering high-energy
              stage experiences across India and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Team', 'Gigs', 'Portfolio', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-gray-500 hover:text-purple-500 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-gray-500">
                <Mail size={16} className="text-purple-500" />
                bookings@arokindia.com
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Phone size={16} className="text-purple-500" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <MapPin size={16} className="text-purple-500" />
                Kolkata, India
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <Youtube size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all">
                <Music2 size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 uppercase tracking-widest">
          <p>© 2026 AROK INDIA. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
