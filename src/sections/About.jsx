import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../hooks/useContent';

const sanitizeHtml = (html) => (html || '').replace(/&nbsp;/g, ' ');

const About = () => {
  const { content } = useContent();
  const aboutData = content?.about || {
    title: "A Performance-Driven Live Music Collective",
    description1: "We are a performance-driven live music collective delivering high-energy stage experiences across weddings, concerts, corporate shows and curated musical productions.",
    description2: "Our focus is not just performance — it's audience connection. We believe every event deserves a unique soundscape that resonates with the hearts of those present.",
    image: "https://placehold.co/640x320/000000/FFFFFF?text=640+x+320",
    stats: [
      { label: 'Years of Experience', value: '10+' },
      { label: 'Events Performed', value: '500+' },
      { label: 'Cities Covered', value: '50+' },
      { label: 'Genres Played', value: '15+' },
    ]
  };

  return (
    <section id="about" className="bg-zinc-950 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group aspect-square lg:aspect-video rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={aboutData.image}
              alt={aboutData.imageAlt || 'Band performing'}
              title={aboutData.imageTitle || undefined}
              width="800"
              height="450"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-transparent transition-colors duration-500" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              {(() => {
                const highlight = 'Live Music Collective';
                const idx = aboutData.title.indexOf(highlight);
                if (idx === -1) return aboutData.title;
                return (
                  <>
                    {aboutData.title.slice(0, idx)}
                    <span className="text-purple-500">{highlight}</span>
                    {aboutData.title.slice(idx + highlight.length)}
                  </>
                );
              })()}
            </h2>
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed wysiwyg-content">
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.description1) }} />
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutData.description2) }} />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {aboutData.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center md:text-left"
                >
                  <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-xs md:text-sm font-semibold text-purple-500 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
