import { useState, useEffect } from 'react';
import { Star, CheckCircle, Info, Trophy, Compass, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface MilestoneSpec {
  id: string;
  label: string;
  desc: string;
  category: string;
  icon: string;
}

interface HealthMilestonesProps {
  theme: 'light' | 'dark';
  onStarEarned: (label: string) => void;
}

const DEFAULT_MILESTONES: MilestoneSpec[] = [
  {
    id: 'physio',
    label: 'Completed Physiotherapy / Rehab Drills',
    desc: 'Performed full stretching loops, physical drills, or range of joint motion exercises today.',
    category: 'rehab',
    icon: '🏃'
  },
  {
    id: 'treatment',
    label: 'Finished Prescribed Treatment / Pill Cycle',
    desc: 'Checked off critical medical dosage schedules or clinical capsule metrics.',
    category: 'medical',
    icon: '💊'
  },
  {
    id: 'steps',
    label: 'Walked 5,000 Steps Daily target',
    desc: 'Maintained core cardiovascular and motor circulation by pacing safe strides.',
    category: 'exercise',
    icon: '🚶'
  },
  {
    id: 'appointment',
    label: 'Attended Scheduled Care Consultation',
    desc: 'Met with medical leads or specialists to audit active therapeutic recovery tracks.',
    category: 'consult',
    icon: '🩺'
  },
  {
    id: 'grounding',
    label: 'Completed Mindful Grounding Breath',
    desc: 'Sustained the expanding air orbit loops using the bubble breathing simulator.',
    category: 'calm',
    icon: '🫧'
  },
  {
    id: 'hydration',
    label: 'Filled Daily Hydration Parameters',
    desc: 'Maintained proper chemical and blood density by drinking 2.5L water with electrolytes.',
    category: 'medical',
    icon: '💧'
  }
];

export default function HealthMilestones({ theme, onStarEarned }: HealthMilestonesProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    const cached = localStorage.getItem('constella-completed-milestones');
    if (cached) return JSON.parse(cached);
    return {
      physio: false,
      treatment: false,
      steps: false,
      appointment: false,
      grounding: false,
      hydration: false
    };
  });

  useEffect(() => {
    localStorage.setItem('constella-completed-milestones', JSON.stringify(completed));
  }, [completed]);

  const handleToggle = (id: string, label: string) => {
    setCompleted(prev => {
      const isNewComplete = !prev[id];
      if (isNewComplete) {
        onStarEarned(label);
        alert(`✦ Star aligned: "${label}" has been added as a permanent glowing checkpoint in your living sky! ⭐`);
      }
      return {
        ...prev,
        [id]: isNewComplete
      };
    });
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const percentage = Math.round((completedCount / DEFAULT_MILESTONES.length) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2.5xl p-6 shadow-xl transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 gap-4 text-left">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] block font-mono">STARS CONSTELLATION ENGINE</span>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mt-0.5">
            <Trophy className="w-5 h-5 text-amber-500 animate-pulse" />
            Health Milestones
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Record physical recoveries, steps, reviews, or treatment completions. Marking items aligns active stars in your mutual sky.
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/40 px-3.5 py-1.5 rounded-full border border-purple-500/10 text-center flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 font-mono uppercase">
            {completedCount} / {DEFAULT_MILESTONES.length} MAPPED ({percentage}%)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {DEFAULT_MILESTONES.map((milKey) => {
          const isDone = completed[milKey.id] ?? false;
          return (
            <div
              key={milKey.id}
              onClick={() => handleToggle(milKey.id, milKey.label)}
              className={`flex items-start justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
                isDone
                  ? 'bg-purple-500/5 dark:bg-[#110d24]/40 border-purple-500/20 shadow-sm opacity-85'
                  : 'bg-slate-50/20 dark:bg-transparent border-slate-150 dark:border-slate-850 hover:border-purple-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-lg border ${
                  isDone 
                    ? 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 shadow' 
                    : 'bg-slate-100/50 dark:bg-slate-950 border-slate-200 dark:border-slate-805 text-slate-400'
                }`}>
                  {milKey.icon}
                </div>

                <div>
                  <h4 className={`text-xs font-bold leading-none ${isDone ? 'line-through text-slate-450 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                    {milKey.label}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-450 mt-1 dark:text-slate-400 font-medium">
                    {milKey.desc}
                  </p>
                  
                  {isDone && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md font-mono text-[9px] font-bold bg-[#decfe6]/20 text-[#a855f7] uppercase tracking-wider">
                      ✦ Star Aligned successfully
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Star className={`w-5 h-5 transition-transform duration-300 ${isDone ? 'fill-yellow-400 text-yellow-400 scale-110 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'text-slate-350 dark:text-slate-700 hover:scale-105'}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/25 border border-purple-150/40 flex items-start gap-3 text-left">
        <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-[#2f2349] dark:text-[#decfe6]">
          These individual checkpoints are shared live between client dashboards and caregiver portals. Each accomplishment illuminates mutual coordinates so you can verify and celebrate recovery milestones simultaneously.
        </p>
      </div>

    </div>
  );
}
