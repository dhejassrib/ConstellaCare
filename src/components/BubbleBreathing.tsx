import { useState, useEffect, useRef } from 'react';
import { Wind, Play, RotateCcw, Award } from 'lucide-react';

interface BubbleBreathingProps {
  onComplete: () => void;
}

export default function BubbleBreathing({ onComplete }: BubbleBreathingProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [starEarned, setStarEarned] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    setPhase('inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
    setStarEarned(false);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Phase transition!
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') {
              return 'hold';
            } else if (currentPhase === 'hold') {
              return 'exhale';
            } else {
              // exhaled completed, advance cycle
              setCyclesCompleted((c) => {
                const nextC = c + 1;
                if (nextC >= 3 && !starEarned) {
                  onComplete();
                  setStarEarned(true);
                  setIsActive(false);
                }
                return nextC;
              });
              return 'inhale';
            }
          });
          return 4; // Reset to 4s
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, starEarned]);

  const handleStop = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Compute CSS sizing scale and color based on breathing phase
  const getBubbleScaleClass = () => {
    if (phase === 'inhale') return 'scale-135 bg-teal-300/40 dark:bg-teal-500/30 border-teal-400 ring-teal-400/20';
    if (phase === 'hold') return 'scale-135 bg-purple-300/40 dark:bg-purple-500/30 border-purple-400 ring-rose-400/30 animate-pulse';
    if (phase === 'exhale') return 'scale-100 bg-indigo-300/30 dark:bg-indigo-500/20 border-indigo-400 ring-indigo-400/10';
    return 'scale-100 bg-pink-100/30 dark:bg-slate-800 border-purple-200 dark:border-slate-700';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      
      {/* 🫧 The Breathing Orb Plate */}
      <div className="relative w-48 h-48 flex items-center justify-center my-6">
        {/* Glow halo */}
        <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-[4s] ${
          phase === 'inhale' ? 'bg-teal-400 scale-125' : 
          phase === 'hold' ? 'bg-purple-400 scale-135' : 
          phase === 'exhale' ? 'bg-indigo-400 scale-100' : 'bg-pink-300 scale-90'
        }`} />

        {/* Core Bubble */}
        <div className={`w-32 h-32 rounded-full border-2 ring-12 transition-all duration-[4000ms] cubic-bezier(0.4, 0, 0.2, 1) flex flex-col items-center justify-center ${getBubbleScaleClass()}`}>
          {phase === 'idle' ? (
            <Wind className="w-8 h-8 text-purple-500 dark:text-purple-400 animate-pulse" />
          ) : (
            <div className="text-center">
              <span className="text-3xl font-extrabold font-mono text-slate-800 dark:text-slate-100 leading-none">
                {secondsLeft}s
              </span>
              <span className="text-[9px] uppercase tracking-widest font-mono text-slate-600 dark:text-slate-400 block mt-1">
                {phase}
              </span>
            </div>
          )}
        </div>

        {/* Ambient Orbit Circle */}
        {isActive && (
          <div className="absolute w-[180px] h-[180px] border border-dashed border-purple-300/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        )}
      </div>

      <div className="text-center max-w-xs mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 block">
          {phase === 'idle' ? 'BUBBLE GROUNDING' : `PHASE: ${phase.toUpperCase()}`}
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {phase === 'idle' && 'Follow the bubble. Breathe in, hold, then breathe out slowly.'}
          {phase === 'inhale' && 'Expand your chest slowly. Fill with clinical oxygen.'}
          {phase === 'hold' && 'Dwell in suspended comfort. Unclench your mouth.'}
          {phase === 'exhale' && 'Release all accumulated stress. Drop your shoulders.'}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          {!isActive ? (
            <button
              onClick={() => setIsActive(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold select-none text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md hover:shadow-purple-500/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" /> Start Breathing Cycle
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          )}
        </div>

        {/* Star accumulation count */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 py-1 px-3.5 rounded-full border border-slate-100 dark:border-slate-800/80 mt-1">
          <Award className="w-3.5 h-3.5 text-pink-500" />
          <span>CYCLES: {cyclesCompleted} / 3 TO UNLOCK ALPHA STAR</span>
        </div>

        {starEarned && (
          <span className="text-[10px] font-extrabold text-emerald-500 animate-bounce block mt-1">
            ✦ SUCCESS! Consellation aligned. Quiet breathing award appended.
          </span>
        )}
      </div>
    </div>
  );
}
