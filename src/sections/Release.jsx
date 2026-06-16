import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../hooks/useContent';

const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetDate) return;
    const calculate = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
};

const CountdownUnit = ({ value, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 min-w-[72px] text-center shadow-inner">
      <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">{pad(value)}</span>
    </div>
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
  </div>
);

const Release = () => {
  const { content } = useContent();
  const release = content?.release;
  const timeLeft = useCountdown(release?.releaseDate);

  if (!release?.enabled) return null;

  const isReleased =
    timeLeft !== null &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <section id="release" className="bg-zinc-950 py-24 px-6 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-700/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 order-2 lg:order-1"
          >
            <span className="inline-block text-xs font-bold text-purple-400 uppercase tracking-widest border border-purple-500/40 px-4 py-1.5 rounded-full bg-purple-500/10">
              {isReleased ? 'Out Now' : 'Coming Soon'}
            </span>

            {release.subtitle && (
              <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em]">
                {release.subtitle}
              </p>
            )}

            <h2 className="text-5xl md:text-7xl font-bold text-white leading-none tracking-tighter">
              {release.title || 'New Release'}
            </h2>

            {release.description && (
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                {release.description}
              </p>
            )}

            {/* Countdown */}
            {!isReleased && timeLeft && (
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Releasing In
                </p>
                <div className="flex gap-3 md:gap-4">
                  <CountdownUnit value={timeLeft.days} label="Days" />
                  <div className="text-2xl font-bold text-zinc-700 self-center pb-5">:</div>
                  <CountdownUnit value={timeLeft.hours} label="Hours" />
                  <div className="text-2xl font-bold text-zinc-700 self-center pb-5">:</div>
                  <CountdownUnit value={timeLeft.minutes} label="Mins" />
                  <div className="text-2xl font-bold text-zinc-700 self-center pb-5">:</div>
                  <CountdownUnit value={timeLeft.seconds} label="Secs" />
                </div>
              </div>
            )}

            {isReleased && (
              <p className="text-purple-400 font-bold text-sm uppercase tracking-widest">
                Available Now — Listen Everywhere
              </p>
            )}

            {release.buttonUrl && (
              <a
                href={release.buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.03] active:scale-100"
              >
                {release.buttonLabel || 'Buy / Stream'}
              </a>
            )}
          </motion.div>

          {/* Right: Album Art */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-3xl scale-95 translate-y-6" />
              <img
                src={release.albumArt || 'https://placehold.co/600x600/111111/FFFFFF?text=Album+Art'}
                alt={release.albumArtAlt || release.title || 'Album Art'}
                title={release.albumArtTitle || release.title || undefined}
                width="600"
                height="600"
                loading="lazy"
                decoding="async"
                className="relative w-full aspect-square object-cover rounded-2xl shadow-2xl shadow-purple-900/40 border border-zinc-800"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Release;
