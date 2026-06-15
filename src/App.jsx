import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { AuthProvider } from './context/AuthContext';
import { useContent } from './hooks/useContent';
import { applyTheme } from './utils/colorUtils';
import { applySeo } from './utils/seoUtils';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Intro from './sections/Intro';
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
import Admin from './pages/Admin';
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

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        scroller.scrollTo(location.state.scrollTo, {
          duration: 500,
          smooth: true,
          offset: -70,
        });
      }, 100);
    }
  }, [location]);

  return (
    <main>
      <Hero />
      <Intro />
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
      <Router>
        <ThemeInjector />
        <div className="bg-black text-white selection:bg-purple-500 selection:text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}


export default App;
