import { useState } from 'react';
import { SymptomLog } from '../types';
import { INITIAL_SYMPTOMS_LOG } from '../data';
import { AreaChart, TrendingUp, Sparkles, CloudSun, Moon, ShieldCheck } from 'lucide-react';

interface EmotionalTrendTrackingProps {
  logs?: SymptomLog[];
}

export default function EmotionalTrendTracking({ logs = INITIAL_SYMPTOMS_LOG }: EmotionalTrendTrackingProps) {
  // const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(6); // Default Sunday
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(
    new Date().getDay()
  );

  const jsDay = new Date().getDay();

  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

  // const todayIndex = new Date().getDay(); 
  // 0 = Sunday, 1 = Monday, ... 6 = Saturday

  const activeLog = selectedDayIndex !== null ? logs[selectedDayIndex] : null;

  // Let's draw an SVG connected graph represent the "Emotional Sky"
  const chartHeight = 160;
  const chartWidth = 540;
  
  // Normalize symptom points (0-5 scale) to SVG Y coordinates (high value = lower physically, i.e., "darker sky")
  const getCoordinates = (ratings: number[], width: number, height: number) => {
    const pointsCount = ratings.length;
    const paddingX = 40;
    const paddingY = 20;
    const stepX = (width - paddingX * 2) / (pointsCount - 1);
    
    return ratings.map((rating, index) => {
      const x = paddingX + index * stepX;
      // Reverse Y: rating of 5 is high distress (bottom of screen "stormy", Y is large). rating of 0 is high peace (top of screen "radiant", Y is small).
      const y = paddingY + ((5 - rating) / 5) * (height - paddingY * 2);
      return { x, y };
    });
  };

  // Build points for Nausea vs Hope
  const hopeRatings = logs.map(l => {
    // Inverse pain and sleep to represent "Hope / Emotional Ease" (5 - pain)
    const baseVal = 5 - Math.max(l.Anxiety, l.Pain);
    return Math.max(1, baseVal);
  });
  const physicalRatings = logs.map(l => Math.round((l.Fatigue + l.Nausea) / 2));

  const hopeCoords = getCoordinates(hopeRatings, chartWidth, chartHeight);
  const physicalCoords = getCoordinates(physicalRatings, chartWidth, chartHeight);

  // SVG Line path Builders
  const buildPath = (coords: {x: number, y: number}[]) => {
    return coords.reduce((path, p, idx) => {
      if (idx === 0) return `M ${p.x} ${p.y}`;
      return `${path} L ${p.x} ${p.y}`;
    }, '');
  };

  const hopePath = buildPath(hopeCoords);
  const physicalPath = buildPath(physicalCoords);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2.5xl p-6 shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Your Emotional Sky Chart
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing your oncology resilience index. Nodes represent stellar check-in times.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-600 dark:text-slate-350">Hope Alignment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
            <span className="text-slate-600 dark:text-slate-350">Physical Distress</span>
          </div>
        </div>
      </div>

      {/* 🌌 Cosmic SVG Star Chart Canvas */}
      <div className="relative w-full overflow-x-auto select-none py-2 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 border border-slate-850 rounded-2xl shadow-inner max-w-full">
        {/* Background stars */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        <svg className="w-full min-w-[540px] h-44" viewBox={`0 0 ${chartWidth} ${chartHeight}`} fill="none">
          {/* Subtle horizontal grid separators */}
          <line x1="30" y1="20" x2={chartWidth - 30} y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />
          <line x1="30" y1={chartHeight / 2} x2={chartWidth - 30} y2={chartHeight / 2} stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />
          <line x1="30" y1={chartHeight - 20} x2={chartWidth - 30} y2={chartHeight - 20} stroke="rgba(255,255,255,0.04)" />

          {/* Hope alignment pathway */}
          <path d={hopePath} fill="none" stroke="#22d3ee" strokeWidth="2" filter="url(#glow)" />
          {/* Physical distress pathway */}
          <path d={physicalPath} fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,4" />

          {/* Hope Constellation Node stars */}
          {hopeCoords.map((p, idx) => (
            <g 
              key={`hope-${idx}`} 
              className="cursor-pointer" 
              onClick={() => setSelectedDayIndex(idx)}
              onMouseEnter={() => setSelectedDayIndex(idx)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={selectedDayIndex === idx ? 8 : 4}
                fill="#22d3ee"
                className="transition-all duration-300"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={selectedDayIndex === idx ? 3 : 1.5}
                fill="#ffffff"
              />
            </g>
          ))}

          {/* Physical Constellation Node stars */}
          {physicalCoords.map((p, idx) => (
            <g 
              key={`physical-${idx}`} 
              className="cursor-pointer" 
              onClick={() => setSelectedDayIndex(idx)}
              onMouseEnter={() => setSelectedDayIndex(idx)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={selectedDayIndex === idx ? 6 : 3}
                fill="#f472b6"
                className="transition-all duration-300"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={selectedDayIndex === idx ? 2 : 1}
                fill="#ffffff"
              />
            </g>
          ))}
        </svg>

        {/* Days label row */}
        <div className="flex justify-between px-10 pt-1 font-mono text-[9px] text-slate-500 max-w-full min-w-[540px]">
          {logs.map((l, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`font-semibold cursor-pointer py-1 px-1.5 rounded transition ${selectedDayIndex === idx ? 'bg-purple-900/40 text-slate-200 font-bold border border-purple-500/30' : 'text-slate-550'}`}
            >
              {l.date}
              {idx === todayIndex && (
                <span className="ml-1 text-cyan-400">
                  (Today)
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ☁️ Identified emotional weather highlights */}
      {activeLog && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Day overview */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-cyan-200 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-sm">
              <CloudSun className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono text-slate-400 block tracking-wide">Sky Horizon</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {activeLog.Anxiety > 3 ? '☁️ Thick Cloud Cover' : '✨ High Visibility'}
              </span>
            </div>
          </div>

          {/* Hope rating */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-850/20 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono text-slate-400 block tracking-wide">Hope Alignment</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {5 - Math.max(activeLog.Anxiety, activeLog.Pain)} / 5 (Resilient)
              </span>
            </div>
          </div>

          {/* Physical distress rating */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 flex items-center justify-center flex-shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono text-slate-400 block tracking-wide">Physical Stress Index</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Level {Math.round((activeLog.Fatigue + activeLog.Nausea) / 2)} / 5 (Moderate)
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Underneath bullet metrics */}
      <div className="mt-5 border-t border-slate-150/50 dark:border-slate-800/60 pt-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-4.5 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1">☁️ Anxiety: <b className="text-slate-700 dark:text-slate-300">{activeLog?.Anxiety}/5</b></span>
          <span className="flex items-center gap-1">✨ Hope: <b className="text-slate-700 dark:text-slate-300">Increasing</b></span>
          <span className="flex items-center gap-1">🌙 Sleep: <b className="text-slate-700 dark:text-slate-300">Unstable</b></span>
        </div>
        {/* <div className="flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Biometric validation completed successfully.</span>
        </div> */}
      </div>

    </div>
  );
}
