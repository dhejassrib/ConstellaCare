import { useState } from 'react';
import { Calendar, CheckSquare, Sparkles, ChevronDown, ChevronUp, Clock, Plus, HelpCircle, FileText } from 'lucide-react';

export interface Checklist {
  id: string;
  item: string;
  checked: boolean;
}

interface AppointmentCopilotProps {
  onQuestionsBuilt: () => void;
}

export default function AppointmentCopilot({ onQuestionsBuilt }: AppointmentCopilotProps) {
  const [concernInput, setConcernInput] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  
  // Dynamic Gemini results
  const [questions, setQuestions] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [summary, setSummary] = useState('');

  // Accordion blocks
  const [activeAccordion, setActiveAccordion] = useState<'prep' | 'reminders' | 'questions' | null>('prep');

  // Medication setup (Static/Interactive)
  const [meds, setMeds] = useState([
    { id: '1', name: 'Ondansetron (Zofran)', schedule: 'Once every 8 hours (anti-nausea)', taken: true },
    { id: '2', name: 'Hydration Target', schedule: '2.5 Liters of water daily', taken: false },
    { id: '3', name: 'Oral Chemotherapeutic Cap', schedule: 'After lunch, with food', taken: false },
  ]);

  // Pre-loaded checklists
  const [preTreatChecklist, setPreTreatChecklist] = useState<Checklist[]>([
    { id: 'c1', item: 'Hydrate continuously 48 hours prior using mineral electrolytes', checked: true },
    { id: 'c2', item: 'Keep your temperature check log complete for Dr. Moss to view', checked: false },
    { id: 'c3', item: 'Pack comfortable cotton layers and personal soft socks', checked: false },
    { id: 'c4', item: 'Delegate a family driver from your Care Circle', checked: true },
  ]);

  const toggleMedChecked = (id: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const toggleChecklist = (id: string) => {
    setPreTreatChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const buildQuestions = async () => {
    if (!concernInput.trim()) return;
    setIsBuilding(true);
    try {
      const response = await fetch('/api/copilot/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concerns: concernInput,
          appointmentLabel: "Review with Dr. Evelyn Moss tomorrow"
        })
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setChecklist(data.checklist);
        setSummary(data.summary);
        setActiveAccordion('questions');
        onQuestionsBuilt();
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setQuestions([
        "Could we discuss potential options to adjust my anti-nausea schedule if current doses feel short-lived?",
        "Are the higher fatigue ratings on Day 3 and 4 post-treatment typical, and is there any hydration adjustment you recommend?"
      ]);
      setChecklist([
        "Hydrate with 500ml of electrolytes starting 24h prior to infusion.",
        "Print or save questions to show Chloe who is driving you tomorrow."
      ]);
      setSummary("Your worries focus on nausea timing. This consultation will target stabilizing medication coverage levels.");
      setActiveAccordion('questions');
      onQuestionsBuilt();
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2.5xl p-6 shadow-xl transition-all duration-300">
      
      {/* 🧾 SECTION 1: Top Input Builder */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Clinical Consultation Copilot 2.0
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Turn your physical concerns or anxieties into structured, medically articulate questions to bring confidence to your next appointment.
        </p>

        <div className="bg-slate-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 block mb-2">
            WHAT ARE YOUR CONCERNS OR PHYSICAL CHANGES BEFORE TOMORROW?
          </label>
          <textarea
            className="w-full text-sm bg-transparent border-none focus:outline-none resize-none leading-relaxed text-slate-700 dark:text-slate-200"
            rows={3}
            placeholder="e.g. My pain is manageable, but nausea acts up in the deep night. Also, fatigue makes me sleep 12 hours..."
            value={concernInput}
            onChange={e => setConcernInput(e.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={buildQuestions}
              disabled={isBuilding || !concernInput.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold select-none text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md hover:shadow-purple-500/20 cursor-pointer disabled:opacity-40"
            >
              {isBuilding ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  Building Doctor Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  Build Questions (Astra AI)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/*  Accordions (Clinicians / Hospital loved accordion hierarchy) */}
      <div className="space-y-4">
        
        {/* Accordion Block A: Appointment Prep Checklist */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'prep' ? null : 'prep')}
            className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 font-semibold text-sm text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4.5 h-4.5 text-purple-500" />
              <span>Pre-infusion checklists & preparations</span>
            </div>
            {activeAccordion === 'prep' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {activeAccordion === 'prep' && (
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {preTreatChecklist.map(item => (
                <div key={item.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklist(item.id)}
                    className="mt-1 accent-purple-600"
                  />
                  <span className={`text-xs leading-relaxed ${item.checked ? 'line-through text-slate-450 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    {item.item}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accordion Block B: Medication Companion Reminders */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'reminders' ? null : 'reminders')}
            className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 font-semibold text-sm text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-purple-500 animate-pulse" />
              <span>Medication Schedule Reminders</span>
            </div>
            {activeAccordion === 'reminders' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {activeAccordion === 'reminders' && (
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {meds.map(med => (
                <div
                  key={med.id}
                  onClick={() => toggleMedChecked(med.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    med.taken 
                      ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200/50' 
                      : 'bg-slate-50/50 dark:bg-slate-950/10 border-slate-150 dark:border-slate-800 hover:border-purple-300'
                  }`}
                >
                  <div>
                    <h5 className={`text-xs font-bold ${med.taken ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {med.name}
                    </h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{med.schedule}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    med.taken 
                      ? 'bg-emerald-500 border-transparent text-white' 
                      : 'border-slate-200 text-slate-400'
                  }`}>
                    ✓
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accordion Block C: Generated Doctor Question Guide */}
        {questions.length > 0 && (
          <div className="border border-purple-200 dark:border-purple-900/60 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'questions' ? null : 'questions')}
              className="w-full flex items-center justify-between p-4 bg-purple-50/40 dark:bg-purple-950/25 font-semibold text-sm text-purple-800 dark:text-purple-300 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-purple-600 animate-pulse" />
                <span>Structured consultation prompt sheets</span>
              </div>
              {activeAccordion === 'questions' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {activeAccordion === 'questions' && (
              <div className="p-5 bg-white dark:bg-slate-900 border-t border-purple-100 dark:border-slate-800 space-y-4">
                
                {summary && (
                  <div className="bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 p-3 rounded-xl">
                    <span className="text-[9px] font-mono tracking-wider text-purple-600 dark:text-purple-400 block uppercase font-bold">Astra Clinical Summary</span>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 mt-1">{summary}</p>
                  </div>
                )}

                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase font-bold">PROMPTS FOR CLINICAL VISITS</span>
                  {questions.map((q, idx) => (
                    <div key={idx} className="flex gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="w-5 h-5 rounded bg-purple-500 text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">{q}</p>
                    </div>
                  ))}
                </div>

                {checklist.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase font-bold">Suggested Companion Next Steps</span>
                    <ul className="list-disc pl-4 space-y-1">
                      {checklist.map((c, i) => (
                        <li key={i} className="text-xs text-slate-500 leading-relaxed">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
