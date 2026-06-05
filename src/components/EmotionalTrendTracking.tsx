import { useState } from 'react';
import { SymptomLog } from '../types';
import { INITIAL_SYMPTOMS_LOG } from '../data';
import { TrendingUp, Sparkles, CloudSun, Moon } from 'lucide-react';

interface EmotionalTrendTrackingProps {
  logs?: SymptomLog[];
}

export default function EmotionalTrendTracking({ logs = INITIAL_SYMPTOMS_LOG }: EmotionalTrendTrackingProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(
    new Date().getDay()
  );

  const jsDay = new Date().getDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const activeLog = selectedDayIndex !== null ? logs[selectedDayIndex] : null;

  const chartHeight = 160;
  const chartWidth = 540;
  
  const getCoordinates = (ratings: number[], width: number, height: number) => {
    const pointsCount = ratings.length;
    const paddingX = 40;
    const paddingY = 20;
    const stepX = (width - paddingX * 2) / (pointsCount - 1);
    
    return ratings.map((rating, index) => {
      const x = paddingX + index * stepX;
      const y = paddingY + ((5 - rating) / 5) * (height - paddingY * 2);
      return { x, y };
    });
  };

  const hopeRatings = logs.map(l => {
    const baseVal = 5 - Math.max(l.Anxiety, l.Pain);
    return Math.max(1, baseVal);
  });
  const physicalRatings = logs.map(l => Math.round((l.Fatigue + l.Nausea) / 2));

  const hopeCoords = getCoordinates(hopeRatings, chartWidth, chartHeight);
  const physicalCoords = getCoordinates(physicalRatings, chartWidth, chartHeight);

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
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
            <span className="text-slate-600 dark:text-slate-350">Hope Alignment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 dark:bg-pink-400" />
            <span className="text-slate-600 dark:text-slate-350">Physical Distress</span>
          </div>
        </div>
      </div>

      {/* Cosmic SVG Star Chart Canvas */}
      <div className="relative w-full overflow-x-auto select-none py-2 bg-[#FAF8FD] dark:bg-slate-950 border border-purple-200/60 dark:border-slate-850 rounded-2xl shadow-inner max-w-full transition-all duration-500">
        
        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-40 dark:opacity-15 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        <svg className="w-full min-w-[540px] h-44 position-relative z-10" viewBox={`0 0 ${chartWidth} ${chartHeight}`} fill="none">
          <line x1="30" y1="20" x2={chartWidth - 30} y2="20" stroke="currentColor" className="text-purple-400/20 dark:text-white/5" strokeDasharray="3,3" />
          <line x1="30" y1={chartHeight / 2} x2={chartWidth - 30} y2={chartHeight / 2} stroke="currentColor" className="text-purple-400/20 dark:text-white/5" strokeDasharray="3,3" />
          <line x1="30" y1={chartHeight - 20} x2={chartWidth - 30} y2={chartHeight - 20} stroke="currentColor" className="text-purple-400/20 dark:text-white/5" />

          {/* Lines */}
          <path d={hopePath} fill="none" stroke="#06b6d4" strokeWidth="2.5" className="dark:stroke-[#22d3ee]" />
          <path d={physicalPath} fill="none" stroke="#ec4899" strokeWidth="2" className="dark:stroke-[#f472b6]" strokeDasharray="4,4" />

          {/* Hope Nodes */}
          {hopeCoords.map((p, idx) => (
            <g 
              key={`hope-${idx}`} 
              className="cursor-pointer" 
              onClick={() => setSelectedDayIndex(idx)}
              onMouseEnter={() => setSelectedDayIndex(idx)}
            >
              <circle cx={p.x} cy={p.y} r={selectedDayIndex === idx ? 8 : 4.5} fill="#06b6d4" className="dark:fill-[#22d3ee] transition-all duration-300" />
              <circle cx={p.x} cy={p.y} r={selectedDayIndex === idx ? 3 : 1.5} fill="#ffffff" />
            </g>
          ))}

          {/* Physical Nodes */}
          {physicalCoords.map((p, idx) => (
            <g 
              key={`physical-${idx}`} 
              className="cursor-pointer" 
              onClick={() => setSelectedDayIndex(idx)}
              onMouseEnter={() => setSelectedDayIndex(idx)}
            >
              <circle cx={p.x} cy={p.y} r={selectedDayIndex === idx ? 6.5 : 3.5} fill="#ec4899" className="dark:fill-[#f472b6] transition-all duration-300" />
              <circle cx={p.x} cy={p.y} r={selectedDayIndex === idx ? 2 : 1} fill="#ffffff" />
            </g>
          ))}
        </svg>

        {/* Days label row */}
        <div className="flex justify-between px-10 pt-1 font-mono text-[9px] max-w-full min-w-[540px] relative z-20">
          {logs.map((l, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedDayIndex(idx)}
              className={`font-semibold cursor-pointer py-1 px-2 rounded-xl transition-all duration-200 ${
                selectedDayIndex === idx 
                  ? 'bg-purple-600 text-white font-bold shadow-sm' 
                  : 'text-purple-900/60 dark:text-slate-400 hover:text-purple-900 dark:hover:text-slate-200'
              }`}
            >
              {l.date}
              {idx === todayIndex && <span className="ml-1 text-cyan-600 dark:text-cyan-400 font-bold">(Today)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Highlights Panels — FIXED: Overridden with native inline style properties to kill the gray mask backgrounds */}
      {activeLog && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-800 dark:text-slate-100">
          
          {/* Left Card: Sky Horizon (Forced Pastel Cyan) */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: '#e0f7fa' }}>
              <CloudSun className="w-5 h-5 stroke-[2.5]" style={{ color: '#00838f' }} />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono text-slate-400 block tracking-wide">Sky Horizon</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{activeLog.Anxiety > 3 ? '☁️ Thick Cloud Cover' : '✨ High Visibility'}</span>
            </div>
          </div>

          {/* Center Card: Hope Alignment (Baseline Purple) */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: '#f3e5f5' }}>
              <Sparkles className="w-5 h-5 stroke-[2.5]" style={{ color: '#6a1b9a' }} />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono text-slate-400 block tracking-wide">Hope Alignment</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{5 - Math.max(activeLog.Anxiety, activeLog.Pain)} / 5 (Resilient)</span>
            </div>
          </div>

          {/* Right Card: Physical Stress Index (Forced Pastel Pink) */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: '#fce4ec' }}>
              <Moon className="w-5 h-5 stroke-[2.5]" style={{ color: '#c2185b' }} />
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono text-slate-400 block tracking-wide">Physical Stress Index</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Level {Math.round((activeLog.Fatigue + activeLog.Nausea) / 2)} / 5 (Moderate)</span>
            </div>
          </div>
          
        </div>
      )}

      <div className="mt-5 border-t border-slate-150/50 dark:border-slate-800/60 pt-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-4.5 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1">☁️ Anxiety: <b className="text-slate-700 dark:text-slate-300">{activeLog?.Anxiety}/5</b></span>
          <span className="flex items-center gap-1">✨ Hope: <b className="text-slate-700 dark:text-slate-300">Increasing</b></span>
          <span className="flex items-center gap-1">🌙 Sleep: <b className="text-slate-700 dark:text-slate-300">Unstable</b></span>
        </div>
      </div>
    </div>
  );
}