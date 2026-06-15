import React from 'react';
import { motion } from 'framer-motion';
import { Music, Heart, Briefcase, Mic2 } from 'lucide-react';
import { useContent } from '../hooks/useContent';

const iconMap = {
  'Live Performances': Music,
  'Wedding Events': Heart,
  'Corporate Shows': Briefcase,
  'Studio Production': Mic2,
};

const Intro = () => {
  const { content } = useContent();
  const introData = content?.intro || {
    title: "Unforgettable Live Musical Experiences",
    description: "We create unforgettable live musical experiences for weddings, concerts, corporate events and curated stage productions.",
    services: [
      { title: 'Live Performances', description: 'High-energy stage experiences for concerts and festivals.' },
      { title: 'Wedding Events', description: 'Elegant and memorable music for your special day.' },
      { title: 'Corporate Shows', description: 'Professional entertainment tailored for corporate gatherings.' },
      { title: 'Studio Production', description: 'High-quality recording and production services.' },
    ]
  };

  return (
    <section id="intro" className="bg-black py-24 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {introData.title}
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            {introData.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {introData.services.map((service, index) => {
            const Icon = iconMap[service.title] || Music;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl group transition-colors hover:border-purple-500/50 hover:bg-zinc-900"
              >
                <div className="w-16 h-16 bg-purple-600/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-600/20 transition-colors mx-auto">
                  <Icon className="text-purple-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Intro;
