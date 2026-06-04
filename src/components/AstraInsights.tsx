import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, RotateCw } from 'lucide-react';

interface AstraInsightsProps {
  starsCount: number;
  recentSymptoms: Record<string, number>;
  lastAction: string;
  onTriggerAction: (actionType: 'copilot' | 'breath' | 'reflection' | 'none') => void;
}

export default function AstraInsights({ starsCount, recentSymptoms, lastAction, onTriggerAction }: AstraInsightsProps) {
  const [insightData, setInsightData] = useState<{
    insight: string;
    empathy: string;
    actionText: string;
    actionType: 'copilot' | 'breath' | 'reflection' | 'none';
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsight = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/astra/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          starsCount,
          recentSymptoms,
          recentMoods: ['stable', 'anxious'],
          lastAction
        })
      });
      if (response.ok) {
        const data = await response.json();
        setInsightData(data);
      }
    } catch (e) {
      console.error("Failed to load Astra AI Insight:", e);
      // Fallback
      setInsightData({
        insight: "✨ Astra noticed: Your anxiety tends to rise before oncologist check-ins.",
        empathy: "It is deeply human to feel anticipation. Let's ground your baseline before you speak with Dr. Evelyn Moss.",
        actionText: "Would you like help preparing smart, comfortable questions for tomorrow's visit?",
        actionType: 'copilot'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, [starsCount, lastAction]);

  return (
    <div className="relative overflow-hidden rounded-2.5xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 p-6 shadow-xl transition-all duration-300">
      {/* Aurora glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/5 blur-3xl rounded-full" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-500/10 dark:bg-pink-500/5 blur-3xl rounded-full" />

      <div className="flex gap-5 items-start">
        {/* Living Pulsing Orb */}
        <div className="flex-shrink-0 relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg animate-spin' style={{ animationDuration: '10s' }}">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          {/* AI Pulse Rings */}
          <span className="absolute -inset-1 rounded-full border border-purple-400/30 animate-ping opacity-70" />
          <span className="absolute -inset-2.5 rounded-full border border-pink-400/15 animate-pulse opacity-40" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <span>ASTRA DECISION ENGINE</span>
            </h3>
            <button 
              onClick={fetchInsight} 
              disabled={isLoading}
              className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-500' : ''}`} />
            </button>
          </div>

          {isLoading ? (
            <div className="mt-3 space-y-2 animate-pulse">
              <div className="h-4 bg-purple-100 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
            </div>
          ) : insightData ? (
            <div className="mt-2.5">
              <h4 className="text-base font-semibold text-[#1e133a] dark:text-slate-100 leading-snug font-black theme-heading">
                {insightData.insight}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[#4f426d] dark:text-slate-400 italic">
                "{insightData.empathy}"
              </p>

              {insightData.actionType !== 'none' && (
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100/60 dark:border-purple-900/30 rounded-xl p-3.5 transition-all">
                  <span className="text-xs font-medium text-[#4f426d] dark:text-slate-300">
                    {insightData.actionText}
                  </span>
                  <button
                    onClick={() => onTriggerAction(insightData.actionType)}
                    className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                  >
                    Take action <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No active cosmic alignment logs found. Complete daily logs to initialize Astra insights.</p>
          )}
        </div>
      </div>
    </div>
  );
}
