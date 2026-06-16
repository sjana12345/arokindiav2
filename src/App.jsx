import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { AuthProvider } from './context/AuthContext';
import { useContent } from './hooks/useContent';
import { applyTheme } from './utils/colorUtils';
import { applySeo } from './utils/seoUtils';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Intro from './sections/Intro';
import Release from './sections/Release';
import About from './sections/About';
import Team from './sections/Team';
import Gigs from './sections/Gigs';
import Portfolio from './sections/Portfolio';
import Gallery from './sections/Gallery';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Login from './pages/Login';
// Lazy-load Admin so react-quill-new (Quill) is never evaluated during SSR
const Admin = React.lazy(() => import('./pages/Admin'));
import './App.css';

const ThemeInjector = () => {
  const { content } = useContent();
  useEffect(() => {
    if (content?.colors) applyTheme(content.colors);
    if (content?.seo) applySeo(content.seo);
    if (content?.favicon) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'icon');
        document.head.appendChild(link);
      }
      link.setAttribute('href', content.favicon);
      link.removeAttribute('type');
    }
  }, [content]);
  return null;
};

const SECTION_PATHS = {
  '/about': 'about',
  '/team': 'team',
  '/gigs': 'gigs',
  '/portfolio': 'portfolio',
  '/gallery': 'gallery',
  '/contact': 'contact',
};

const Home = () => {
  const location = useLocation();
  const scrollTarget = location.state?.scrollTo || SECTION_PATHS[location.pathname];

  useEffect(() => {
    if (scrollTarget) {
      setTimeout(() => {
        scroller.scrollTo(scrollTarget, { duration: 500, smooth: true, offset: -70 });
      }, 100);
    }
  }, [scrollTarget]);

  return (
    <main>
      <Hero />
      <Intro />
      <Release />
      <About />
      <Team />
      <Gigs />
      <Portfolio />
      <Gallery />
      <Contact />
    </main>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeInjector />
      <div className="bg-black text-white selection:bg-purple-500 selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/team" element={<Home />} />
          <Route path="/gigs" element={<Home />} />
          <Route path="/portfolio" element={<Home />} />
          <Route path="/gallery" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <Suspense fallback={<div className="min-h-screen bg-black" />}>
              <Admin />
            </Suspense>
          } />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}


export default App;
