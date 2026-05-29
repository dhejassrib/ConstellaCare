import { useState } from 'react';
import { EmotionCard } from '../data';
import { Sparkles } from 'lucide-react';

interface EmotionCardsProps {
  emotions: EmotionCard[];
  responses: Record<string, string>;
  onSelect: (emotionId: string) => void;
  chipClass?: string;
  activeClass?: string;
  aiBoxClass?: string;
}

export default function EmotionCards({ emotions, responses, onSelect, chipClass, activeClass, aiBoxClass }: EmotionCardsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect(id);
  };

  return (
    <div className="space-y-6">
      {/* Interactive horizontal grids of custom emotions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {emotions.map((card) => {
          const isSelected = selectedId === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleSelect(card.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative cursor-pointer overflow-hidden flex flex-col items-start gap-1.5 h-28 group ${
                isSelected
                  ? `ring-4 ring-purple-400 bg-gradient-to-tr ${card.color} border-transparent scale-102 font-semibold shadow-inner text-slate-900`
                  : 'bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-950/20 dark:hover:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:border-purple-300'
              }`}
            >
              <div className="absolute -bottom-2 -right-2 text-5xl opacity-15 select-none transition-transform group-hover:scale-110">
                {card.emoji}
              </div>
              <span className="text-2xl">{card.emoji}</span>
              <span className="text-xs font-bold leading-tight select-none">{card.label}</span>
            </button>
          );
        })}
      </div>

      {/* Astra personalized response card */}
      {selectedId && responses[selectedId] && (
        <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/40 dark:border-purple-900/30 rounded-2.5xl p-5 shadow-inner relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/5 blur-2xl rounded-full" />
          
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-200/20 dark:border-purple-900/10">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold font-mono tracking-wider text-purple-700 dark:text-purple-350 uppercase">
              ASTRA REFLECTOR // ALIGNMENT: {selectedId.toUpperCase()}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic">
            "{responses[selectedId]}"
          </p>

          <span className="text-[9px] font-mono tracking-wider font-semibold text-slate-500 block mt-3 select-none">
            ✦ Star illuminated on your Constellation sky dashboard.
          </span>
        </div>
      )}
    </div>
  );
}
