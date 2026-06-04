import { HELPFUL_RESOURCES } from '../data';
import { BookOpen, ExternalLink, Bookmark } from 'lucide-react';

export default function Resources() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2.5xl p-6 shadow-xl transition-all duration-300">
        <h3 className="text-lg font-black theme-heading flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Clinical & Emotional Resource Library
        </h3>
        <p className="text-xs text-[#5a487c] dark:text-slate-400 mt-1">
          A collection of guides and materials curated by clinical oncologists and patient advocates to help support you and your family.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {HELPFUL_RESOURCES.map((res, index) => (
          <div key={index} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between hover:border-purple-300/60 dark:hover:border-purple-900/60 transition-all group">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-3.5">
                <span className="text-[10px] uppercase font-mono tracking-widest bg-purple-50 dark:bg-purple-950/40 border border-purple-100/30 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-full font-bold">
                  {res.category}
                </span>
                <Bookmark className="w-4 h-4 text-slate-300 group-hover:text-purple-400 transition" />
              </div>
              
              <h4 className="text-sm font-bold text-[#1e133a] dark:text-slate-450 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition leading-snug">
                {res.title}
              </h4>
              
              <p className="text-xs leading-relaxed text-[#4f426d] dark:text-slate-400 mt-2">
                {res.description}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 flex items-center gap-1 transition"
              >
                Access Guide <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
