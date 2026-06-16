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

  const HOME_PATHS = new Set(['/', '/about', '/team', '/gigs', '/portfolio', '/gallery', '/contact']);
  const isHome = HOME_PATHS.has(location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavClick = (to) => {
    setIsOpen(false);
    if (!isHome) {
      navigate('/', { state: { scrollTo: to } });
    }
  };

  return (
    <>
      {/* ── Nav bar ─────────────────────────────────────────── */}
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
                alt={content.logoAlt || 'Arok India'}
                title={content.logoTitle || undefined}
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
            {navLinks.map((link) =>
              isHome ? (
                <ScrollLink
                  key={link.to}
                  to={link.to}
                  href={`#${link.to}`}
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
            )}
          </div>

          {/* Mobile toggle placeholder keeps layout balanced */}
          <div className="md:hidden w-10 h-10" />
        </div>
      </nav>

      {/* ── Mobile hamburger — z-[100], always above overlay ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className="fixed top-4 right-6 z-[100] md:hidden text-white p-2 focus:outline-none"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ── Mobile overlay — z-[99], full-screen, fade transition ── */}
      <div
        className={cn(
          'fixed inset-0 z-[99] md:hidden bg-black flex flex-col transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!isOpen}
      >
        {/* Nav links — padded top so they clear the nav bar */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 overflow-y-auto px-6 py-24">
          {navLinks.map((link) =>
            isHome ? (
              <ScrollLink
                key={link.to}
                to={link.to}
                href={`#${link.to}`}
                smooth={true}
                duration={500}
                onClick={() => setIsOpen(false)}
                className="text-2xl text-gray-300 hover:text-purple-400 cursor-pointer transition-colors font-semibold uppercase tracking-widest"
              >
                {link.name}
              </ScrollLink>
            ) : (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to)}
                className="text-2xl text-gray-300 hover:text-purple-400 cursor-pointer transition-colors font-semibold uppercase tracking-widest bg-transparent border-none outline-none"
              >
                {link.name}
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
