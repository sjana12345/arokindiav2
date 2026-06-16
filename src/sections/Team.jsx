import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Twitter, Linkedin } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { cn } from '../utils/cn';

const Team = () => {
  const { content } = useContent();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const teamMembers = content?.team || [];
  const teamCategories = ['All', ...new Set(teamMembers.map(m => m.category))];

  const filteredMembers = teamMembers.filter(
    (member) => activeCategory === 'All' || member.category === activeCategory
  );

  return (
    <section id="team" className="bg-zinc-900 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Meet The Collective</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            The talented individuals who bring the magic to life, both on and off the stage.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {teamCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border',
                  activeCategory === cat
                    ? 'bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'border-zinc-800 text-gray-500 hover:text-white hover:border-zinc-600'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-800">
                  <img
                    src={member.image}
                    alt={member.name}
                    width="400"
                    height="500"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500">
                    <p className="text-purple-400 font-bold text-xs uppercase tracking-widest mb-2">
                      {member.category}
                    </p>
                    <h2 className="text-white text-2xl font-bold mb-1">{member.name}</h2>
                    <p className="text-white/90 font-medium mb-4">{member.role}</p>
                    
                    <p className="text-gray-200 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-4">
                      {member.bio}
                    </p>
                    
                    {/* Socials */}
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {member.social?.instagram && (
                        <a href={member.social.instagram} className="text-white hover:text-purple-500 transition-colors">
                          <Instagram size={20} />
                        </a>
                      )}
                      {member.social?.twitter && (
                        <a href={member.social.twitter} className="text-white hover:text-purple-500 transition-colors">
                          <Twitter size={20} />
                        </a>
                      )}
                      {member.social?.linkedin && (
                        <a href={member.social.linkedin} className="text-white hover:text-purple-500 transition-colors">
                          <Linkedin size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Team;
