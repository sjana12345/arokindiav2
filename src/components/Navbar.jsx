import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { useContent } from '../hooks/useContent';

const navLinks = [
  { name: 'Home', to: 'home' },
  { name: 'About', to: 'about' },
  { name: 'Team', to: 'team' },
  { name: 'Gigs', to: 'gigs' },
  { name: 'Portfolio', to: 'portfolio' },
  { name: 'Gallery', to: 'gallery' },
  { name: 'Contact', to: 'contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { content } = useContent();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (to) => {
    if (!isHome) {
      navigate('/', { state: { scrollTo: to } });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled || !isHome ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <RouterLink to="/" className="cursor-pointer">
          {content?.logo ? (
            <img
              src={content.logo}
              alt="Arok India"
              style={{ height: (content.logoHeight || 40) + 'px' }}
              className="w-auto object-contain"
            />
          ) : (
            <span className="text-2xl font-bold tracking-tighter text-white">
              AROK<span className="text-purple-500">INDIA</span>
            </span>
          )}
        </RouterLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            isHome ? (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                spy={true}
                activeClass="text-purple-500"
                offset={-70}
                className="text-gray-300 hover:text-white cursor-pointer transition-colors font-medium text-sm uppercase tracking-wider"
              >
                {link.name}
              </ScrollLink>
            ) : (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to)}
                className="text-gray-300 hover:text-white cursor-pointer transition-colors font-medium text-sm uppercase tracking-wider bg-transparent border-none outline-none"
              >
                {link.name}
              </button>
            )
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center transition-transform duration-300 md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-white p-2"
        >
          <X size={32} />
        </button>
        <div className="flex flex-col items-center space-y-8">
          {navLinks.map((link) => (
            isHome ? (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                onClick={() => setIsOpen(false)}
                className="text-2xl text-gray-300 hover:text-white cursor-pointer transition-colors font-semibold uppercase tracking-widest"
              >
                {link.name}
              </ScrollLink>
            ) : (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to)}
                className="text-2xl text-gray-300 hover:text-white cursor-pointer transition-colors font-semibold uppercase tracking-widest bg-transparent border-none outline-none"
              >
                {link.name}
              </button>
            )
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
