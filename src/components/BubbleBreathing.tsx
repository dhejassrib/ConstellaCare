import { useEffect, useRef, useState } from 'react';
import { Wind, Play, RotateCcw, Award } from 'lucide-react';

interface BubbleBreathingProps {
  onComplete: () => void;
}

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const TOTAL_CYCLES = 3;
const PHASE_DURATION = 4;

export default function BubbleBreathing({ onComplete }: BubbleBreathingProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATION);
  const [cycleNumber, setCycleNumber] = useState(1);
  const [starEarned, setStarEarned] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<Phase>('idle');

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!isActive) {
      setPhase('idle');
      setSecondsLeft(PHASE_DURATION);
      return;
    }

    setPhase('inhale');
    setSecondsLeft(PHASE_DURATION);
    setCycleNumber(1);
    setStarEarned(false);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        const currentPhase = phaseRef.current;

        if (currentPhase === 'inhale') {
          setPhase('hold');
          return PHASE_DURATION;
        }

        if (currentPhase === 'hold') {
          setPhase('exhale');
          return PHASE_DURATION;
        }

        if (currentPhase === 'exhale') {
          setCycleNumber((prevCycle) => {
            const nextCycle = prevCycle + 1;

            if (nextCycle > TOTAL_CYCLES) return prevCycle;

            if (nextCycle === TOTAL_CYCLES) {
              setStarEarned(true);
              setPhase('idle');

              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }

              setTimeout(() => {
                onComplete();
                setIsActive(false);
              }, 0);
            } else {
              setPhase('inhale');
              setSecondsLeft(PHASE_DURATION);
            }

            return nextCycle;
          });

          return PHASE_DURATION;
        }

        return PHASE_DURATION;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, onComplete]);

  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsActive(false);
    setPhase('idle');
    setSecondsLeft(PHASE_DURATION);
    setCycleNumber(1);
    setStarEarned(false);
  };

  const getBubbleScaleClass = () => {
    if (phase === 'inhale') return 'scale-150 bg-teal-300/40 dark:bg-teal-500/30 border-teal-400 ring-teal-400/20';
    if (phase === 'hold') return 'scale-150 bg-purple-300/40 dark:bg-purple-500/30 border-purple-400 ring-purple-400/30';
    if (phase === 'exhale') return 'scale-100 bg-indigo-300/30 dark:bg-indigo-500/20 border-indigo-400 ring-indigo-400/10';
    return 'scale-100 bg-pink-100/30 dark:bg-slate-800 border-purple-200 dark:border-slate-700';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-48 flex items-center justify-center my-6">
        <div
          className={`absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-[4s] ${
            phase === 'inhale'
              ? 'bg-teal-400 scale-125'
              : phase === 'hold'
              ? 'bg-purple-400 scale-135'
              : phase === 'exhale'
              ? 'bg-indigo-400 scale-100'
              : 'bg-pink-300 scale-90'
          }`}
        />

        <div className={`w-32 h-32 rounded-full border-2 ring-12 transition-all duration-[4000ms] ease-in-out flex flex-col items-center justify-center ${getBubbleScaleClass()}`}>
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

        {isActive && (
          <div
            className="absolute w-[180px] h-[180px] border border-dashed border-purple-300/30 rounded-full animate-spin"
            style={{ animationDuration: '20s' }}
          />
        )}
      </div>

      <div className="text-center max-w-xs mb-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 block">
          {phase === 'idle' ? 'BUBBLE GROUNDING' : `PHASE: ${phase.toUpperCase()}`}
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {phase === 'idle' && 'Follow the bubble. Breathe in, hold, then breathe out slowly.'}
          {phase === 'inhale' && 'Breathe in slowly through your nose.'}
          {phase === 'hold' && 'Hold your breath gently.'}
          {phase === 'exhale' && 'Breathe out slowly through your mouth.'}
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

        <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 py-1 px-3.5 rounded-full border border-slate-100 dark:border-slate-800/80 mt-1">
          <span>Complete 3 cycles for a full reset</span>
        </div>

        {starEarned && (
          <span className="text-[10px] font-extrabold text-emerald-500 animate-bounce block mt-1">
            ✦ Breathing exercise completed successfully.
          </span>
        )}
      </div>
    </div>
  );
}