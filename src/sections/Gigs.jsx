import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { cn } from '../utils/cn';

const Gigs = () => {
  const { content } = useContent();
  const [filter, setFilter] = useState('all');

  const gigsData = content?.gigs || [];

  const filteredGigs = gigsData.filter((gig) =>
    filter === 'all' ? true : gig.status === filter
  );

  return (
    <section id="gigs" className="bg-black py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Tour & Gigs</h2>
            <p className="text-gray-400 text-lg">Catch us live at these upcoming and past events.</p>
          </div>

          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {['all', 'upcoming', 'past'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-6 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-all',
                  filter === f
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGigs.map((gig, index) => (
              <motion.div
                key={gig.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative overflow-hidden bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-purple-500/50 transition-colors flex flex-col md:flex-row items-center"
              >
                {/* Poster Thumbnail */}
                <div className="w-full md:w-48 h-48 flex-shrink-0 overflow-hidden">
                  <img
                    src={gig.image}
                    alt={gig.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-8 flex-grow flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-purple-500 font-bold text-xs uppercase tracking-widest">
                      <Calendar size={14} />
                      {gig.date}
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] border",
                        gig.status === 'upcoming' ? "border-green-500/50 text-green-500 bg-green-500/10" : "border-zinc-700 text-zinc-500"
                      )}>
                        {gig.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {gig.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin size={14} />
                      {gig.location}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                      {gig.type}
                    </span>
                    {gig.status === 'upcoming' && (
                      <button className="p-2 rounded-full bg-purple-600/10 text-purple-500 hover:bg-purple-600 hover:text-white transition-all">
                        <ExternalLink size={20} />
                      </button>
                    )}
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

export default Gigs;
