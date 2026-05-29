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
    <div className="relative w-full aspect-video md:aspect-[2.2/1] rounded-2.5xl overflow-hidden bg-radial from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 shadow-2xl p-4">
      {/* 🔮 Background nebulas and rotating particles */}
      <div className="absolute inset-0 opacity-45 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-purple-700/20 blur-3xl animate-pulse duration-[8s]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-700/15 blur-3xl animate-pulse duration-[12s]" />
      </div>

      {/* Grid subtle stars */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none animate-custom-twinkle" />

      {/* Floating coordinates indicator */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-slate-500 tracking-wider">
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
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* 🌟 Star connection lines */}
          {stars.map((star, idx) => {
            // Find next stars to connect to
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
                strokeWidth={hoveredStar?.id === star.id || hoveredStar?.id === next.id ? 2.5 : 1}
                className="transition-all duration-500"
                strokeDasharray={star.category === 'calm' ? '4,4' : undefined}
              />
            ));
          })}

          {/* 🌟 Connected nodes */}
          {stars.map((star) => {
            const isLit = true; // All stars placed here are active logged milestones
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
                  className="fill-none stroke-purple-400/20 stroke-1 transition-all duration-500"
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
                  fill={star.category === 'mood' ? '#fda4af' : star.category === 'calm' ? '#67e8f9' : star.category === 'journal' ? '#d8b4fe' : '#93c5fd'}
                  filter="url(#glow)"
                  className="transition-all duration-300 opacity-80"
                />

                {/* Core bright star element */}
                <circle
                  cx={star.x * 10}
                  cy={star.y * 4.5}
                  r={3}
                  fill="#ffffff"
                  filter={isHovered ? 'url(#glow-high)' : ''}
                  className="transition-all duration-300"
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
              className="absolute bg-slate-900/95 border border-purple-500/30 text-white p-3 rounded-xl shadow-xl backdrop-blur-md pointer-events-none text-xs z-30 transition-all duration-300"
              style={{
                left: `${Math.min(85, Math.max(5, star.x))}%`,
                top: `${Math.min(75, Math.max(10, star.y + 12))}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-pink-400">✦</span>
                <span className="font-semibold">{star.label}</span>
              </div>
              <div className="font-mono text-[9px] text-slate-400">
                Lit: {star.timestamp} // {star.category.toUpperCase()}
              </div>
              <p className="text-[11px] text-slate-300 mt-1 max-w-[150px]">
                Earned during your emotional check-in. Constellation expanded!
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom specs */}
      <div className="absolute bottom-4 right-4 flex items-center gap-4 bg-slate-950/80 border border-slate-800/80 rounded-lg py-1 px-3 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-pink-400">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
          {stars.length} Stars Unlocked
        </div>
        <div className="text-slate-400">
          Hope Index: <span className="text-emerald-400 font-semibold">{73 + stars.length}%</span>
        </div>
      </div>
    </div>
  );
}
