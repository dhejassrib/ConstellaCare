import { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Sparkles, ChevronDown, ChevronUp, Clock, Plus, HelpCircle, FileText } from 'lucide-react';

export interface Checklist {
  id: string;
  item: string;
  checked: boolean;
}

interface AppointmentCopilotProps {
  onQuestionsBuilt: () => void;
}

const APPOINTMENT_TYPES = [
  { id: 'cancer', label: 'Cancer Consultation', icon: '🎗️' },
  { id: 'diabetes', label: 'Diabetes Review', icon: '🩸' },
  { id: 'mental_health', label: 'Mental Health Appointment', icon: '🧠' },
  { id: 'chronic_illness', label: 'Chronic Illness Review', icon: '❤️' },
  { id: 'referral', label: 'Specialist Referral', icon: '📋' },
  { id: 'rehab', label: 'Rehabilitation Session', icon: '🏃' },
];

const CHECKLIST_PRESETS: Record<string, string[]> = {
  cancer: [
    'Hydrate continuously 48 hours prior using mineral electrolytes',
    'Keep your temperature check log complete for your specialist to view',
    'Pack comfortable cotton layers and personal soft socks',
    'Delegate a family driver from your Care Circle',
  ],
  diabetes: [
    'Keep a log of morning fasting blood glucose readings for 7 days',
    'List current insulin / medicine doses and injection site tenderness',
    'Bring an up-to-date food diary with macronutrients logged',
    'Verify if fasting lab draws are needed before the appointment',
  ],
  mental_health: [
    'Complete an emotional weather check-in trigger in your journal',
    'Trace sleep patterns and any anxiety/mood triggers noticed',
    'List your primary therapy goals and focus coping strategies to audit',
    'Write down any pharmaceutical side effects or sleep logs',
  ],
  chronic_illness: [
    'Note down pain level fluctuations and daily activity limits',
    'Check current prescription levels and refill dates',
    'Write down any new fatigue or cognitive fog symptoms',
    'Compile self-management questions on secondary flareups',
  ],
  referral: [
    'Request copies of recent blood labs or imaging scans (CT/MRI)',
    'Compile a list of all active doctors/providers in your Care Circle',
    'Draft a brief chronological timeline of your primary health symptoms',
    'Verify if pre-authorization paperwork was sent to the specialist',
  ],
  rehab: [
    'Dress in flexible, comfortable athletic apparel for mobility drills',
    'Complete your home fitness log or movement diary for audit',
    'Rate your physical range of motion and joint stiffness levels',
    'List symptoms like soreness, swelling, or localized spasms',
  ]
};

