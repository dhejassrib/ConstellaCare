import { useState, useMemo } from 'react';
import { ConstellationStar } from '../types';

interface LivingConstellationProps {
  totalStars: number;
  stars: ConstellationStar[];
  onSelectStar?: (star: ConstellationStar) => void;
}

export default function LivingConstellation({ totalStars, stars, onSelectStar }: LivingConstellationProps) {
  const [hoveredStar, setHoveredStar] = useState<ConstellationStar | null>(null);

  // Default coordinate set for visual lines
  const defaultLines = useMemo(() => {
    return [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], // perimeter
      [0, 4], [1, 5], [2, 6], [3, 7] // cross links
    ];
  }, []);

  return (
    // FIXED: Swapped hardcoded slate/indigo background tokens with adaptive tailwind styling to support light layout glows
    <div className="relative w-full aspect-video md:aspect-[2.2/1] rounded-2.5xl overflow-hidden transition-all duration-500 bg-gradient-to-tr from-[#ede4f9] via-[#f5f0fb] to-white dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 border border-purple-200/50 dark:border-slate-800 shadow-xl dark:shadow-2xl p-4 text-left">
      
      {/* 🔮 Background nebulas and rotating particles */}
      <div className="absolute inset-0 opacity-45 dark:opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-purple-400/20 dark:bg-purple-700/20 blur-3xl animate-pulse duration-[8s]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-300/20 dark:bg-pink-700/15 blur-3xl animate-pulse duration-[12s]" />
      </div>

      {/* Grid subtle stars */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none animate-custom-twinkle" />

      {/* Floating coordinates indicator */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-purple-700/60 dark:text-slate-500 tracking-wider font-bold">
        CORE RESILIENT RESIDENCE // STAGE: {Math.max(1, Math.floor(totalStars / 5))} // SECTOR_LIT
      </div>

      {/* Core Constellation Plate */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg className="w-full h-full min-h-[220px]" viewBox="0 0 1000 450" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-high" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* 🌟 Star connection lines */}
          {stars.map((star, idx) => {
            const connections = defaultLines
              .filter(([from]) => from === idx)
              .map(([, to]) => stars[to])
              .filter(Boolean);

            return connections.map((next, cIdx) => (
              <line
                key={`line-${star.id}-${cIdx}`}
                x1={star.x * 10}
                y1={star.y * 4.5}
                x2={next.x * 10}
                y2={next.y * 4.5}
                stroke="url(#lineGrad)"
                strokeWidth={hoveredStar?.id === star.id || hoveredStar?.id === next.id ? 2.8 : 1.2}
                className="transition-all duration-500"
                strokeDasharray={star.category === 'calm' ? '4,4' : undefined}
              />
            ));
          })}

          {/* 🌟 Connected nodes */}
          {stars.map((star) => {
            const isHovered = hoveredStar?.id === star.id;

            return (
              <g
                key={star.id}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => onSelectStar?.(star)}
                className="cursor-pointer"
              >
                {/* Outermost breathing orbit ring */}
                <circle
                  cx={star.x * 10}
                  cy={star.y * 4.5}
                  r={isHovered ? 24 : 14}
                  className="fill-none stroke-purple-500/30 dark:stroke-purple-400/20 stroke-1 transition-all duration-500"
                  style={{
                    transformOrigin: `${star.x * 10}px ${star.y * 4.5}px`,
                    animation: isHovered ? 'spin 12s linear infinite' : 'pulse 3s ease-in-out infinite'
                  }}
                />

                {/* Glowing glow disk */}
                <circle
                  cx={star.x * 10}
                  cy={star.y * 4.5}
                  r={isHovered ? 12 : 6}
                  fill={star.category === 'mood' ? '#f43f5e' : star.category === 'calm' ? '#06b6d4' : star.category === 'journal' ? '#a855f7' : '#3b82f6'}
                  filter="url(#glow)"
                  className="transition-all duration-300 opacity-90"
                />

                {/* Core bright star element */}
                <circle
                  cx={star.x * 10}
                  cy={star.y * 4.5}
                  r={3.5}
                  fill="#ffffff"
                  filter={isHovered ? 'url(#glow-high)' : ''}
                  className="transition-all duration-300 shadow-sm"
                />

                {/* Orbiting particles for primary star nodes */}
                {isHovered && (
                  <circle
                    cx={star.x * 10 + 16 * Math.cos(2)}
                    cy={star.y * 4.5 + 16 * Math.sin(2)}
                    r={2}
                    fill="#ffffff"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* 🏷️ Interactive Overlays for hover effects */}
        {stars.map((star) => {
          const isHovered = hoveredStar?.id === star.id;
          if (!isHovered) return null;

          return (
            <div
              key={`label-${star.id}`}
              className="absolute bg-white/95 dark:bg-slate-900/95 border border-purple-300 dark:border-purple-500/30 text-slate-800 dark:text-white p-3 rounded-xl shadow-xl backdrop-blur-md pointer-events-none text-xs z-30 transition-all duration-300 text-left"
              style={{
                left: `${Math.min(85, Math.max(5, star.x))}%`,
                top: `${Math.min(75, Math.max(10, star.y + 12))}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-pink-500 font-bold">✦</span>
                <span className="font-extrabold text-[#1e133a] dark:text-white">{star.label}</span>
              </div>
              <div className="font-mono text-[9px] text-purple-700/60 dark:text-slate-400 font-bold">
                Lit: {star.timestamp} // {star.category.toUpperCase()}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 max-w-[150px] leading-normal font-medium">
                Earned during your emotional check-in. Constellation expanded!
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom specs indicators panel */}
      <div className="absolute bottom-4 right-4 flex items-center gap-4 bg-white/80 dark:bg-slate-950/80 border border-purple-100 dark:border-slate-800/80 rounded-xl py-1 px-3 font-mono text-[10px] shadow-sm">
        <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 dark:bg-pink-400 name-dot animate-pulse" />
          {stars.length} Stars Unlocked
        </div>
        <div className="text-purple-900/70 dark:text-slate-400 font-bold">
          Hope Index: <span className="text-emerald-600 dark:text-emerald-400 font-black">{73 + stars.length}%</span>
        </div>
      </div>
    </div>
  );
}