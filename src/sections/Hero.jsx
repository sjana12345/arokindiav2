import React from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { useContent } from '../hooks/useContent';

const Hero = () => {
  const { content } = useContent();
  const heroData = content?.hero || {
    title: "Crafting Stories Through Sound & Live Experiences",
    subtitle: "Live Performances • Wedding Events • Concert Shows • Studio Production",
    ctaText: "Explore Our Work",
    // poster: "https://placehold.co/640x320/000000/FFFFFF?text=640+x+320",
    videoUrl: "assets/videos/video_preview_h264.mp4"
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          poster={heroData.poster}
        >
          <source src={heroData.videoUrl} type="video/mp4" />
        </video>
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.h1
          key={heroData.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl"
        >
          {heroData.title.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              {word === 'Sound' ? <span className="text-purple-500">{word}</span> : word}{' '}
            </React.Fragment>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 max-w-2xl text-lg text-gray-300 md:text-xl lg:text-2xl"
        >
          {heroData.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10"
        >
          <Link
            to="intro"
            smooth={true}
            duration={500}
            offset={-70}
            className="cursor-pointer rounded-full bg-purple-600 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            {heroData.ctaText}
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/30 p-1 flex justify-center">
          <div className="h-2 w-1 rounded-full bg-white" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
