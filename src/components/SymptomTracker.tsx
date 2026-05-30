import { useState } from 'react';
import { Checklist } from './AppointmentCopilot'; // we can just import or define locally
import { SYMPTOMS } from '../data';
import { Sparkles, Save, Heart, Info } from 'lucide-react';

interface SymptomTrackerProps {
  onLogSymptoms: (log: Record<string, number>) => void;
  initialLog?: Record<string, number>;
}

export default function SymptomTracker({ onLogSymptoms, initialLog = {} }: SymptomTrackerProps) {
  const [log, setLog] = useState<Record<string, number>>(initialLog);
  const [isSaved, setIsSaved] = useState(false);

  const handleRate = (symptom: string, value: number) => {
    setLog(prev => ({ ...prev, [symptom]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onLogSymptoms(log);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  // Helper to determine dot background color based on level
  const getDotStyle = (active: boolean, level: number) => {
    if (!active) return 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800';
    
    if (level <= 1) return 'bg-emerald-500 border-emerald-500 text-white';
    if (level <= 3) return 'bg-amber-500 border-amber-500 text-white';
    return 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/20';
  };

  const completedCount = Object.keys(log).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2.5xl p-6 shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
            Health Check-In Tracker
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Tracking severity (0 = None, 5 = Severe) generates analytical medical reports.
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 font-mono text-xs px-2.5 py-1 rounded-full border border-purple-100/30">
          Logged {completedCount} / {SYMPTOMS.length}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {SYMPTOMS.map((symptom) => {
          const rating = log[symptom] ?? -1;
          return (
            <div key={symptom} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1.5">
              <div className="flex items-center gap-2.5 sm:w-44">
                <div className={`w-2 h-2 rounded-full ${rating > 3 ? 'bg-rose-500 animate-ping' : rating > 1 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{symptom}</span>
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-1.5 flex-1 max-w-sm">
                {[0, 1, 2, 3, 4, 5].map((level) => {
                  const isActive = rating === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleRate(symptom, level)}
                      className={`w-9 h-9 text-xs font-bold rounded-full border transition-all duration-200 cursor-pointer flex items-center justify-center ${getDotStyle(isActive, level)}`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:block text-xs font-bold text-right w-16">
                {rating === 0 && <span className="text-emerald-500">None</span>}
                {rating === 1 && <span className="text-emerald-400">Mild</span>}
                {rating === 2 && <span className="text-amber-500">Tolerable</span>}
                {rating === 3 && <span className="text-amber-600">Moderate</span>}
                {rating === 4 && <span className="text-rose-400">Severe</span>}
                {rating === 5 && <span className="text-rose-600">Extreme</span>}
                {rating === -1 && <span className="text-slate-300 dark:text-slate-600">Unrated</span>}
              </div>
            </div>
          );
        })}
      </div>

      {completedCount > 0 && (
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>These ratings automatically form the "Emotional Sky" and sync with your Appointment Copilot checklist.</span>
          </div>
          <button
            onClick={handleSave}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs transition-all duration-300 border cursor-pointer ${
              isSaved 
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl shadow-purple-500/20 border-transparent'
            }`}
          >
            {isSaved ? (
              <>✦ Constellation Logs Synced ⭐</>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Today's Log ⭐
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
