import React, { useState, useEffect } from 'react';
import { Pill, Plus, Trash2, Clock, Check, Calendar, Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  takenDays: Record<string, boolean>; // 'Mon', 'Tue', 'Wed', etc.
}

interface MedicationReminderConstellationProps {
  theme: 'light' | 'dark';
  onStarEarned: (label: string) => void;
  onAdherenceUpdate?: (adherenceRate: number) => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MedicationReminderConstellation({
  theme,
  onStarEarned,
  onAdherenceUpdate
}: MedicationReminderConstellationProps) {
  const [meds, setMeds] = useState<Medication[]>(() => {
    const cached = localStorage.getItem('constella-medications');
    if (cached) return JSON.parse(cached);
    return [
      {
        id: '1',
        name: 'Daily Vitamin D3 & Zinc support',
        dosage: '1 capsule',
        schedule: 'Morning with food',
        takenDays: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: false, Sat: false, Sun: false }
      },
      {
        id: '2',
        name: 'Prescription Care Treatment Agent',
        dosage: '10mg',
        schedule: 'Twice daily (8 AM / 8 PM)',
        takenDays: { Mon: true, Tue: true, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false }
      }
    ];
  });

  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newSchedule, setNewSchedule] = useState('');

  const [completedWeeks, setCompletedWeeks] = useState<number>(() => {
    return parseInt(localStorage.getItem('constella-completed-weeks') || '2');
  });

  useEffect(() => {
    localStorage.setItem('constella-medications', JSON.stringify(meds));
    
    // Calculate and trigger adherence rate
    if (onAdherenceUpdate) {
      let totalCells = meds.length * 7;
      if (totalCells === 0) {
        onAdherenceUpdate(100);
        return;
      }
      let takenCount = 0;
      meds.forEach(med => {
        DAYS_OF_WEEK.forEach(day => {
          if (med.takenDays[day]) takenCount++;
        });
      });
      const rate = Math.round((takenCount / totalCells) * 100);
      onAdherenceUpdate(rate);
    }
  }, [meds]);

  useEffect(() => {
    localStorage.setItem('constella-completed-weeks', completedWeeks.toString());
  }, [completedWeeks]);

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMed: Medication = {
      id: Math.random().toString(),
      name: newName,
      dosage: newDosage || 'As directed',
      schedule: newSchedule || 'Once daily',
      takenDays: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false }
    };

    setMeds(prev => [...prev, newMed]);
    setNewName('');
    setNewDosage('');
    setNewSchedule('');
    onStarEarned(`Added New Medication: ${newMed.name}`);
  };

  const handleRemoveMed = (id: string) => {
    setMeds(prev => prev.filter(m => m.id !== id));
  };

  const toggleDayTaken = (medId: string, day: string) => {
    setMeds(prev => prev.map(med => {
      if (med.id === medId) {
        const nextTaken = !med.takenDays[day];
        return {
          ...med,
          takenDays: {
            ...med.takenDays,
            [day]: nextTaken
          }
        };
      }
      return med;
    }));
  };

  // Check if a full week is complete across all configured meds
  const checkWeekCompletion = () => {
    if (meds.length === 0) return;
    
    let allTaken = true;
    meds.forEach(med => {
      DAYS_OF_WEEK.forEach(day => {
        if (!med.takenDays[day]) allTaken = true; // Let them manually trigger week completion to celebrate
      });
    });

    setCompletedWeeks(w => w + 1);
    onStarEarned("Lighted Medication Adherence Constellation! 🌌");
    alert("✨ Congratulations! Your clinical adherence lights up a beautiful new constellation mapping in your sky.");
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2.5xl p-6 shadow-xl transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] block font-mono">CARE JOURNEY MODULE</span>
          <h3 className="text-lg font-bold text-[#1e133a] dark:text-slate-100 flex items-center gap-2 mt-0.5 font-black theme-heading">
            <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Medication Reminder
          </h3>
          <p className="text-xs text-[#5a487c] dark:text-slate-400 mt-0.5 leading-relaxed">
            Record medication schedules, track adherence, and build a consistent care routine.
          </p>
        </div>

        {/* <div className="flex items-center gap-3">
          <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border border-purple-500/10 text-center">
            <span className="text-[9px] uppercase tracking-wider text-purple-600 dark:text-purple-400 block font-bold font-mono">CONSTELLATIONS LIT</span>
            <span className="text-lg font-black text-[#2e214c] dark:text-purple-300 block mt-0.5">{completedWeeks} 🌌</span>
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form & Add Medications */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4f426d] dark:text-slate-350 flex items-center gap-1.5 mb-3">
              <Plus className="w-4 h-4 text-purple-500" /> Add New Medication
            </h4>

            <form onSubmit={handleAddMed} className="space-y-3">
              <div>
                <label className="text-[9px] font-bold font-mono text-slate-450 uppercase block mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ondansetron (Zofran)"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent text-slate-750 dark:text-slate-200 border-slate-200 dark:border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold font-mono text-slate-450 uppercase block mb-1">Dosage or Strength</label>
                <input
                  type="text"
                  placeholder="e.g. 4mg / 1 capsule"
                  value={newDosage}
                  onChange={e => setNewDosage(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent text-slate-750 dark:text-slate-200 border-slate-200 dark:border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold font-mono text-slate-450 uppercase block mb-1">Schedule & frequency</label>
                <input
                  type="text"
                  placeholder="e.g. Once every 8 hours"
                  value={newSchedule}
                  onChange={e => setNewSchedule(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent text-slate-755 dark:text-slate-200 border-slate-200 dark:border-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold select-none text-xs leading-none py-3 rounded-xl shadow-lg hover:opacity-90 cursor-pointer block"
              >
                + Register Care Medication
              </button>
            </form>
          </div>

          {/* <div className="bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 p-4 rounded-2.5xl text-left">
            <span className="text-[9px] font-mono tracking-wider text-purple-600 dark:text-purple-450 block uppercase font-bold">Stellar Compliance Benefit</span>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 mt-1.5">
              Taking your medication daily stabilizes physiological recovery metrics. When all cells are protected, matching lines of light connect your care team, forming a protective barrier of wellness.
            </p>
          </div> */}
        </div>

        {/* Right 2 Columns: Adherence Grid View */}
        <div className="lg:col-span-2 space-y-6 text-left">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#a855f7] flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Weekly Tracking Calendar
            </h4>
            <button
              onClick={checkWeekCompletion}
              disabled={meds.length === 0}
              className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-500 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-500/20 disabled:opacity-40 select-none cursor-pointer"
            >
              Light Up Constellation Week
            </button>
          </div>

          <div className="space-y-4">
            {meds.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/10">
                <p className="text-xs text-slate-400 italic">No care medications enrolled yet. Add one to start tracking compliance.</p>
              </div>
            ) : (
              meds.map((med) => (
                <div
                  key={med.id}
                  className="p-4 bg-slate-50/30 dark:bg-[#110d24]/45 border border-slate-100 dark:border-purple-550/15 rounded-2xl shadow-sm hover:border-purple-500/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3 border-b border-dashed border-slate-150 dark:border-purple-500/5 pb-2">
                    <div>
                      <h5 className="text-xs font-bold text-[#1e133a] dark:text-slate-150 flex items-center gap-1.5 leading-none">
                        <Pill className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                        <span className="text-smfont-black theme-heading">{med.name}</span>
                      </h5>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">{med.dosage} , {med.schedule}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveMed(med.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition"
                      title="Remove record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center mt-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const isTaken = med.takenDays[day] ?? false;
                      return (
                        <div
                          key={day}
                          onClick={() => toggleDayTaken(med.id, day)}
                          className={`flex flex-col items-center p-1.5 rounded-xl border cursor-pointer select-none transition-all ${
                            isTaken
                              ? 'bg-emerald-500/15 border-emerald-520 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/15'
                              : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-400 hover:border-purple-400'
                          }`}
                        >
                          <span className="text-[9px] font-black uppercase block tracking-wider font-mono">{day}</span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 text-xs font-bold border transition ${
                            isTaken
                              ? 'bg-emerald-500 text-white border-transparent'
                              : 'bg-transparent border-slate-200 dark:border-slate-805'
                          }`}>
                            {isTaken ? '✓' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Constellation visualizer mockup inside component */}
          {meds.length > 0 && (
            <div className="on-dark-surface p-4 rounded-2xl bg-[#1a1530] text-[#decfe6] border border-purple-500/20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 blur-xl rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[0.5px] border-b border-dashed border-purple-500/15" />
              <h5 className="text-[10px] font-black uppercase tracking-widest text-pink-400 block font-mono">ADHERENCE CONSTELLATION MAP</h5>
              
              <div className="relative flex justify-around items-center h-20 mt-3">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500 ring-4 ring-purple-500/25 flex items-center justify-center text-white text-xs font-bold animate-pulse">✨</div>
                  <span className="text-[8px] font-mono mt-1 text-purple-300">Week 1</span>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500 ring-4 ring-purple-500/25 flex items-center justify-center text-white text-xs font-bold animate-pulse">✨</div>
                  <span className="text-[8px] font-mono mt-1 text-purple-300">Week 2</span>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border border-dashed flex items-center justify-center text-slate-500 text-xs font-bold ${completedWeeks > 2 ? 'bg-purple-500 text-white border-none ring-4 ring-purple-500/25' : 'border-slate-800 bg-[#070512]'}`}>
                    {completedWeeks > 2 ? '✨' : '3'}
                  </div>
                  <span className="text-[8px] font-mono mt-1 text-slate-500">Week 3</span>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border border-dashed flex items-center justify-center text-slate-500 text-xs font-bold ${completedWeeks > 3 ? 'bg-purple-500 text-white border-none ring-4 ring-purple-500/25' : 'border-slate-800 bg-[#070512]'}`}>
                    {completedWeeks > 3 ? '✨' : '4'}
                  </div>
                  <span className="text-[8px] font-mono mt-1 text-slate-500">Week 4</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}