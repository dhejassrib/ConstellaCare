import { useState } from 'react';
import { FileText, Share2, ShieldCheck, Mail, ClipboardCheck, Sparkles } from 'lucide-react';
import { INITIAL_SYMPTOMS_LOG } from '../data';

export default function Reports() {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Compute average symptom scores
  const scoreSums = INITIAL_SYMPTOMS_LOG.reduce((acc, log) => {
    acc.Fatigue += log.Fatigue;
    acc.Nausea += log.Nausea;
    acc.Pain += log.Pain;
    acc.Anxiety += log.Anxiety;
    acc.Appetite += log['Appetite loss'];
    acc.Sleep += log['Sleep issues'];
    return acc;
  }, { Fatigue: 0, Nausea: 0, Pain: 0, Anxiety: 0, Appetite: 0, Sleep: 0 });

  const count = INITIAL_SYMPTOMS_LOG.length;
  const averages = {
    Fatigue: (scoreSums.Fatigue / count).toFixed(1),
    Nausea: (scoreSums.Nausea / count).toFixed(1),
    Pain: (scoreSums.Pain / count).toFixed(1),
    Anxiety: (scoreSums.Anxiety / count).toFixed(1),
    Appetite: (scoreSums.Appetite / count).toFixed(1),
    Sleep: (scoreSums.Sleep / count).toFixed(1),
  };

  const reportText = `
ConstellaCare Patient Wellness Summary // Clinical Report
Authorized Sync: Saturday June 2026

Patient Name: Sarah (Active Patient Core)
Oncology Lead: Dr. Evelyn Moss

Recent Log Averages (0-5 scale over last 7 days):
- Fatigue: ${averages.Fatigue} / 5
- Nausea: ${averages.Nausea} / 5
- Pain: ${averages.Pain} / 5
- Anxiety: ${averages.Anxiety} / 5
- Appetite loss: ${averages.Appetite} / 5
- Sleep issues: ${averages.Sleep} / 5

Observed Cosmic Resilience index: Stable (73% hope index).
Daily Breathing: Active completion (3-min bubble circles logged).
Care Connections: Concentric alignment approves Mom (Sarah) and Chloe check-ins.
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2.5xl p-6 shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 font-sans">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Clinical Reports Dispatcher
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Export a summary of your emotional and symptom logs directly to your clinical oncologist.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 border border-slate-205 dark:border-slate-800 rounded-xl text-xs font-bold font-sans hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-purple-300 transition text-slate-750 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Copied' : 'Copy Report'}
          </button>
          
          <button
            onClick={handleSendEmail}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold font-sans transition flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Mail className="w-3.5 h-3.5" />
            {emailSent ? 'Sent' : 'Email to Dr. Moss'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Metric list */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-400">7-Day Diagnostic Averages</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(averages).map(([name, avg]) => {
              const num = parseFloat(avg);
              return (
                <div key={name} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
                  <span className="text-[10px] text-slate-450 dark:text-slate-400 font-semibold block capitalize">{name}</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{avg}</span>
                    <span className="text-[10px] text-slate-400 font-bold">/ 5</span>
                  </div>
                  {/* Small progress meter */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${num < 2 ? 'bg-emerald-400' : num < 4 ? 'bg-amber-400' : 'bg-rose-400'}`}
                      style={{ width: `${(num / 5) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dispatch content pane */}
        <div className="flex flex-col">
          <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-slate-400 mb-2">Clinical Dispatch Preview</h4>
          
          <div className="bg-slate-950 text-slate-250 font-mono text-[10.5px] p-4.5 rounded-xl border border-slate-850 shadow-inner flex-1 leading-relaxed whitespace-pre-wrap select-all">
            {reportText.trim()}
          </div>
        </div>

      </div>

      {emailSent && (
        <span className="text-[10px] font-bold text-emerald-505 dark:text-emerald-400 block mt-4 animate-pulse">
          ✦ Dispatch secure line connecting Dr. Evelyn Moss oncology dashboard approved. Clinic will notify you during next checkpoint review.
        </span>
      )}
    </div>
  );
}