export default function AppointmentCopilot({ onQuestionsBuilt }: AppointmentCopilotProps) {
  const [appointmentType, setAppointmentType] = useState('cancer');
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
    { id: '1', name: 'Prescription Dose / Treatment Agent', schedule: 'Once every 8 hours (stabilizing)', taken: true },
    { id: '2', name: 'Daily Hydration Target', schedule: '2.5 Liters of water with electrolytes', taken: false },
    { id: '3', name: 'Supplements & Vitamins', schedule: 'After lunch, with food', taken: false },
  ]);

  // Pre-loaded checklists dynamic loader
  const [preTreatChecklist, setPreTreatChecklist] = useState<Checklist[]>([]);

  useEffect(() => {
    const presets = CHECKLIST_PRESETS[appointmentType] || CHECKLIST_PRESETS.cancer;
    setPreTreatChecklist(
      presets.map((item, index) => ({
        id: `c-${appointmentType}-${index}`,
        item,
        checked: false,
      }))
    );
  }, [appointmentType]);

  const toggleMedChecked = (id: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const toggleChecklist = (id: string) => {
    setPreTreatChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const buildQuestions = async () => {
    if (!concernInput.trim()) return;
    setIsBuilding(true);
    
    const chosenTypeLabel = APPOINTMENT_TYPES.find(t => t.id === appointmentType)?.label || appointmentType;

    try {
      const response = await fetch('/api/copilot/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concerns: concernInput,
          appointmentLabel: `Consultation: ${chosenTypeLabel} tomorrow`,
          appointmentType: appointmentType
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
      // Fallback customized based on chosen appointmentType
      if (appointmentType === 'diabetes') {
        setQuestions([
          "Could we review my current insulin scaling parameters for meals versus fasting levels?",
          "Are there specific adjustments to my dosage before prolonged walks or exercise routines?"
        ]);
        setChecklist([
          "Log your morning blood glucose levels on fasting status.",
          "Prepare list of active recipes and any carbohydrate mapping notes."
        ]);
        setSummary("Your concerns center on glycemic patterns and physical activity adjustments. This consultation targets glucose range leveling.");
      } else if (appointmentType === 'mental_health') {
        setQuestions([
          "Is it customary to feel heightened afternoon fatigue or cognitive weight with my current capsule schedule?",
          "How can we safely address these scanning anxieties and racing thoughts before clinical visits?"
        ]);
        setChecklist([
          "Note details of panic or scan-related stress triggers from your voice journal.",
          "Arrange an direct support teammate from your Care Circle."
        ]);
        setSummary("You are managing deep cognitive and scanning anxieties. This review focuses on stabilizing emotional triggers.");
      } else {
        setQuestions([
          "Could we discuss potential options to adjust my care metrics or dosage timings if symptoms feel short-lived?",
          "Are these fatigue fluctuations normal for this treatment phase, and what recovery window do you advise?"
        ]);
        setChecklist([
          "Maintain daily logs in the Health Check-In Tracker.",
          "Print or save questions to show caregiver who accompanies you."
        ]);
        setSummary("Your worries target symptoms timing. This review will balance dosage intervals to optimize safe recovery windows.");
      }
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
        <h3 className="theme-heading text-lg font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Appointment Preparation Copilot
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Turn your worries, physical changes, or anxieties into structured, medically articulate questions to bring confidence to your next appointment.
        </p>

        {/* Dynamic Appointment Type Selection Row */}
        <div className="mb-6 text-left">
          <span className="text-[10px] font-bold font-mono tracking-widest text-[#a855f7] block mb-3.5">
            1. SELECT APPOINTMENT CONTEXT FOR OPTIMIZATION
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {APPOINTMENT_TYPES.map((type) => {
              const matches = appointmentType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setAppointmentType(type.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer select-none ${
                    matches
                      ? 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 font-extrabold ring-2 ring-purple-500/10'
                      : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <span className="text-xl mb-1">{type.icon}</span>
                  <span className="text-[9px] uppercase tracking-wider leading-relaxed font-bold break-words">{type.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Text Area panel */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
          <label className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 block mb-2">
            2. WHAT ARE YOUR KEY CONCERNS OR PHYSICAL CHANGES?
          </label>
          <textarea
            className="w-full text-xs bg-transparent border-none focus:outline-none resize-none leading-relaxed text-slate-700 dark:text-slate-400"
            rows={3}
            placeholder={`e.g. My pain is managed, but I get very exhausted and experience minor nausea in the evening hours...`}
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
                  Formulating Prompts & Guidelines...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  Formulate Guidance (Astra AI)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div className="space-y-4 text-left">
        
        {/* Accordion Block A: Appointment Prep Checklist */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveAccordion(activeAccordion === 'prep' ? null : 'prep')}
            className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 font-semibold text-xs text-slate-705 dark:text-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4.5 h-4.5 text-purple-500" />
              <span>Personalized Preparation Checklist ({APPOINTMENT_TYPES.find(t => t.id === appointmentType)?.label})</span>
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
                  <span className={`text-xs leading-relaxed ${item.checked ? 'line-through text-slate-450 dark:text-slate-550' : 'text-slate-700 dark:text-slate-300'}`}>
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
            className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 font-semibold text-xs text-slate-705 dark:text-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-purple-500 animate-pulse" />
              <span>Medication Schedule & Refills Helper</span>
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
              className="w-full flex items-center justify-between p-4 bg-purple-50/40 dark:bg-purple-950/25 font-semibold text-xs text-purple-800 dark:text-purple-300 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-purple-600 animate-pulse" />
                <span>Generated Doctor Prompts & Guides</span>
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
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase font-bold">PROMPTS FOR MEDICAL VISITS</span>
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
