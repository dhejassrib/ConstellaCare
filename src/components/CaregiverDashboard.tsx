// // CaregiverDashboard.tsx:
// import React, { useState, useEffect, useRef } from 'react';
// import SharedConstellation from './SharedConstellation';
// import {
//   Sun, Moon, Star, MessageSquare, Heart, Sparkles, Navigation, CheckCircle,
//   ChevronRight, Compass, ShieldAlert, Award, FileText, Send, HelpCircle, X,
//   Activity, Battery, Plus, Trash, Lock, Calendar, Users, Mic, Volume2, Clock,
//   ArrowRight, ShieldCheck, RefreshCw, Zap
// } from 'lucide-react';

// interface CaregiverDashboardProps {
//   theme: 'light' | 'dark';
//   onThemeToggle: () => void;
//   onNavigate: (path: string) => void;
// }

// type CaregiverSection =
//   | 'home'
//   | 'emotion'
//   | 'appointments'
//   | 'communication'
//   | 'burnout'
//   | 'circle'
//   | 'journal'
//   | 'resources'
//   | 'shared';

// interface CareTask {
//   id: string;
//   label: string;
//   done: boolean;
//   time: string;
//   category: 'meds' | 'appointment' | 'transport' | 'wellness';
// }

// interface BurnoutEvent {
//   id: string;
//   time: string;
//   moodType: 'fatigue' | 'overwhelm' | 'stable' | 'gratitude';
//   energy: number;
//   notes: string;
// }

// interface AppointmentEvent {
//   id: string;
//   title: string;
//   date: string;
//   time: string;
//   transport: string;
//   medsLogged: boolean;
//   notesPinned: string;
// }

// interface SuggestionCard {
//   prompt: string;
//   category: string;
// }

// export default function CaregiverDashboard({ theme, onThemeToggle, onNavigate }: CaregiverDashboardProps) {
//   const [activeSection, setActiveSection] = useState<CaregiverSection>('home');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [totalStars, setTotalStars] = useState(12);
//   const [quickSupportOpen, setQuickSupportOpen] = useState(false);

//   // Active Care Tasks
//   const [tasks, setTasks] = useState<CareTask[]>(() => {
//     const cached = localStorage.getItem('caregiver-tasks');
//     if (cached) return JSON.parse(cached);
//     return [
//       { id: '1', label: 'Give Sarah herbal tea & ginger drops', done: true, time: '8:00 AM', category: 'wellness' },
//       { id: '2', label: 'Dexamethasone medication dosage pre-chemo', done: false, time: '2:00 PM', category: 'meds' },
//       { id: '3', label: 'Confirm transport with Chloe for scan tomorrow', done: false, time: '5:30 PM', category: 'transport' },
//       { id: '4', label: 'Meditation baseline & hydration check', done: false, time: '8:00 PM', category: 'wellness' },
//     ];
//   });

//   // Emotional Weather Timeline logs
//   const [burnoutEvents, setBurnoutEvents] = useState<BurnoutEvent[]>(() => {
//     const cached = localStorage.getItem('caregiver-burnout-events');
//     if (cached) return JSON.parse(cached);
//     return [
//       { id: '1', time: 'Monday', moodType: 'stable', energy: 75, notes: 'Felt a sense of acceptance during the joint garden walk.' },
//       { id: '2', time: 'Wednesday', moodType: 'fatigue', energy: 45, notes: 'Woke up at 3 AM hearing nausea coughing. Tired but pushing through.' },
//       { id: '3', time: 'Friday', moodType: 'overwhelm', energy: 30, notes: 'Oncologist report was dry and clinical. Felt scared but hid it from Sarah.' },
//       { id: '4', time: 'Sunday (Today)', moodType: 'gratitude', energy: 60, notes: 'Sarah was breathing deeper. Feeling lighter after reading her comfort star logs.' },
//     ];
//   });

//   // Shared Appointments
//   const [appointments, setAppointments] = useState<AppointmentEvent[]>(() => {
//     const cached = localStorage.getItem('caregiver-appointments');
//     if (cached) return JSON.parse(cached);
//     return [
//       { id: '1', title: 'Chemotherapy Infusion Cycle 2', date: 'Tomorrow', time: '2:30 PM', transport: 'Driver: Chloe (Sister)', medsLogged: true, notesPinned: 'Focus on cold cap application protocol immediately on start.' },
//       { id: '2', title: 'Post-chemo Hydration Checkup', date: 'Next Tuesday', time: '11:00 AM', transport: 'Driver: Sarah (Self)', medsLogged: false, notesPinned: 'Bring nausea diary to review blood pressure indicators.' },
//       { id: '3', title: 'MRI Neuropathy Clearance Study', date: 'June 12, 2026', time: '9:00 AM', transport: 'Transport unarranged', medsLogged: false, notesPinned: 'Prepare sensory calming music before scan begins.' },
//     ];
//   });

//   // Communication AI helper states
//   const [commQuery, setCommQuery] = useState('');
//   const [commChat, setCommChat] = useState<Array<{ sender: 'user' | 'ai'; text: string; solutions?: string[] }>>([
//     {
//       sender: 'ai',
//       text: "Hello, Caregiver. I am Astra, your empathetic conversational companion. Wordings and phrasing can carry heavy burdens right now. Ask me anything, or select a conversational cue below:",
//       solutions: [
//         "How do I support Sarah before chemotherapy without sounding overly anxious?",
//         "What is a gentle way to ask friends for cooking support?",
//         "What can I write when doctors don't seem to notice pain logs?"
//       ]
//     }
//   ]);
//   const [typing, setTyping] = useState(false);

//   // Private journal logs
//   const [journalText, setJournalText] = useState('');
//   const [journalLogs, setJournalLogs] = useState<Array<{ id: string; text: string; date: string; reply: string }>>(() => {
//     const cached = localStorage.getItem('caregiver-journal-logs');
//     if (cached) return JSON.parse(cached);
//     return [];
//   });
//   const [voiceActive, setVoiceActive] = useState(false);
//   const [waveSeconds, setWaveSeconds] = useState(0);

//   // Recovery Alert States
//   const [currentRecoveryRem, setCurrentRecoveryRem] = useState('🍵 Cozy Lavender Alert: Take 2 minutes to stretch your arms and have three long deep sips of warm water.');

//   // Constellation logs - Caregiver check-in reactions
//   const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
//   const [emotionFeedback, setEmotionFeedback] = useState<string>('');

//   // Energy levels
//   const [energyLevel, setEnergyLevel] = useState(55); // battery overall capacity
//   const [recoveryScore, setRecoveryScore] = useState(65);
//   const [emotionalLoad, setEmotionalLoad] = useState('Elevated');

//   // Sync caches
//   useEffect(() => {
//     localStorage.setItem('caregiver-tasks', JSON.stringify(tasks));
//   }, [tasks]);

//   useEffect(() => {
//     localStorage.setItem('caregiver-burnout-events', JSON.stringify(burnoutEvents));
//   }, [burnoutEvents]);

//   useEffect(() => {
//     localStorage.setItem('caregiver-appointments', JSON.stringify(appointments));
//   }, [appointments]);

//   useEffect(() => {
//     localStorage.setItem('caregiver-journal-logs', JSON.stringify(journalLogs));
//   }, [journalLogs]);

//   // Handle active countdown / timer simulation for voice recording
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (voiceActive) {
//       interval = setInterval(() => {
//         setWaveSeconds((s) => s + 1);
//       }, 1000);
//     } else {
//       setWaveSeconds(0);
//     }
//     return () => clearInterval(interval);
//   }, [voiceActive]);

//   // Trigger Recovery prompts changes periodically
//   useEffect(() => {
//     const reminders = [
//       '🍵 Cozy Lavender Alert: Take 2 minutes to stretch your arms and have three long deep sips of warm water.',
//       '✨ Grounding Note: Look out of the window and spot two tiny specs of light. Realize you do not carry this sky alone.',
//       '🧬 Micro Breathing Reset: Inhale cool air through your nose for 4 seconds, expand your abdomen, hold for 2, release slowly.',
//       '🕊️ Soft Boundary Card: You are allowed to say \"I need a 10-minute break in the other room to breathe.\"'
//     ];
//     const timer = setInterval(() => {
//       const randomRem = reminders[Math.floor(Math.random() * reminders.length)];
//       setCurrentRecoveryRem(randomRem);
//     }, 28000);
//     return () => clearInterval(timer);
//   }, []);

//   const triggerEmotionCheckIn = (id: string, label: string) => {
//     setSelectedEmotion(id);
//     let feedbackSrc = '';
//     let batteryChange = 0;
    
//     switch (id) {
//       case 'exhausted':
//         feedbackSrc = "Exhaustion is a natural physical reality, not a failing of love. We have illuminated the Star of Quiet Restoration. Your target is complete rest for 2 hours.";
//         batteryChange = -15;
//         break;
//       case 'worried':
//         feedbackSrc = "Holding worry is holding care. But remember: Sarah is in professional hands, and you are here holding her hand. Let us focus only on today's small orbit.";
//         batteryChange = -5;
//         break;
//       case 'peaceful':
//         feedbackSrc = "Grounded moments are refreshing wells in a long trail. Let this feeling settle inside your chest, refueling your deep reservoirs.";
//         batteryChange = 15;
//         break;
//       case 'overwhelmed':
//         feedbackSrc = "When waves crash over, you do not need to fight. Just float. Stop planning next month, just choose what to eat next. I have lit the Star of Soft Boundaries.";
//         batteryChange = -20;
//         break;
//     }

//     setEmotionFeedback(feedbackSrc);
//     setEnergyLevel(prev => Math.max(15, Math.min(100, prev + batteryChange)));
//     setTotalStars(prev => prev + 1);
//   };

//   const addTask = (label: string, category: 'meds' | 'appointment' | 'transport' | 'wellness', time: string) => {
//     const newTask: CareTask = { id: Math.random().toString(), label, done: false, time, category };
//     setTasks(prev => [...prev, newTask]);
//     setTotalStars(prev => prev + 1);
//   };

//   const toggleTask = (id: string) => {
//     setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
//     // If completed, add Star
//     const task = tasks.find(t => t.id === id);
//     if (task && !task.done) {
//       setTotalStars(prev => prev + 1);
//     }
//   };

//   const removeTask = (id: string) => {
//     setTasks(prev => prev.filter(t => t.id !== id));
//   };

//   const handleSendCommQuery = (custom?: string) => {
//     const textToSend = custom || commQuery;
//     if (!textToSend.trim()) return;

//     setCommChat(prev => [...prev, { sender: 'user', text: textToSend }]);
//     setCommQuery('');
//     setTyping(true);

//     setTimeout(() => {
//       let aiResponseText = '';
//       if (textToSend.toLowerCase().includes('chemotherapy') || textToSend.toLowerCase().includes('nervous') || textToSend.toLowerCase().includes('anxious')) {
//         aiResponseText = "✨ Pre-treatment Reassurance Option:\n\"We are going to take this step-by-step today. I have already packed your soft fuzzy socks, your cherry flavored ginger drops, and your favourite podcast playlists. My only job today is to hold your hand and ensure you feel safe.\"";
//       } else if (textToSend.toLowerCase().includes('cooking') || textToSend.toLowerCase().includes('friends') || textToSend.toLowerCase().includes('help')) {
//         aiResponseText = "📋 Gentle Support Coordination Ask:\n\"Hey friends, many of you asked how you can sit beside us during this Chemo round. We set up an online cooking rotation. If anyone has time to drop off lightweight veggie broth or non-spicy meals on Tuesdays, it would let us spend evenings completely resting. Thank you so much for traveling under our star sky.\"";
//       } else {
//         aiResponseText = "🌱 Supportive Translation Option:\n\"I love you, and it's okay to feel completely tired and raw today. We don't have to put on a brave face. I am cozy sitting right here next to you in silence. We are doing enough by simply being.\"";
//       }
//       setCommChat(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
//       setTyping(false);
//       setTotalStars(prev => prev + 1);
//     }, 1500);
//   };

//   const saveJournalEntry = () => {
//     if (!journalText.trim()) return;

//     // Simulate Astra's emotional reflection output
//     const reflectionResponses = [
//       "Astra sat quietly alongside your unloading. You noted high worry for Sarah's upcoming blood counts. It is okay to be frightened; your empathy is a quiet guide. I have added this to your locked private reflection constell.",
//       "Astra felt the deep pressure of fatigue in your words. Preparing the meals, managing the dosage sheets — it is heavy. I remind you that your support capacity is high, but not limitless. Rest tonight.",
//       "Astra observed a gentle glimmer of light in today's entry. Your acceptance is a stabilizing orbit for Sarah. The night is quiet, and so is your breathing."
//     ];

//     const randomRep = reflectionResponses[Math.floor(Math.random() * reflectionResponses.length)];
//     const entry = {
//       id: Math.random().toString(),
//       text: journalText,
//       date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//       reply: randomRep
//     };

//     setJournalLogs(prev => [entry, ...prev]);
//     setJournalText('');
//     setTotalStars(prev => prev + 1);
//   };

//   const addBurnoutEvent = (moodType: 'fatigue' | 'overwhelm' | 'stable' | 'gratitude', notes: string, energy: number) => {
//     const newEvent: BurnoutEvent = {
//       id: Math.random().toString(),
//       time: 'Just Now',
//       moodType,
//       energy,
//       notes
//     };
//     setBurnoutEvents(prev => [newEvent, ...prev]);
//     setEnergyLevel(energy);
//     setTotalStars(prev => prev + 1);
//   };

//   const triggerVoiceNote = () => {
//     if (voiceActive) {
//       // Stopped voice journal - transcribe
//       setVoiceActive(false);
//       setJournalText("Sarah rested for 3 hours after chemo #2. Feeling a slight knot in my stomach because her skin looks pale. However, her temperature is stable at 36.8°C. I offered some light ginger broth and we spoke about her nursery orchids. Feeling tired but incredibly glad her fever cleared up.");
//     } else {
//       setVoiceActive(true);
//     }
//   };

//   return (
//     <div className={`flex min-h-screen transition-all duration-500 font-sans ${theme === 'dark' ? 'dark bg-[#07040f] text-[#f5f0eb]' : 'bg-[#FAF8FD] text-[#1e133a]'}`}>
      
//       {/* 🔮 Background space specs fitting moonlight theme */}
//       <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 right-10 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#9b8ab8]/15 via-[#ea96a6]/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
//         <div className="absolute bottom-10 left-5 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#9c82ba]/10 via-[#d4798e]/5 to-transparent blur-3xl" />
//         <div className="absolute inset-0 bg-radial at-center from-transparent to-[#07040f]/10" />
//       </div>

//       {/* ── Sidebar Navigation ── */}
//       <aside
//         className={`fixed top-0 bottom-0 left-0 border-r backdrop-blur-md w-64 z-40 flex flex-col justify-between transition-all duration-300 transform md:translate-x-0 ${
//           sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
//         } ${theme === 'dark' ? 'bg-[#0f0a21]/90 border-[#c9a0dc]/15' : 'bg-[#FAF8FD]/95 border-[#7e6c9e]/20'}`}
//       >
//         <div>
//           {/* Brand header */}
//           <div className={`flex items-center justify-between px-6 py-5 border-b ${theme === 'dark' ? 'border-[#c9a0dc]/15' : 'border-[#7e6c9e]/20'}`}>
//             <div
//               onClick={() => onNavigate('/')}
//               className="flex items-center gap-2.5 cursor-pointer group"
//               title="Return to Landing Page"
//             >
//               <span className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#d4798e] to-[#9c82ba] flex items-center justify-center text-white text-lg font-black shadow-md animate-pulse">C</span>
//               <div>
//                 <span className="font-bold text-lg bg-gradient-to-r from-[#d4798e] to-[#c9a0dc] bg-clip-text text-transparent italic tracking-tight">
//                   ConstellaCare
//                 </span>
//                 <span className="block text-[8px] tracking-widest font-bold uppercase text-[#9b8ab8] mt-0.5">Caregiver Command</span>
//               </div>
//             </div>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="md:hidden p-1 rounded-full hover:bg-purple-100/10 text-[#9b8ab8]"
//             >
//               <X className="w-4.5 h-4.5" />
//             </button>
//           </div>

//           {/* Navigation Items */}
//           <nav className="p-4 space-y-5">
//             <div className="space-y-1">
//               <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#d4798e] block pl-2.5 mb-2.5">
//                 Support Center
//               </span>
//               {[
//                 { id: 'home', label: 'Dashboard Home 🪐', icon: <Compass className="w-3.5 h-3.5" /> },
//                 { id: 'shared', label: '✨ Shared Constellation', icon: <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> },
//                 { id: 'emotion', label: 'Astra Check-In', icon: <Activity className="w-3.5 h-3.5" /> },
//                 { id: 'appointments', label: 'Treatment Timeline', icon: <Calendar className="w-3.5 h-3.5" /> },
//                 { id: 'communication', label: 'Comm. Assistant', icon: <MessageSquare className="w-3.5 h-3.5" /> },
//                 { id: 'burnout', label: 'Emotional Weather', icon: <Zap className="w-3.5 h-3.5" /> },
//                 { id: 'circle', label: 'Care Orbit Circle', icon: <Users className="w-3.5 h-3.5" /> },
//                 { id: 'journal', label: 'Private Journal', icon: <Mic className="w-3.5 h-3.5" /> },
//               ].map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => {
//                     setActiveSection(item.id as CaregiverSection);
//                     setSidebarOpen(false);
//                   }}
//                   className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold leading-none capitalize transition-all duration-200 cursor-pointer ${
//                     activeSection === item.id
//                       ? 'bg-gradient-to-r from-[#decfe6] to-[#e8e2f4] text-[#1a1530] dark:from-[#211738] dark:to-[#120d21] dark:text-[#f4d4a8] border border-[#c9a0dc]/20'
//                       : 'bg-transparent text-[#624e80] dark:text-[#9b8ab8] hover:bg-purple-100/60 dark:hover:bg-[#1c1530]/50 font-semibold'
//                   }`}
//                 >
//                   <span className="text-sm">{item.icon}</span>
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           </nav>
//         </div>

//         {/* Global Stars Counter at bottom */}
//         <div className={`p-5 border-t ${theme === 'dark' ? 'border-[#c9a0dc]/15' : 'border-[#7e6c9e]/20'}`}>
//           <div className="bg-gradient-to-tr from-[#120d21] to-[#251a3d] text-[#f4d4a8] rounded-2xl p-4 border border-[#c9a0dc]/25 text-center relative overflow-hidden shadow-lg">
//             <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4798e]/10 blur-xl rounded-full" />
//             <Award className="w-6.5 h-6.5 text-[#f4d4a8] mx-auto animate-pulse" />
//             <span className="text-[9px] text-[#c9a0dc]/80 block font-mono font-bold tracking-widest mt-1">CAREGIVER CARESCORE</span>
//             <span className="text-xl font-black mt-1 block">{totalStars} ✨</span>
//             <p className="text-[10px] text-[#FAF8FD]/70 mt-1 lines-2 leading-relaxed">
//               Every coordination aid &amp; decompressionLights a star under same night sky.
//             </p>
//           </div>
//         </div>
//       </aside>

//       {/* ── Mobile Overlay ── */}
//       {sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 bg-[#07040f]/50 backdrop-blur-xs z-30 md:hidden transition-all"
//         />
//       )}

//       {/* ── Main Panel Area ── */}
//       <main className="flex-1 md:pl-64 min-h-screen flex flex-col z-10 relative">
        
//         {/* Interactive Header */}
//         <header className={`sticky top-0 backdrop-blur-md py-4 px-6 md:px-10 flex items-center justify-between border-b z-20 ${theme === 'dark' ? 'bg-[#07040f]/80 border-[#c9a0dc]/15' : 'bg-[#FAF8FD]/80 border-[#7e6c9e]/20'}`}>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="md:hidden p-2 bg-purple-100/10 hover:bg-purple-100/20 rounded-xl cursor-pointer"
//             >
//               <Compass className="w-5 h-5 text-[#d4798e]" />
//             </button>
//             <div>
//               <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#d4798e] block">COMMAND OVERVIEW</span>
//               <h1 className="text-base font-extrabold text-[#2e214c] dark:text-[#FAF8FD] flex items-center gap-1.5 capitalize">
//                 {activeSection === 'home' ? 'Operations Dashboard' : `${activeSection} Interface`}
//               </h1>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#d4798e]/10 to-[#9c82ba]/10 border border-[#d4798e]/35 px-3 py-1 rounded-full text-xs font-bold text-[#d4798e] dark:text-[#f4d4a8]">
//               <Star className="w-3.5 h-3.5 fill-[#d4798e] text-[#d4798e] animate-pulse" />
//               <span>{totalStars} stars aligned</span>
//             </div>

//             <button
//               onClick={onThemeToggle}
//               className="p-2 rounded-xl border border-transparent hover:border-[#c9a0dc]/20 hover:bg-purple-100/10 cursor-pointer"
//               aria-label="Toggle Theme"
//             >
//               {theme === 'dark' ? <Sun className="w-4 h-4 text-[#decfe6]" /> : <Moon className="w-4 h-4 text-[#3d3650]" />}
//             </button>
//           </div>
//         </header>

//         {/* Dynamic Warning Notification Card: Recovery Reminders Bubble */}
//         <div className="px-6 md:px-10 pt-4">
//           <div className="bg-gradient-to-r from-[#decfe6]/20 via-[#e8e2f4]/15 to-[#ea96a6]/5 border border-[#c9a0dc]/30 rounded-2xl p-3.5 flex items-start gap-3 shadow-sm relative overflow-hidden">
//             <span className="absolute top-0 right-0 w-8 h-8 bg-[#c9a0dc]/5 rounded-full blur-sm" />
//             <Sparkles className="w-4 h-4 text-[#d4798e] flex-shrink-0 mt-0.5 animate-bounce" />
//             <div>
//               <span className="text-[9px] font-black uppercase tracking-widest text-[#d4798e] block">RECOVERY COMPASS</span>
//               <p className="text-xs text-[#483a62] dark:text-[#FAF8FD]/90 italic mt-0.5 leading-relaxed font-semibold">{currentRecoveryRem}</p>
//             </div>
//           </div>
//         </div>

//         {/* ── Main Content Container ── */}
//         <div className="flex-1 p-6 md:p-10 max-w-5xl w-full mx-auto space-y-8 pb-32">
          
//           {/* ======================================= */}
//           {/*  SECTION 1: HOME DASHBOARD ✨          */}
//           {/* ======================================= */}
//           {activeSection === 'home' && (
//             <div className="space-y-8 animate-fade-in text-left">
              
//               {/* LIVE CONSTELLATION HERO HEADER */}
//               <div className={`relative overflow-hidden rounded-3xl p-7 md:p-9 border shadow-xl ${theme === 'dark' ? 'bg-[#120d21] text-[#FAF8FD] border-[#c9a0dc]/20' : 'bg-white text-slate-800 border-purple-200'}`}>
//                 {/* Nebula and Orbit animations background */}
//                 <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-45">
//                   <div className="absolute top-minus-10 right-minus-10 w-[200px] h-[200px] rounded-full bg-[#d4798e]/20 blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
//                   <div className="absolute top-2 w-[400px] h-[0.5px] border-t border-dashed border-[#c9a0dc]/15 animate-spin duration-[40s]" />
//                 </div>

//                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//                   <div>
//                     <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#d4798e]/10 border border-[#d4798e]/20 text-[#ea96a6] mb-3">
//                       <ShieldCheck className="w-2.5 h-2.5" /> Care coordination stable
//                     </span>
//                     <h2 className="text-xl md:text-2xl font-black tracking-tight">Sarah's support is part of her healing journey.</h2>
//                     <p className={`text-xs mt-1 max-w-lg leading-relaxed ${theme === 'dark' ? 'text-[#9b8ab8]' : 'text-slate-600'}`}>
//                       Two stars orbiting the same night sky, closer together. You have saved <b className={theme === 'dark' ? 'text-[#f4d4a8]' : 'text-purple-700'}>4 treatment parameters</b> this week. Sarah's current fatigue index is moderate.
//                     </p>
//                   </div>
//                   <div className="hidden md:block flex-shrink-0 bg-[#07040f]/50 p-4 rounded-full border border-[#c9a0dc]/10 animate-bounce cursor-pointer" style={{ animationDuration: '3s' }}>
//                     <Heart className="w-10 h-10 fill-[#d4798e] text-[#d4798e] opacity-80" />
//                   </div>
//                 </div>
//               </div>

//               {/* THREE COLUMN GRID LAYOUT */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
//                 {/* LEFT — Emotional Orbit Card */}
//                 <div className={`border rounded-3.5xl p-6 shadow-md text-left flex flex-col justify-between ${theme === 'dark' ? 'bg-[#120d21] border-[#c9a0dc]/15 text-[#FAF8FD]' : 'bg-white border-purple-100 text-slate-800'}`}>
//                   <div>
//                     <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5">
//                       <Activity className="w-4 h-4" /> Emotional Orbit
//                     </h4>
//                     <span className={`text-[10px] mt-0.5 block ${theme === 'dark' ? 'text-[#9b8ab8]' : 'text-slate-500'}`}>Visualizing collective caregiver burden</span>

//                     {/* Simple Rotating Orb Visualizer built of circles */}
//                     <div className="relative w-44 h-44 mx-auto my-6 flex items-center justify-center border border-[#9b8ab8]/10 rounded-full">
//                       <div className="absolute inset-2 border border-dashed border-[#9b8ab8]/20 rounded-full animate-spin duration-[24s]" />
//                       <div className="absolute inset-8 border border-dashed border-[#d4798e]/15 rounded-full animate-spin duration-[15s]" />
                      
//                       {/* Patient central node */}
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d4798e] to-[#ea96a6] flex items-center justify-center text-[10px] text-white font-black shadow-lg ring-4 ring-[#d4798e]/20 z-10 animate-pulse">
//                         Sarah
//                       </div>

//                       {/* Caregiver star orbiting */}
//                       <div className={`absolute top-1 left-8 w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shadow animate-bounce ${theme === 'dark' ? 'bg-[#1c1530] border-[#f4d4a8] text-[#f4d4a8]' : 'bg-purple-100 border-purple-400 text-purple-700'}`}>
//                         You
//                       </div>
//                     </div>

//                     <div className={`space-y-2.5 mt-2 p-3.5 rounded-2xl border font-mono text-[10px] ${theme === 'dark' ? 'bg-[#07040f]/60 border-[#c9a0dc]/5 text-[#decfe6]' : 'bg-purple-50/50 border-purple-100 text-purple-950'}`}>
//                       <div className="flex justify-between items-center">
//                         <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-[#9b8ab8]' : 'text-slate-600'}`}>✨ Patient Stability:</span>
//                         <span className="text-yellow-500 dark:text-yellow-400 font-extrabold">Moderate</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-[#9b8ab8]' : 'text-slate-600'}`}>⛈️ Burnout Risk:</span>
//                         <span className="text-red-500 dark:text-red-400 font-extrabold">Elevated</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-[#9b8ab8]' : 'text-slate-600'}`}>📅 Stress Window:</span>
//                         <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Next chemo cycle</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* CENTER — Astra Care Insights */}
//                 <div className={`border rounded-3.5xl p-6 shadow-md flex flex-col justify-between ${theme === 'dark' ? 'bg-[#120d21] border-[#c9a0dc]/15' : 'bg-white border-purple-100 text-slate-800'}`}>
//                   <div>
//                     <div className="flex items-center justify-between border-b pb-2.5 mb-3.5 border-purple-100/10">
//                       <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5 leading-none">
//                         <Sparkles className="w-4 h-4 fill-[#d4798e]" /> Astra Care Insights
//                       </h4>
//                       <span className="text-[8px] font-mono border border-[#d4798e]/30 px-1.5 py-0.5 rounded text-[#d4798e]">AI DETECTED</span>
//                     </div>

//                     <div className={`space-y-4 text-xs leading-relaxed ${theme === 'dark' ? 'text-[#decfe6]' : 'text-slate-700'}`}>
//                       <div className="bg-gradient-to-r from-[#d4798e]/10 to-[#9c82ba]/5 p-3 rounded-xl border-l-2 border-[#d4798e]">
//                         <p className="font-bold text-[#ea96a6]">⚖️ Stress Load Leveling</p>
//                         <p className="mt-1 text-[11px] leading-relaxed">
//                           "You’ve carried high emotional load for 5 days. Consider planning a recovery evening or allowing Chloe to handle meal logistics this Friday."
//                         </p>
//                       </div>

//                       <div className="bg-gradient-to-r from-[#9c82ba]/10 to-[#decfe6]/5 p-3 rounded-xl border-l-2 border-[#9c82ba]">
//                         <p className="font-bold text-[#c9a0dc]">🩺 Anxiety Triggers noticed</p>
//                         <p className="mt-1 text-[11px] leading-relaxed">
//                           "Sarah’s anxiety appears highest before oncology scans. Tap the 'What should I say?' panel to customize reassurance text sheets."
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => setActiveSection('communication')}
//                     className="w-full mt-4 bg-gradient-to-r from-[#d4798e] to-[#9c82ba] text-white font-sans text-xs font-bold py-2.5 rounded-xl shadow-md cursor-pointer hover:scale-[1.01] transition"
//                   >
//                     Load reassurance builders →
//                   </button>
//                 </div>

//                 {/* RIGHT — Shared Care Tasks (Notion layout) */}
//                 <div className="bg-white dark:bg-[#120d21] border border-[#7e6c9e]/20 dark:border-[#c9a0dc]/15 rounded-3.5xl p-6 shadow-md flex flex-col justify-between">
//                   <div>
//                     <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5">
//                       <CheckCircle className="w-4 h-4 text-[#d4798e]" /> Shared Care Tasks
//                     </h4>
//                     <span className="text-[10px] text-[#4d3c69] dark:text-[#9b8ab8] mt-0.5 block font-semibold">Daily operational checklist</span>

//                     <div className="space-y-2 mt-4 max-h-56 overflow-y-auto pr-1">
//                       {tasks.map((task) => (
//                         <div
//                           key={task.id}
//                           className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
//                             task.done
//                               ? 'bg-[#decfe6]/10 border-transparent opacity-60 line-through'
//                               : 'bg-slate-50 border-[#7e6c9e]/15 dark:bg-[#07040f]/60 dark:border-[#c9a0dc]/10 hover:border-[#d4798e]/30'
//                           }`}
//                         >
//                           <div className="flex items-start gap-2.5 flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
//                             <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center flex-shrink-0 ${
//                               task.done ? 'bg-[#d4798e] border-[#d4798e] text-white' : 'border-[#9b8ab8]'
//                             }`}>
//                               {task.done && <CheckCircle className="w-3 h-3 text-[#120d21] fill-white" />}
//                             </div>
//                             <div>
//                               <p className="text-xs text-[#3d3650] dark:text-[#FAF8FD] font-semibold leading-tight">{task.label}</p>
//                               <span className="text-[8px] text-[#9b8ab8] uppercase font-bold tracking-wider mt-0.5 block">{task.time} // {task.category}</span>
//                             </div>
//                           </div>
                          
//                           <button onClick={() => removeTask(task.id)} className="text-[#9b8ab8] hover:text-[#d4798e] p-1 rounded-lg">
//                             <Trash className="w-3.5 h-3.5" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <form
//                     onSubmit={(e) => {
//                       e.preventDefault();
//                       const form = e.currentTarget;
//                       const text = new FormData(form).get('taskText') as string;
//                       if (!text.trim()) return;
//                       addTask(text, 'wellness', 'Morning');
//                       form.reset();
//                     }}
//                     className="mt-4 flex gap-1.5"
//                   >
//                     <input
//                       name="taskText"
//                       type="text"
//                       placeholder="Add coordination task..."
//                       className="flex-1 text-[11px] px-3 py-2 border rounded-xl bg-transparent text-[#3d3650] dark:text-white border-[#7e6c9e]/20 dark:border-[#c9a0dc]/15 focus:outline-none focus:border-[#d4798e]"
//                     />
//                     <button
//                       type="submit"
//                       className="p-2 rounded-xl bg-[#d4798e]/10 text-[#d4798e] border border-[#d4798e]/20 cursor-pointer hover:bg-[#d4798e]/25"
//                     >
//                       <Plus className="w-3.5 h-3.5" />
//                     </button>
//                   </form>
//                 </div>

//               </div>

//               {/* TWO SIDES: ENERGY BATTERY SYSTEM & PATTERN RECOGNITION */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                
//                 {/* ENERGY BATTERY SYSTEM */}
//                 <div className="bg-white dark:bg-[#120d21] border border-[#7e6c9e]/20 dark:border-[#c9a0dc]/15 rounded-3.5xl p-6 shadow-md text-left">
//                   <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5">
//                     <Battery className="w-4 h-4 text-emerald-500" /> Support Battery Cell
//                   </h4>
//                   <p className="text-[10px] text-[#4d3c69] dark:text-[#9b8ab8] mt-0.5 font-semibold">Caregivers need fuel to light paths</p>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5 items-center">
//                     {/* Glowing circular battery container */}
//                     <div className="relative w-28 h-28 mx-auto flex flex-col items-center justify-center rounded-full bg-gradient-to-tr from-[#9c82ba]/10 to-transparent border border-[#d4798e]/15 shadow-inner">
//                       {/* Active cosmic pulse background */}
//                       <div className="absolute inset-2 rounded-full border border-dashed border-[#d4798e]/30 scale-95 animate-spin duration-[15s]" />
//                       <Battery className="w-7 h-7 text-[#ea96a6] animate-pulse" />
//                       <span className="text-lg font-black text-slate-800 dark:text-white mt-1 leading-none">{energyLevel}%</span>
//                       <span className="text-[8px] font-mono text-[#9b8ab8] uppercase mt-0.5">Capacitor</span>
//                     </div>

//                     {/* Stats details bar */}
//                     <div className="sm:col-span-2 space-y-3 font-sans text-xs">
//                       <div>
//                         <div className="flex justify-between items-center text-[#32254d] dark:text-[#FAF8FD] font-semibold">
//                           <span>🔋 Emotional Energy</span>
//                           <span>{energyLevel}%</span>
//                         </div>
//                         <div className="w-full bg-purple-100 dark:bg-[#07040f] h-2 rounded-full mt-1 overflow-hidden">
//                           <div className="bg-gradient-to-r from-[#d4798e] to-[#ea96a6] h-full rounded-full transition-all duration-500" style={{ width: `${energyLevel}%` }} />
//                         </div>
//                       </div>

//                       <div>
//                         <div className="flex justify-between items-center text-[#32254d] dark:text-[#FAF8FD] font-semibold">
//                           <span>🔄 Recovery Speed</span>
//                           <span>{recoveryScore}%</span>
//                         </div>
//                         <div className="w-full bg-purple-100 dark:bg-[#07040f] h-2 rounded-full mt-1 overflow-hidden">
//                           <div className="bg-gradient-to-r from-blue-300 to-[#9c82ba] h-full rounded-full transition-all duration-500" style={{ width: `${recoveryScore}%` }} />
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between p-2 rounded-xl bg-[#decfe6]/10 border border-[#c9a0dc]/10 font-mono text-[9px]">
//                         <span className="text-[#9b8ab8]">EMOTIONAL LOAD STATUS:</span>
//                         <span className="font-extrabold text-[#ea96a6]">{emotionalLoad}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ADVANCED AI PATTERNS */}
//                 <div className="bg-white dark:bg-[#120d21] border border-[#7e6c9e]/20 dark:border-[#c9a0dc]/15 rounded-3.5xl p-6 shadow-md text-left flex flex-col justify-between">
//                   <div>
//                     <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5">
//                       <ShieldCheck className="w-4 h-4 text-emerald-500" /> Astra Pattern Recognition
//                     </h4>
//                     <span className="text-[10px] text-[#4d3c69] dark:text-[#9b8ab8] mt-0.5 block font-semibold">Advanced correlation logs</span>

//                     <div className="space-y-3 mt-4">
//                       <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8FD] dark:bg-[#07040f] border border-[#c9a0dc]/10 text-xs text-[#3d3650] dark:text-[#FAF8FD]">
//                         <Activity className="w-4.5 h-4.5 text-[#d4798e] flex-shrink-0 mt-0.5" />
//                         <div>
//                           <p className="font-bold text-[#ea96a6]">Exhaustion Patterns Detected</p>
//                           <p className="text-[11px] text-slate-600 dark:text-[#9b8ab8] mt-0.5 leading-relaxed">
//                             Astra has identified higher stress levels logged around late evenings. We recommend complete mental off-grid times after 9:30 PM.
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8FD] dark:bg-[#07040f] border border-[#c9a0dc]/10 text-xs text-[#3d3650] dark:text-[#FAF8FD]">
//                         <CheckCircle className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
//                         <div>
//                           <p className="font-bold text-emerald-500">Co-Regulation Alignment positive</p>
//                           <p className="text-[11px] text-slate-600 dark:text-[#9b8ab8] mt-0.5 leading-relaxed">
//                             Sarah logged calmer anxiety levels (+25% relief) on mornings immediately following pre-appointment question prep sessions.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//               </div>

//             </div>
//           )}

//           {/* ======================================= */}
//           {/*  SECTION 2: ASTRA CHECK-IN (EMOTIONS)   */}
//           {/* ======================================= */}
//           {activeSection === 'emotion' && (
//             <div className="space-y-8 animate-fade-in text-left">
//               <div className="bg-white dark:bg-[#120d21] border border-[#7e6c9e]/25 dark:border-[#c9a0dc]/15 rounded-3xl p-6 shadow-xl relative overflow-hidden">
//                 <span className="absolute inset-0 bg-radial from-purple-500/5 to-transparent blur-2xl" />
//                 <h3 className="text-md font-extrabold text-slate-800 dark:text-[#FAF8FD] flex items-center gap-2">
//                   <Activity className="w-5 h-5 text-[#d4798e]" /> Decompress Check-In
//                 </h3>
//                 <p className="text-xs text-[#7e6c9e] dark:text-[#9b8ab8] mt-1.5 leading-relaxed">
//                   Your emotional storage capacity is not infinite. Select exactly how you feel with absolute permission to carry frustration, quiet tiredness, or peace.
//                 </p>

//                 {/* Interactive Emotion Selecting Cards */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//                   {[
//                     { id: 'exhausted', emoji: '🌙', title: 'Physically Exhausted', color: 'from-[#e1dbec] to-[#decfe6] dark:to-[#2c1a4d] border-[#c9a0dc]' },
//                     { id: 'worried', emoji: '🌪️', title: 'Anxious & Worried', color: 'from-[#faecee] to-[#ea96a6] dark:to-pink-900 border-[#ea96a6]' },
//                     { id: 'peaceful', emoji: '🌱', title: 'Calm & Grounded', color: 'from-emerald-100 to-emerald-200 dark:to-emerald-950 border-emerald-500' },
//                     { id: 'overwhelmed', emoji: '🌫️', title: 'Numb / Overwhelmed', color: 'from-slate-100 to-[#decfe6] dark:to-slate-800 border-slate-500' },
//                   ].map((card) => (
//                     <button
//                       key={card.id}
//                       onClick={() => triggerEmotionCheckIn(card.id, card.title)}
//                       className={`p-4 border rounded-2xl bg-gradient-to-b flex flex-col items-center text-center gap-2 cursor-pointer hover:scale-[1.03] hover:border-[#d4798e] transition ${card.color} ${
//                         selectedEmotion === card.id ? 'ring-4 ring-[#d4798e]/40 shadow-lg' : 'shadow-sm border-[#7e6c9e]/15'
//                       }`}
//                     >
//                       <span className="text-3xl animate-pulse">{card.emoji}</span>
//                       <span className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">{card.title}</span>
//                     </button>
//                   ))}
//                 </div>

//                 {/* Emotional feedback panel */}
//                 {selectedEmotion && (
//                   <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#d4798e]/10 to-[#9c82ba]/5 border border-[#d4798e]/30 flex gap-3 text-xs leading-relaxed text-[#3d3650] dark:text-[#FAF8FD]">
//                     <Sparkles className="w-5 h-5 text-[#d4798e] flex-shrink-0 animate-pulse mt-0.5" />
//                     <div>
//                       <b className="uppercase text-[9px] text-[#ea96a6] tracking-widest block font-bold">Astra Companionship Response</b>
//                       <p className="mt-1 leading-relaxed text-[#7e6c9e] dark:text-[#decfe6]">{emotionFeedback}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ======================================= */}
//           {/*  SECTION 3: TREATMENT TIMELINE          */}
//           {/* ======================================= */}
//           {activeSection === 'appointments' && (
//             <div className="space-y-8 animate-fade-in text-left">
              
//               <div className="bg-white dark:bg-[#120d21] border border-[#7e6c9e]/20 dark:border-[#c9a0dc]/15 rounded-3xl p-6 shadow-xl text-left">
//                 <div className="flex items-center justify-between border-b border-purple-100/10 pb-4 mb-6">
//                   <div>
//                     <h3 className="text-md font-extrabold text-[#3d3650] dark:text-white flex items-center gap-1.5">
//                       <Calendar className="w-5 h-5 text-[#d4798e]" /> Shared Appointment &amp; Treatment Pipeline
//                     </h3>
//                     <p className="text-xs text-[#7e6c9e] dark:text-[#9b8ab8] mt-1">Light alignment pathways for oncology visits</p>
//                   </div>
                  
//                   <button
//                     onClick={() => {
//                       const title = prompt("Enter treatment milestone title:");
//                       if (!title) return;
//                       const date = prompt("Enter scheduled date:", "Tomorrow");
//                       const transport = prompt("Enter transport details:", "Transport unarranged");
//                       const notes = prompt("Pin initial care notes:");
                      
//                       const newEvent = {
//                         id: Math.random().toString(),
//                         title,
//                         date: date || 'Upcoming',
//                         time: '12:05 PM',
//                         transport: transport || 'Unarranged',
//                         medsLogged: false,
//                         notesPinned: notes || 'No notes'
//                       };
//                       setAppointments(prev => [newEvent, ...prev]);
//                     }}
//                     className="px-3 py-1.5 rounded-xl bg-[#d4798e]/10 border border-[#d4798e]/25 text-[#d4798e] text-xs font-bold hover:bg-[#d4798e]/20 cursor-pointer"
//                   >
//                     + Add Milestone
//                   </button>
//                 </div>

//                 <div className="relative pl-7 border-l border-dashed border-[#c9a0dc]/30 space-y-8 text-xs">
//                   {appointments.map((app, idx) => (
//                     <div key={app.id} className="relative">
//                       {/* Pulsing star node on timeline path */}
//                       <span className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#120d21] bg-gradient-to-r from-[#d4798e] to-[#9c82ba] ring-4 ring-[#d4798e]/20 shadow animate-pulse" />

//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#07040f]/60 hover:bg-[#decfe6]/10 hover:border-[#d4798e]/25 border border-[#7e6c9e]/15 dark:border-[#c9a0dc]/10 transition-all">
//                         <div className="md:col-span-3 space-y-1">
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <span className="bg-[#d4798e]/10 hover:shadow text-[#d4798e] font-extrabold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{app.date} // {app.time}</span>
//                             <span className="text-[#9b8ab8] text-[10px] font-mono select-all">🚙 {app.transport}</span>
//                           </div>
                          
//                           <h4 className="text-sm font-extrabold text-[#3d3650] dark:text-[#f4d4a8] leading-snug">{app.title}</h4>
//                           <p className="text-[#7e6c9e] dark:text-[#decfe6] text-[11px] leading-relaxed italic pr-2">📝 Pinned guidelines: "{app.notesPinned}"</p>
//                         </div>

//                         {/* Interactive column */}
//                         <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 border-[#7e6c9e]/10 pt-3 md:pt-0 pl-0 md:pl-4 md:border-l border-dashed border-purple-100/10">
//                           <label className="flex items-center gap-2 cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={app.medsLogged}
//                               onChange={() => {
//                                 setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, medsLogged: !a.medsLogged } : a));
//                               }}
//                               className="accent-[#d4798e] rounded"
//                             />
//                             <span className="text-[10px] font-bold text-[#7e6c9e] dark:text-[#FAF8FD]/90">Meds arranged</span>
//                           </label>

//                           <button
//                             onClick={() => {
//                               const note = prompt("Edit pinned oncologist notes:", app.notesPinned);
//                               if (note !== null) {
//                                 setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, notesPinned: note } : a));
//                               }
//                             }}
//                             className="w-full text-center py-1 rounded bg-[#decfe6]/20 border border-[#c9a0dc]/10 text-xs text-[#9b8ab8] hover:text-[#d4798e]"
//                           >
//                             Edit notes
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//             </div>
//           )}

//           {/* ======================================= */}
//           {/*  SECTION 4: COMMUNICATION ASSISTANT     */}
//           {/* ======================================= */}
//           {activeSection === 'communication' && (
//             <div className="space-y-8 animate-fade-in text-left">
              
//               <div className="bg-white dark:bg-[#120d21] border border-[#7e6c9e]/20 dark:border-[#c9a0dc]/15 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[520px] relative">
//                 {/* Header */}
//                 <div className="bg-[#120d21] p-4 border-b border-[#c9a0dc]/15 flex items-center justify-between">
//                   <div className="flex items-center gap-2.5">
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d4798e] via-[#9c82ba] to-[#decfe6] flex items-center justify-center text-white scale-102 ring-2 ring-[#d4798e]">
//                       <MessageSquare className="w-4 h-4 text-white fill-none" />
//                     </div>
//                     <div>
//                       <h3 className="text-xs font-black tracking-widest text-[#d4798e] uppercase">WHAT SHOULD I SAY?</h3>
//                       <p className="text-[9px] text-[#9b8ab8] font-mono">EMPATHETIC PHRASING SYNTHESISE // ACTIVE</p>
//                     </div>
//                   </div>
                  
//                   <span className="text-[9px] border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded font-mono animate-pulse">
//                     ● ASTRA SECURE FEED
//                   </span>
//                 </div>

//                 {/* Speech bubbled dialogue container */}
//                 <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40 dark:bg-[#07040f]/40">
//                   {commChat.map((msg, index) => (
//                     <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//                       <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
//                         msg.sender === 'user'
//                           ? 'bg-[#120d21] text-white dark:bg-[#f4d4a8] dark:text-[#120d21] rounded-tr-none'
//                           : 'bg-white text-slate-700 dark:bg-[#120d21]/90 dark:text-[#decfe6] rounded-tl-none border border-[#7e6c9e]/15 dark:border-[#c9a0dc]/15'
//                       }`}>
//                         <p className="whitespace-pre-line leading-relaxed font-semibold">{msg.text}</p>
                        
//                         {/* Suggestion list */}
//                         {msg.solutions && (
//                           <div className="mt-3 flex flex-col gap-2 border-t border-[#7e6c9e]/10 pt-2 text-left">
//                             <span className="text-[8px] font-mono text-[#9b8ab8] uppercase font-bold tracking-wider">Tap a quick query prompt:</span>
//                             {msg.solutions.map((sol, sIdx) => (
//                               <button
//                                 key={sIdx}
//                                 onClick={() => handleSendCommQuery(sol)}
//                                 className="w-full text-left p-2.5 rounded-xl border border-[#c9a0dc]/20 bg-[#decfe6]/10 text-xs text-[#d4798e] hover:bg-[#d4798e]/10 cursor-pointer font-bold leading-normal transition"
//                               >
//                                 {sol}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}

//                   {typing && (
//                     <div className="flex justify-start">
//                       <div className="bg-white dark:bg-[#120d21] border border-[#c9a0dc]/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-1 text-[#9b8ab8] text-xs font-bold shadow-inner">
//                         <span className="w-1.5 h-1.5 bg-[#d4798e] rounded-full animate-bounce" />
//                         <span className="w-1.5 h-1.5 bg-[#d4798e] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
//                         <span className="w-1.5 h-1.5 bg-[#d4798e] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
//                         <span className="ml-1">Formulating reassurance guidelines...</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Input panel bar */}
//                 <div className="p-4 bg-white dark:bg-[#1c1530]/40 border-t border-[#7e6c9e]/15 dark:border-[#c9a0dc]/15 flex gap-2">
//                   <input
//                     type="text"
//                     placeholder="Ask how to frame difficult discussions (e.g. telling sibling bad symptoms)..."
//                     value={commQuery}
//                     onChange={(e) => setCommQuery(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleSendCommQuery()}
//                     className="flex-1 text-xs px-4 py-3 border rounded-xl bg-transparent text-[#3d3650] dark:text-[#decfe6] border-[#7e6c9e]/25 dark:border-[#c9a0dc]/15 focus:outline-none focus:border-[#d4798e]"
//                   />
//                   <button
//                     onClick={() => handleSendCommQuery()}
//                     className="w-11 h-11 rounded-xl bg-[#d4798e] hover:bg-[#ea96a6] text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-103 transition"
//                   >
//                     <Send className="w-4.5 h-4.5 fill-white text-none" />
//                   </button>
//                 </div>
//               </div>

//             </div>
//           )}

//           {/* ======================================= */}
//           {/*  SECTION 5: BURNOUT WEATHER TIMELINE    */}
//           {/* ======================================= */}
//           {activeSection === 'burnout' && (
//             <div className="space-y-8 animate-fade-in text-left">
              
//               <div className="bg-white dark:bg-[#120d21] border border-[#7e6c9e]/20 dark:border-[#c9a0dc]/15 rounded-3xl p-6 shadow-xl leading-relaxed text-left">
//                 <h3 className="text-md font-extrabold text-[#3d3650] dark:text-white flex items-center gap-1.5">
//                   <Zap className="w-5 h-5 text-[#d4798e] animate-pulse" /> Emotional Weather Timeline
//                 </h3>
//                 <p className="text-xs text-[#7e6c9e] dark:text-[#9b8ab8] mt-1">Spotting fatigue accumulation to map safe bounds</p>

//                 {/* Dynamic Logging Button Box */}
//                 <div className="mt-5 p-4 rounded-2xl bg-purple-50/55 dark:bg-[#07040f] border border-purple-100/60 dark:border-[#c9a0dc]/15 grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <span className="text-[9px] font-black uppercase tracking-widest text-[#d4798e] block">Log Decompression Node</span>
//                     <p className="text-[11px] text-purple-950 dark:text-[#9b8ab8] leading-relaxed mt-1">Log fatigue instances to unlock rest offsets dynamically.</p>
                    
//                     <div className="flex gap-2 flex-wrap mt-3">
//                       <button
//                         onClick={() => addBurnoutEvent('fatigue', 'Felt deep mental tiredness after arranging schedules.', 40)}
//                         className="px-3 py-1.5 rounded-xl border border-purple-300 dark:border-[#c9a0dc]/20 text-[10px] bg-[#d4798e]/10 text-purple-700 dark:text-[#d4798e] font-bold cursor-pointer"
//                       >
//                         ☁️ Log Fatigue Spike
//                       </button>
//                       <button
//                         onClick={() => addBurnoutEvent('overwhelm', 'Worry index high before radiotherapy planning.', 25)}
//                         className="px-3 py-1.5 rounded-xl border border-pink-500/20 text-[10px] bg-pink-500/10 text-pink-700 dark:text-[#ea96a6] font-bold cursor-pointer"
//                       >
//                         🌧️ Log Overwhelm
//                       </button>
//                     </div>
//                   </div>
                  
//                   {/* Cosmetic fog canvas gradient representation */}
//                   <div className="relative rounded-xl overflow-hidden h-24 bg-gradient-to-tr from-purple-100/40 to-slate-50 dark:from-[#251a3d] dark:to-[#07040f] flex flex-col justify-center items-center p-3 text-center border border-dashed border-purple-300/60 dark:border-[#c9a0dc]/15">
//                     <div className="absolute inset-0 bg-radial from-violet-600/10 to-transparent animate-pulse filter blur-xl" />
//                     <span className="text-xl animate-spin" style={{ animationDuration: '24s' }}>🌀</span>
//                     <span className="text-[10px] font-bold text-purple-700 dark:text-[#ea96a6] mt-1 uppercase tracking-wider">Atmosphere: Starry &amp; Hazy</span>
//                     <span className="text-[8px] text-purple-900/60 dark:text-[#9b8ab8] mt-0.5 font-mono">Micro-recoveries settling slowly</span>
//                   </div>
//                 </div>

//                 {/* Vertical Timeline Lists */}
//                 <div className="space-y-4 mt-8">
//                   <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#d4798e] block pl-1">Historical Weather Chart</span>
                  
//                   <div className="space-y-4">
//                     {burnoutEvents.map((evt) => (
//                       <div
//                         key={evt.id}
//                         className="p-4 rounded-2xl bg-slate-50 dark:bg-[#07040f]/40 border border-[#7e6c9e]/15 dark:border-[#c9a0dc]/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left hover:border-purple-300 dark:hover:border-[#c9a0dc]/25 transition shadow-sm"
//                       >
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-2">
//                             <span className="text-[10px] text-[#7e6c9e] dark:text-[#9b8ab8] font-mono uppercase tracking-wider font-bold">{evt.time}</span>
//                             <span className={`text-[8px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
//                               evt.moodType === 'fatigue' ? 'bg-[#c9a0dc]/20 text-purple-700 dark:text-[#c9a0dc]' :
//                               evt.moodType === 'overwhelm' ? 'bg-rose-500/10 text-pink-600 dark:text-[#ea96a6]' :
//                               evt.moodType === 'stable' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
//                               'bg-amber-400/10 text-amber-600 dark:text-amber-300'
//                             }`}>
//                               {evt.moodType}
//                             </span>
//                           </div>
                          
//                           <p className="text-xs font-semibold text-slate-800 dark:text-[#f4d4a8] leading-tight pr-3">"{evt.notes}"</p>
//                         </div>

//                         <div className="flex items-center gap-2 flex-shrink-0">
//                           <span className="text-[9px] font-mono text-purple-950 dark:text-[#9b8ab8] uppercase font-bold text-right mt-0.5">Energy Level:</span>
//                           <span className="text-xs font-black text-slate-800 dark:text-white">{evt.energy}%</span>
//                           <div className="w-12 h-1.5 rounded-full bg-purple-100 dark:bg-[#07040f] overflow-hidden">
//                             <div className="bg-[#d4798e] h-full rounded-full" style={{ width: `${evt.energy}%` }} />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//             </div>
//           )}

//           {/* ======================================= */}
//           {/*  SECTION 6: CARE ORBIT VISUALIZER      */}
//           {/* ======================================= */}
//           {activeSection === 'circle' && (
//             <div className="space-y-8 animate-fade-in text-left">
              
//               <div className="bg-white dark:bg-[#120d21] border border-[#7e6c9e]/20 dark:border-[#c9a0dc]/15 rounded-3xl p-6 shadow-xl leading-relaxed text-left">
//                 <div className="border-b pb-4 mb-6 border-purple-100/10">
//                   <h3 className="text-md font-extrabold text-[#3d3650] dark:text-white flex items-center gap-1.5">
//                     <Users className="w-5 h-5 text-[#d4798e]" /> Concentric Care Support Circle
//                   </h3>
//                   <p className="text-xs text-[#7e6c9e] dark:text-[#9b8ab8] mt-1">Mapping communication resonance, support strain, and orbital connectivity</p>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
//                   {/* LEFT - Orbit Visualizer Area (8-column equivalent weight) */}
//                   <div className="lg:col-span-7 bg-purple-50/20 dark:bg-[#07040f] relative rounded-3.5xl p-6 border border-purple-200/50 dark:border-[#c9a0dc]/10 text-center h-[340px] flex items-center justify-center overflow-hidden">
//                     {/* Concentric rotating SVG orbits */}
//                     <div className="absolute inset-6 border border-dashed border-purple-200/50 dark:border-[#c9a0dc]/15 rounded-full animate-spin duration-[40s]" />
//                     <div className="absolute inset-16 border border-dashed border-teal-400/20 rounded-full animate-spin duration-[28s]" />
//                     <div className="absolute inset-26 border border-dashed border-pink-400/20 dark:border-[#d4798e]/10 rounded-full animate-spin duration-[15s]" />

//                     {/* SVG connecting orbit visual pulses */}
//                     <svg className="absolute inset-0 w-full h-full pointer-events-none">
//                       {/* Connection trails */}
//                       <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="rgba(212,145,158,0.3)" strokeDasharray="4" strokeWidth="1" />
//                       <line x1="50%" y1="50%" x2="80%" y2="35%" stroke="rgba(156,130,186,0.3)" strokeDasharray="4" strokeWidth="1" />
//                       <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="rgba(147,197,253,0.3)" strokeDasharray="4" strokeWidth="1" />
//                       <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="rgba(45,212,191,0.3)" strokeDasharray="4" strokeWidth="1" />
//                     </svg>

//                     {/* Central anchor node */}
//                     <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#d4798e] via-[#9c82ba] to-[#decfe6] flex flex-col items-center justify-center text-white font-black shadow-2xl z-10 animate-pulse cursor-pointer">
//                       <Heart className="w-4.5 h-4.5 fill-white text-none animate-pulse" />
//                       <span className="text-[10px] mt-0.5 tracking-tight font-black">SARAH</span>
//                     </div>

//                     {/* Orbiting nodes */}
//                     <div className="absolute top-12 left-12 w-11 h-11 rounded-full bg-gradient-to-tr from-rose-300 to-amber-200 border border-white flex flex-col items-center justify-center text-[#1a1530] font-bold text-[8px] tracking-tight shadow-md z-12 cursor-pointer hover:scale-105 duration-300">
//                       <span>Mom</span>
//                       <span className="text-[6px] tracking-normal opacity-70">Active</span>
//                     </div>

//                     <div className="absolute top-24 right-10 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-300 to-indigo-100 border border-white flex flex-col items-center justify-center text-[#1a1530] font-bold text-[8px] tracking-tight shadow-md z-12 cursor-pointer hover:scale-105 duration-300">
//                       <span>Oncologist</span>
//                       <span className="text-[6px] tracking-normal opacity-70">Dr. Moss</span>
//                     </div>

//                     <div className="absolute bottom-10 right-20 w-11 h-11 rounded-full bg-gradient-to-tr from-blue-350 to-indigo-50 border border-white flex flex-col items-center justify-center text-[#1a1530] font-bold text-[8px] tracking-tight shadow-md z-12 cursor-pointer hover:scale-105 duration-300">
//                       <span>Sister</span>
//                       <span className="text-[6px] tracking-normal opacity-70">Chloe</span>
//                     </div>

//                     <div className="absolute bottom-14 left-14 w-10 h-10 rounded-full bg-gradient-to-tr from-teal-300 to-emerald-200 border border-white flex flex-col items-center justify-center text-[#1a1530] font-bold text-[8px] tracking-tight shadow-md z-12 cursor-pointer hover:scale-105 duration-300">
//                       <span>Friend</span>
//                       <span className="text-[6px] tracking-normal opacity-70">Gavin</span>
//                     </div>
//                   </div>

//                   {/* RIGHT - Actions list */}
//                   <div className="lg:col-span-5 space-y-4">
//                     <span className="text-xs font-bold uppercase tracking-widest text-[#d4798e] block">Orbit Status Cards</span>
                    
//                     <div className="space-y-2.5">
//                       <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#07040f] border border-[#7e6c9e]/15 dark:border-[#c9a0dc]/10 text-xs text-left">
//                         <div className="flex justify-between font-bold">
//                           <span className="text-slate-800 dark:text-[#f4d4a8]">Mother (Mom)</span>
//                           <span className="text-emerald-500 font-mono text-[9px]">ACTIVE</span>
//                         </div>
//                         <p className="text-[11px] text-[#7e6c9e] dark:text-[#9b8ab8] mt-1 leading-normal">"Checked Sarah's morning hydration. Arranged lunch porridge."</p>
//                       </div>

//                       <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#07040f] border border-[#7e6c9e]/15 dark:border-[#c9a0dc]/10 text-xs text-left">
//                         <div className="flex justify-between font-bold">
//                           <span className="text-slate-800 dark:text-[#f4d4a8]">Oncology Lead (Dr. Moss)</span>
//                           <span className="text-[#9c82ba] font-mono text-[9px]">CLINICAL</span>
//                         </div>
//                         <p className="text-[11px] text-[#7e6c9e] dark:text-[#9b8ab8] mt-1 leading-normal">"Provided scan parameter updates. Safe bounds aligned."</p>
//                       </div>
//                     </div>
//                   </div>

//                 </div>
//               </div>

//             </div>
//           )}

//           {/* ======================================= */}
//           {/*  SECTION 7: CAREGIVER PRIVATE JOURNAL   */}
//           {/* ======================================= */}
//           {activeSection === 'journal' && (
//             <div className="space-y-8 animate-fade-in text-left">
              
//               <div className="bg-white dark:bg-[#120d21] border border-[#7e6c9e]/20 dark:border-[#c9a0dc]/15 rounded-3xl p-6 shadow-xl leading-relaxed text-left relative overflow-hidden">
//                 <span className="absolute top-0 right-0 w-28 h-28 bg-[#d4798e]/5 blur-2xl rounded-full" />
//                 <h3 className="text-md font-extrabold text-[#3d3650] dark:text-white flex items-center gap-2">
//                   <Lock className="w-4 h-4 text-emerald-500" /> Locked Private Decompress Space
//                 </h3>
//                 <p className="text-xs text-[#7e6c9e] dark:text-[#9b8ab8] mt-1 leading-relaxed">
//                   Caregivers suppress emotions constantly to appear strong on the outside. This journal box is completely secure, invisible to Sarah, with a floating voice-to-transcribe orb.
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
                  
//                   {/* LEFT - Voice Recording Panel (4-column equivalent width) */}
//                   <div className="md:col-span-5 bg-purple-50/20 dark:bg-[#07040f] rounded-2.5xl p-5 border border-purple-200/55 dark:border-[#c9a0dc]/10 flex flex-col items-center justify-center text-center relative overflow-hidden h-[240px]">
//                     <div className="absolute inset-0 bg-radial from-violet-600/10 to-transparent pointer-events-none blur-xl" />
                    
//                     {/* Active waveform simulation using custom bouncing bar CSS */}
//                     <div className={`flex items-end justify-center gap-1 my-4 h-12 ${voiceActive ? 'opacity-100' : 'opacity-30'}`}>
//                       {[1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 2, 1].map((bar, bIdx) => (
//                         <div
//                           key={bIdx}
//                           className="w-1 rounded-full bg-gradient-to-t from-[#decfe6] to-[#d4798e] transition-all"
//                           style={{
//                             height: voiceActive ? `${bar * 9 + Math.random() * 10}px` : '4px',
//                             animationName: voiceActive ? 'fade-in' : 'none',
//                             animationDuration: '0.4s',
//                             animationIterationCount: 'infinite'
//                           }}
//                         />
//                       ))}
//                     </div>

//                     <p className="text-[10px] uppercase font-bold tracking-widest text-[#ea96a6] mt-1 font-mono">
//                       {voiceActive ? `vocal stream: Active // ${waveSeconds}s` : 'Vocal stream idle'}
//                     </p>

//                     {/* Floating Microphone Orb button styling */}
//                     <button
//                       onClick={triggerVoiceNote}
//                       className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg mt-4 ring-4 ${
//                         voiceActive ? 'bg-[#d4798e] ring-pink-500/20 shadow-[#d4798e]/40 hover:scale-95 animate-pulse' : 'bg-[#1c1530] border border-[#c9a0dc]/40 ring-[#c9a0dc]/10 hover:scale-105'
//                       }`}
//                     >
//                       <Mic className={`w-5 h-5 ${voiceActive ? 'text-white' : 'text-[#decfe6]'}`} />
//                     </button>
//                     <span className="text-[9px] text-[#9b8ab8] mt-2 font-bold uppercase tracking-wider">{voiceActive ? 'Tap to stopped transcription' : 'Tap to unpack voice'}</span>
//                   </div>

//                   {/* RIGHT - Text Editor (7-column equivalent width) */}
//                   <div className="md:col-span-7 flex flex-col justify-between">
//                     <div>
//                       <span className="text-[9px] font-black uppercase tracking-widest text-[#d4798e] block">Write or transcribed entry notes:</span>
//                       <textarea
//                         className="w-full text-xs p-4 bg-slate-50 dark:bg-[#07040f] text-[#3d3650] dark:text-[#decfe6] rounded-2xl border border-[#7e6c9e]/20 dark:border-[#c9a0dc]/15 mt-2 focus:outline-none focus:border-[#d4798e] leading-relaxed"
//                         rows={6}
//                         placeholder="Pour whatever fits inside your heart tonight. Sarah cannot read this; your boundaries are locked."
//                         value={journalText}
//                         onChange={(e) => setJournalText(e.target.value)}
//                       />
//                     </div>

//                     <div className="flex justify-between items-center mt-3">
//                       <span className="text-[9px] font-mono text-[#9b8ab8] flex items-center gap-1">🔒 Locked &amp; Aligned Encryption Stable</span>
//                       <button
//                         onClick={saveJournalEntry}
//                         disabled={!journalText.trim()}
//                         className="px-5 py-2 rounded-xl bg-[#d4798e] hover:bg-[#ea96a6] text-white text-xs font-bold leading-none cursor-pointer disabled:opacity-40"
//                       >
//                         Commit to Star Constell ✦
//                       </button>
//                     </div>
//                   </div>

//                 </div>

//                 {/* Journal logs */}
//                 {journalLogs.length > 0 && (
//                   <div className="mt-8 space-y-4">
//                     <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#d4798e] block pl-1">Decompress Archives</span>
                    
//                     <div className="space-y-4">
//                       {journalLogs.map((log) => (
//                         <div
//                           key={log.id}
//                           className="p-5 rounded-2xl bg-slate-50 dark:bg-[#07040f]/60 border border-[#7e6c9e]/15 dark:border-[#c9a0dc]/10 text-left space-y-3.5 hover:border-[#c9a0dc]/20 transition"
//                         >
//                           <div className="flex justify-between items-center border-b border-[#7e6c9e]/10 pb-2">
//                             <span className="text-[9px] font-mono text-[#9b8ab8] flex items-center gap-1">🔓 DECOMPRESSED LOG</span>
//                             <span className="text-[10px] text-[#9b8ab8] font-mono font-bold">{log.date}</span>
//                           </div>
                          
//                           <p className="text-xs text-[#3d3650] dark:text-[#decfe6] leading-relaxed italic pr-2">"{log.text}"</p>
                          
//                           <div className="p-3 bg-[#decfe6]/10 rounded-xl border border-[#c9a0dc]/15 flex gap-2.5 items-start text-[11px] text-[#decfe6]">
//                             <Sparkles className="w-4.5 h-4.5 text-[#d4798e] flex-shrink-0 animate-pulse" />
//                             <div>
//                               <b className="uppercase font-bold tracking-wider text-[8px] text-[#ea96a6] block mb-0.5">Astra Compass Interpretation:</b>
//                               <p className="italic text-[#7e6c9e] dark:text-[#decfe6] leading-normal">{log.reply}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//             </div>
//           )}

//           {activeSection === 'shared' && (
//             <div className="animate-fade-in">
//               <SharedConstellation
//                 theme={theme}
//                 role="caregiver"
//                 onNavigateHome={() => setActiveSection('home')}
//               />
//             </div>
//           )}

//         </div>

//         {/* ── PERSISTENT BOTTOM RIGHT FLOATING QUICK ACTIONS MENU (AI ORB) ── */}
//         <div className="fixed bottom-6 right-6 z-50">
//           <div className="relative">
//             {quickSupportOpen && (
//               <div className="absolute bottom-16 right-0 w-52 bg-[#120d21] border border-[#c9a0dc]/30 rounded-2xl p-3 shadow-2xl backdrop-blur-md animate-fade-in flex flex-col gap-1.5 text-left text-xs text-white">
//                 <span className="text-[9px] font-black uppercase text-[#ea96a6] border-b border-[#c9a0dc]/10 pb-1.5 mb-1.5 pl-1 tracking-widest block font-mono">
//                   QUICK COMPASS
//                 </span>
                
//                 <button
//                   onClick={() => {
//                     setActiveSection('communication');
//                     setQuickSupportOpen(false);
//                     setCommQuery("How do I talk without sounding afraid?");
//                     handleSendCommQuery("How do I talk without sounding afraid?");
//                   }}
//                   className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-[11px] font-semibold text-[#decfe6] hover:bg-white/10 cursor-pointer text-left transition"
//                 >
//                   <MessageSquare className="w-3.5 h-3.5 text-[#d4798e]" />
//                   <span>Phrasing Guidance ✨</span>
//                 </button>

//                 <button
//                   onClick={() => {
//                     setActiveSection('journal');
//                     setQuickSupportOpen(false);
//                   }}
//                   className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-[11px] font-semibold text-[#decfe6] hover:bg-white/10 cursor-pointer text-left transition"
//                 >
//                   <Mic className="w-3.5 h-3.5 text-purple-400" />
//                   <span>Vocal Grounding 🎙️</span>
//                 </button>

//                 <button
//                   onClick={() => {
//                     setActiveSection('emotion');
//                     setQuickSupportOpen(false);
//                   }}
//                   className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-[11px] font-semibold text-[#decfe6] hover:bg-white/10 cursor-pointer text-left transition"
//                 >
//                   <Activity className="w-3.5 h-3.5 text-emerald-400" />
//                   <span>Quick Rest Check 🌸</span>
//                 </button>

//                 <div className="border-t border-[#c9a0dc]/15 pt-1.5 mt-1">
//                   <a
//                     href="https://www.bcf.org.sg"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-[11px] font-black text-red-400 hover:bg-red-500/10 cursor-pointer text-left transition"
//                   >
//                     <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-bounce" />
//                     <span>Emergency Lines 🚨</span>
//                   </a>
//                 </div>
//               </div>
//             )}

//             {/* Glowing Trigger Orb Button */}
//             <button
//               onClick={() => setQuickSupportOpen(!quickSupportOpen)}
//               className="px-5 py-3 rounded-full bg-gradient-to-r from-[#d4798e] via-[#9c82ba] to-[#e8b4bc] text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-2xl hover:scale-103 hover:shadow-[#d4798e]/20 transition-all ring-4 ring-[#d4798e]/20 select-none"
//             >
//               <Heart className="w-4 h-4 fill-white text-none animate-pulse" />
//               <span>Astra Care Orb</span>
//             </button>
//           </div>
//         </div>

//       </main>
//     </div>
//   );
// }



// CaregiverDashboard.tsx:
import React, { useState, useEffect, useRef } from 'react';
import SharedConstellation from './SharedConstellation';
import {
  Sun, Moon, Star, MessageSquare, Heart, Sparkles, Navigation, CheckCircle,
  ChevronRight, Compass, ShieldAlert, Award, FileText, Send, HelpCircle, X,
  Activity, Battery, Plus, Trash, Lock, Calendar, Users, Mic, Volume2, Clock,
  ArrowRight, ShieldCheck, RefreshCw, Zap
} from 'lucide-react';

interface CaregiverDashboardProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onNavigate: (path: string) => void;
  user?: { email: string; displayName: string } | null;
  onAuthTrigger?: () => void;
  onLogout?: () => void;
}

type CaregiverSection =
  | 'home'
  | 'emotion'
  | 'appointments'
  | 'communication'
  | 'burnout'
  | 'circle'
  | 'journal'
  | 'resources'
  | 'shared';

interface CareTask {
  id: string;
  label: string;
  done: boolean;
  time: string;
  category: 'meds' | 'appointment' | 'transport' | 'wellness';
}

interface BurnoutEvent {
  id: string;
  time: string;
  moodType: 'fatigue' | 'overwhelm' | 'stable' | 'gratitude';
  energy: number;
  notes: string;
}

interface AppointmentEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  transport: string;
  medsLogged: boolean;
  notesPinned: string;
}

interface SuggestionCard {
  prompt: string;
  category: string;
}

export default function CaregiverDashboard({ theme, onThemeToggle, onNavigate, user, onAuthTrigger, onLogout }: CaregiverDashboardProps) {
  const [activeSection, setActiveSection] = useState<CaregiverSection>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalStars, setTotalStars] = useState(12);
  const [quickSupportOpen, setQuickSupportOpen] = useState(false);

  // Active Care Tasks
  const [tasks, setTasks] = useState<CareTask[]>(() => {
    const cached = localStorage.getItem('caregiver-tasks');
    if (cached) return JSON.parse(cached);
    return [
      { id: '1', label: 'Give Sarah herbal tea & ginger drops', done: true, time: '8:00 AM', category: 'wellness' },
      { id: '2', label: 'Dexamethasone medication dosage pre-chemo', done: false, time: '2:00 PM', category: 'meds' },
      { id: '3', label: 'Confirm transport with Chloe for scan tomorrow', done: false, time: '5:30 PM', category: 'transport' },
      { id: '4', label: 'Meditation baseline & hydration check', done: false, time: '8:00 PM', category: 'wellness' },
    ];
  });

  // Emotional Weather Timeline logs
  const [burnoutEvents, setBurnoutEvents] = useState<BurnoutEvent[]>(() => {
    const cached = localStorage.getItem('caregiver-burnout-events');
    if (cached) return JSON.parse(cached);
    return [
      { id: '1', time: 'Monday', moodType: 'stable', energy: 75, notes: 'Felt a sense of acceptance during the joint garden walk.' },
      { id: '2', time: 'Wednesday', moodType: 'fatigue', energy: 45, notes: 'Woke up at 3 AM hearing nausea coughing. Tired but pushing through.' },
      { id: '3', time: 'Friday', moodType: 'overwhelm', energy: 30, notes: 'Oncologist report was dry and clinical. Felt scared but hid it from Sarah.' },
      { id: '4', time: 'Sunday (Today)', moodType: 'gratitude', energy: 60, notes: 'Sarah was breathing deeper. Feeling lighter after reading her comfort star logs.' },
    ];
  });

  // Shared Appointments
  const [appointments, setAppointments] = useState<AppointmentEvent[]>(() => {
    const cached = localStorage.getItem('caregiver-appointments');
    if (cached) return JSON.parse(cached);
    return [
      { id: '1', title: 'Chemotherapy Infusion Cycle 2', date: 'Tomorrow', time: '2:30 PM', transport: 'Driver: Chloe (Sister)', medsLogged: true, notesPinned: 'Focus on cold cap application protocol immediately on start.' },
      { id: '2', title: 'Post-chemo Hydration Checkup', date: 'Next Tuesday', time: '11:00 AM', transport: 'Driver: Sarah (Self)', medsLogged: false, notesPinned: 'Bring nausea diary to review blood pressure indicators.' },
      { id: '3', title: 'MRI Neuropathy Clearance Study', date: 'June 12, 2026', time: '9:00 AM', transport: 'Transport unarranged', medsLogged: false, notesPinned: 'Prepare sensory calming music before scan begins.' },
    ];
  });

  // Communication AI helper states
  const [commQuery, setCommQuery] = useState('');
  const [commChat, setCommChat] = useState<Array<{ sender: 'user' | 'ai'; text: string; solutions?: string[] }>>([
    {
      sender: 'ai',
      text: "Hello, Caregiver. I am Astra, your empathetic conversational companion. Wordings and phrasing can carry heavy burdens right now. Ask me anything, or select a conversational cue below:",
      solutions: [
        "How do I support Sarah before chemotherapy without sounding overly anxious?",
        "What is a gentle way to ask friends for cooking support?",
        "What can I write when doctors don't seem to notice pain logs?"
      ]
    }
  ]);
  const [typing, setTyping] = useState(false);

  // Private journal logs
  const [journalText, setJournalText] = useState('');
  const [journalLogs, setJournalLogs] = useState<Array<{ id: string; text: string; date: string; reply: string }>>(() => {
    const cached = localStorage.getItem('caregiver-journal-logs');
    if (cached) return JSON.parse(cached);
    return [];
  });
  const [voiceActive, setVoiceActive] = useState(false);
  const [waveSeconds, setWaveSeconds] = useState(0);

  // Recovery Alert States
  const [currentRecoveryRem, setCurrentRecoveryRem] = useState('🍵 Cozy Lavender Alert: Take 2 minutes to stretch your arms and have three long deep sips of warm water.');

  // Constellation logs - Caregiver check-in reactions
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionFeedback, setEmotionFeedback] = useState<string>('');

  // Energy levels
  const [energyLevel, setEnergyLevel] = useState(55);
  const [recoveryScore, setRecoveryScore] = useState(65);
  const [emotionalLoad, setEmotionalLoad] = useState('Elevated');

  // Sync caches
  useEffect(() => {
    localStorage.setItem('caregiver-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('caregiver-burnout-events', JSON.stringify(burnoutEvents));
  }, [burnoutEvents]);

  useEffect(() => {
    localStorage.setItem('caregiver-appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('caregiver-journal-logs', JSON.stringify(journalLogs));
  }, [journalLogs]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (voiceActive) {
      interval = setInterval(() => {
        setWaveSeconds((s) => s + 1);
      }, 1000);
    } else {
      setWaveSeconds(0);
    }
    return () => clearInterval(interval);
  }, [voiceActive]);

  useEffect(() => {
    const reminders = [
      '🍵 Cozy Lavender Alert: Take 2 minutes to stretch your arms and have three long deep sips of warm water.',
      '✨ Grounding Note: Look out of the window and spot two tiny specs of light. Realize you do not carry this sky alone.',
      '🧬 Micro Breathing Reset: Inhale cool air through your nose for 4 seconds, expand your abdomen, hold for 2, release slowly.',
      '🕊️ Soft Boundary Card: You are allowed to say \"I need a 10-minute break in the other room to breathe.\"'
    ];
    const timer = setInterval(() => {
      const randomRem = reminders[Math.floor(Math.random() * reminders.length)];
      setCurrentRecoveryRem(randomRem);
    }, 28000);
    return () => clearInterval(timer);
  }, []);

  const triggerEmotionCheckIn = (id: string, label: string) => {
    setSelectedEmotion(id);
    let feedbackSrc = '';
    let batteryChange = 0;
    
    switch (id) {
      case 'exhausted':
        feedbackSrc = "Exhaustion is a natural physical reality, not a failing of love. We have illuminated the Star of Quiet Restoration. Your target is complete rest for 2 hours.";
        batteryChange = -15;
        break;
      case 'worried':
        feedbackSrc = "Holding worry is holding care. But remember: Sarah is in professional hands, and you are here holding her hand. Let us focus only on today's small orbit.";
        batteryChange = -5;
        break;
      case 'peaceful':
        feedbackSrc = "Grounded moments are refreshing wells in a long trail. Let this feeling settle inside your chest, refueling your deep reservoirs.";
        batteryChange = 15;
        break;
      case 'overwhelmed':
        feedbackSrc = "When waves crash over, you do not need to fight. Just float. Stop planning next month, just choose what to eat next. I have lit the Star of Soft Boundaries.";
        batteryChange = -20;
        break;
    }

    setEmotionFeedback(feedbackSrc);
    setEnergyLevel(prev => Math.max(15, Math.min(100, prev + batteryChange)));
    setTotalStars(prev => prev + 1);
  };

  const addTask = (label: string, category: 'meds' | 'appointment' | 'transport' | 'wellness', time: string) => {
    const newTask: CareTask = { id: Math.random().toString(), label, done: false, time, category };
    setTasks(prev => [...prev, newTask]);
    setTotalStars(prev => prev + 1);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const task = tasks.find(t => t.id === id);
    if (task && !task.done) {
      setTotalStars(prev => prev + 1);
    }
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleSendCommQuery = (custom?: string) => {
    const textToSend = custom || commQuery;
    if (!textToSend.trim()) return;

    setCommChat(prev => [...prev, { sender: 'user', text: textToSend }]);
    setCommQuery('');
    setTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      if (textToSend.toLowerCase().includes('chemotherapy') || textToSend.toLowerCase().includes('nervous') || textToSend.toLowerCase().includes('anxious')) {
        aiResponseText = "✨ Pre-treatment Reassurance Option:\n\"We are going to take this step-by-step today. I have already packed your soft fuzzy socks, your cherry flavored ginger drops, and your favourite podcast playlists. My only job today is to hold your hand and ensure you feel safe.\"";
      } else if (textToSend.toLowerCase().includes('cooking') || textToSend.toLowerCase().includes('friends') || textToSend.toLowerCase().includes('help')) {
        aiResponseText = "📋 Gentle Support Coordination Ask:\n\"Hey friends, many of you asked how you can sit beside us during this Chemo round. We set up an online cooking rotation. If anyone has time to drop off lightweight veggie broth or non-spicy meals on Tuesdays, it would let us spend evenings completely resting. Thank you so much for traveling under our star sky.\"";
      } else {
        aiResponseText = "🌱 Supportive Translation Option:\n\"I love you, and it's okay to feel completely tired and raw today. We don't have to put on a brave face. I am cozy sitting right here next to you in silence. We are doing enough by simply being.\"";
      }
      setCommChat(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
      setTyping(false);
      setTotalStars(prev => prev + 1);
    }, 1500);
  };

  const saveJournalEntry = () => {
    if (!journalText.trim()) return;

    const reflectionResponses = [
      "Astra sat quietly alongside your unloading. You noted high worry for Sarah's upcoming blood counts. It is okay to be frightened; your empathy is a quiet guide. I have added this to your locked private reflection constell.",
      "Astra felt the deep pressure of fatigue in your words. Preparing the meals, managing the dosage sheets — it is heavy. I remind you that your support capacity is high, but not limitless. Rest tonight.",
      "Astra observed a gentle glimmer of light in today's entry. Your acceptance is a stabilizing orbit for Sarah. The night is quiet, and so is your breathing."
    ];

    const randomRep = reflectionResponses[Math.floor(Math.random() * reflectionResponses.length)];
    const entry = {
      id: Math.random().toString(),
      text: journalText,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      reply: randomRep
    };

    setJournalLogs(prev => [entry, ...prev]);
    setJournalText('');
    setTotalStars(prev => prev + 1);
  };

  const addBurnoutEvent = (moodType: 'fatigue' | 'overwhelm' | 'stable' | 'gratitude', notes: string, energy: number) => {
    const newEvent: BurnoutEvent = {
      id: Math.random().toString(),
      time: 'Just Now',
      moodType,
      energy,
      notes
    };
    setBurnoutEvents(prev => [newEvent, ...prev]);
    setEnergyLevel(energy);
    setTotalStars(prev => prev + 1);
  };

  const triggerVoiceNote = () => {
    if (voiceActive) {
      setVoiceActive(false);
      setJournalText("Sarah rested for 3 hours after chemo #2. Feeling a slight knot in my stomach because her skin looks pale. However, her temperature is stable at 36.8°C. I offered some light ginger broth and we spoke about her nursery orchids. Feeling tired but incredibly glad her fever cleared up.");
    } else {
      setVoiceActive(true);
    }
  };

  // Light mode text helpers — matches patient dashboard dark-text-on-light style
  const txt = theme === 'dark' ? 'text-[#f5f0eb]' : 'text-[#1e133a]';
  const txtMuted = theme === 'dark' ? 'text-[#9b8ab8]' : 'text-[#4d3c69]';
  const txtSubtle = theme === 'dark' ? 'text-[#decfe6]' : 'text-[#3d3650]';
  const cardBg = theme === 'dark' ? 'bg-[#120d21]' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-[#c9a0dc]/15' : 'border-purple-200';
  const inputBorder = theme === 'dark' ? 'border-purple-500/30' : 'border-purple-300';
  const surfaceBg = theme === 'dark' ? 'bg-[#07040f]/60' : 'bg-slate-50';
  const surfaceBorder = theme === 'dark' ? 'border-[#c9a0dc]/10' : 'border-purple-100';

  return (
    <div className={`flex min-h-screen transition-all duration-500 font-sans ${theme === 'dark' ? 'dark bg-[#07040f] text-[#f5f0eb]' : 'bg-[#FAF8FD] text-[#1e133a]'}`}>
      
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#9b8ab8]/15 via-[#ea96a6]/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-10 left-5 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-[#9c82ba]/10 via-[#d4798e]/5 to-transparent blur-3xl" />
      </div>

      {/* ── Sidebar Navigation ── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 border-r backdrop-blur-md w-64 z-40 flex flex-col justify-between transition-all duration-300 transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } ${theme === 'dark' ? 'bg-[#0f0a21]/90 border-[#c9a0dc]/15' : 'bg-[#FAF8FD]/95 border-[#7e6c9e]/20'}`}
      >
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand header */}
          <div className={`flex items-center justify-between px-6 py-5 border-b flex-shrink-0 ${theme === 'dark' ? 'border-[#c9a0dc]/15' : 'border-[#7e6c9e]/20'}`}>
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Return to Landing Page"
            >
              <span className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#d4798e] to-[#9c82ba] flex items-center justify-center text-white text-lg font-black shadow-md animate-pulse">C</span>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-[#d4798e] to-[#c9a0dc] bg-clip-text text-transparent italic tracking-tight">
                  ConstellaCare
                </span>
                <span className={`block text-[8px] tracking-widest font-bold uppercase mt-0.5 ${theme === 'dark' ? 'text-[#9b8ab8]' : 'text-[#7e6c9e]'}`}>Caregiver Command</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-full hover:bg-purple-100/10 text-[#9b8ab8]"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Navigation Items — scrollable */}
          <nav className="p-4 space-y-5 overflow-y-auto flex-1">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#d4798e] block pl-2.5 mb-2.5">
                Support Center
              </span>
              {[
                { id: 'home', label: 'Dashboard Home 🪐', icon: <Compass className="w-3.5 h-3.5" /> },
                { id: 'shared', label: '✨ Shared Constellation', icon: <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> },
                { id: 'emotion', label: 'Astra Check-In', icon: <Activity className="w-3.5 h-3.5" /> },
                { id: 'appointments', label: 'Treatment Timeline', icon: <Calendar className="w-3.5 h-3.5" /> },
                { id: 'communication', label: 'Comm. Assistant', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                { id: 'burnout', label: 'Emotional Weather', icon: <Zap className="w-3.5 h-3.5" /> },
                { id: 'circle', label: 'Care Orbit Circle', icon: <Users className="w-3.5 h-3.5" /> },
                { id: 'journal', label: 'Private Journal', icon: <Mic className="w-3.5 h-3.5" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as CaregiverSection);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold leading-none capitalize transition-all duration-200 cursor-pointer ${
                    activeSection === item.id
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-[#211738] to-[#120d21] text-[#f4d4a8] border border-[#c9a0dc]/20'
                        : 'bg-gradient-to-r from-[#decfe6] to-[#e8e2f4] text-[#1a1530] border border-[#c9a0dc]/20'
                      : theme === 'dark'
                        ? 'bg-transparent text-[#9b8ab8] hover:bg-[#1c1530]/50 font-semibold'
                        : 'bg-transparent text-[#4d3c69] hover:bg-purple-100/60 font-semibold'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Global Stars Counter at bottom */}
        <div className={`p-5 border-t flex-shrink-0 ${theme === 'dark' ? 'border-[#c9a0dc]/15' : 'border-[#7e6c9e]/20'}`}>
          <div className="bg-gradient-to-tr from-[#120d21] to-[#251a3d] text-[#f4d4a8] rounded-2xl p-4 border border-[#c9a0dc]/25 text-center relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4798e]/10 blur-xl rounded-full" />
            <Award className="w-6.5 h-6.5 text-[#f4d4a8] mx-auto animate-pulse" />
            <span className="text-[9px] text-[#c9a0dc]/80 block font-mono font-bold tracking-widest mt-1">CAREGIVER CARESCORE</span>
            <span className="text-xl font-black mt-1 block">{totalStars} ✨</span>
            <p className="text-[10px] text-[#FAF8FD]/70 mt-1 lines-2 leading-relaxed">
              Every coordination aid lights a star under the same night sky.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[#07040f]/50 backdrop-blur-xs z-30 md:hidden transition-all"
        />
      )}

      {/* Main Panel Area */}
      <main className="flex-1 md:pl-64 min-h-screen flex flex-col z-10 relative">
        
        {/* Interactive Header */}
        <header className={`sticky top-0 backdrop-blur-md py-4 px-6 md:px-10 flex items-center justify-between border-b z-20 ${theme === 'dark' ? 'bg-[#07040f]/80 border-[#c9a0dc]/15' : 'bg-[#FAF8FD]/80 border-[#7e6c9e]/20'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 bg-purple-100/10 hover:bg-purple-100/20 rounded-xl cursor-pointer"
            >
              <Compass className="w-5 h-5 text-[#d4798e]" />
            </button>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#d4798e] block">COMMAND OVERVIEW</span>
              <h1 className={`text-base font-extrabold flex items-center gap-1.5 capitalize ${theme === 'dark' ? 'text-[#FAF8FD]' : 'text-[#2e214c]'}`}>
                {activeSection === 'home' ? 'Operations Dashboard' : `${activeSection} Interface`}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Backup Recovery Button — matches patient dashboard */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sync Active
                </span>
                <div className="relative group">
                  <button
                    onClick={onLogout}
                    title="Click to sign out"
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-500 text-white text-xs font-black flex items-center justify-center cursor-pointer shadow ring-2 ring-purple-300 dark:ring-purple-900 transition-transform active:scale-90"
                  >
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </button>
                  <div className="absolute top-10 right-0 scale-0 group-hover:scale-100 bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-purple-500/20 text-[9px] font-bold p-1 px-2 rounded-lg pointer-events-none duration-150 min-w-[110px] text-center shadow-lg uppercase tracking-wide">
                    Click to sign out
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onAuthTrigger}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#d4798e] via-[#9c82ba] to-[#decfe6] text-white hover:scale-101 active:scale-99 transition-all shadow-md cursor-pointer border border-[#c9a0dc]/20"
              >
                <span>Backup Progress ☁️</span>
              </button>
            )}

            <div className={`flex items-center gap-1.5 bg-gradient-to-r from-[#d4798e]/10 to-[#9c82ba]/10 border border-[#d4798e]/35 px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'text-[#f4d4a8]' : 'text-[#d4798e]'}`}>
              <Star className="w-3.5 h-3.5 fill-[#d4798e] text-[#d4798e] animate-pulse" />
              <span>{totalStars} stars aligned</span>
            </div>

            <button
              onClick={onThemeToggle}
              className="p-2 rounded-xl border border-transparent hover:border-[#c9a0dc]/20 hover:bg-purple-100/10 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#decfe6]" /> : <Moon className="w-4 h-4 text-[#3d3650]" />}
            </button>
          </div>
        </header>

        {/* Recovery Reminder Banner */}
        <div className="px-6 md:px-10 pt-4">
          <div className={`bg-gradient-to-r from-[#decfe6]/20 via-[#e8e2f4]/15 to-[#ea96a6]/5 border border-[#c9a0dc]/30 rounded-2xl p-3.5 flex items-start gap-3 shadow-sm relative overflow-hidden`}>
            <span className="absolute top-0 right-0 w-8 h-8 bg-[#c9a0dc]/5 rounded-full blur-sm" />
            <Sparkles className="w-4 h-4 text-[#d4798e] flex-shrink-0 mt-0.5 animate-bounce" />
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#d4798e] block">RECOVERY COMPASS</span>
              <p className={`text-xs italic mt-0.5 leading-relaxed font-semibold ${theme === 'dark' ? 'text-[#FAF8FD]/90' : 'text-[#3d3650]'}`}>{currentRecoveryRem}</p>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="flex-1 p-6 md:p-10 max-w-5xl w-full mx-auto space-y-8 pb-32">
          
          {/* SECTION 1: HOME DASHBOARD */}
          {activeSection === 'home' && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* HERO HEADER */}
              <div className={`relative overflow-hidden rounded-3xl p-7 md:p-9 border shadow-xl ${cardBg} ${cardBorder}`}>
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-45">
                  <div className="absolute top-minus-10 right-minus-10 w-[200px] h-[200px] rounded-full bg-[#d4798e]/20 blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#d4798e]/10 border border-[#d4798e]/20 text-[#ea96a6] mb-3`}>
                      <ShieldCheck className="w-2.5 h-2.5" /> Care coordination stable
                    </span>
                    <h2 className={`text-xl md:text-2xl font-black tracking-tight ${txt}`}>Sarah's support is part of her healing journey.</h2>
                    <p className={`text-xs mt-1 max-w-lg leading-relaxed ${txtMuted}`}>
                      Two stars orbiting the same night sky, closer together. You have saved <b className={theme === 'dark' ? 'text-[#f4d4a8]' : 'text-purple-700'}>4 treatment parameters</b> this week. Sarah's current fatigue index is moderate.
                    </p>
                  </div>
                  <div className="hidden md:block flex-shrink-0 bg-[#07040f]/50 p-4 rounded-full border border-[#c9a0dc]/10 animate-bounce cursor-pointer" style={{ animationDuration: '3s' }}>
                    <Heart className="w-10 h-10 fill-[#d4798e] text-[#d4798e] opacity-80" />
                  </div>
                </div>
              </div>

              {/* THREE COLUMN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Emotional Orbit Card */}
                <div className={`border rounded-3xl p-6 shadow-md text-left flex flex-col justify-between ${cardBg} ${cardBorder}`}>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5">
                      <Activity className="w-4 h-4" /> Emotional Orbit
                    </h4>
                    <span className={`text-[10px] mt-0.5 block ${txtMuted}`}>Visualizing collective caregiver burden</span>

                    <div className="relative w-44 h-44 mx-auto my-6 flex items-center justify-center border border-[#9b8ab8]/10 rounded-full">
                      <div className="absolute inset-2 border border-dashed border-[#9b8ab8]/20 rounded-full animate-spin duration-[24s]" />
                      <div className="absolute inset-8 border border-dashed border-[#d4798e]/15 rounded-full animate-spin duration-[15s]" />
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d4798e] to-[#ea96a6] flex items-center justify-center text-[10px] text-white font-black shadow-lg ring-4 ring-[#d4798e]/20 z-10 animate-pulse">
                        Sarah
                      </div>
                      <div className={`absolute top-1 left-8 w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shadow animate-bounce ${theme === 'dark' ? 'bg-[#1c1530] border-[#f4d4a8] text-[#f4d4a8]' : 'bg-purple-100 border border-purple-400 text-purple-700'}`}>
                        You
                      </div>
                    </div>

                    <div className={`space-y-2.5 mt-2 p-3.5 rounded-2xl border font-mono text-[10px] ${theme === 'dark' ? 'bg-[#07040f]/60 border-[#c9a0dc]/5 text-[#decfe6]' : 'bg-purple-50/80 border-purple-200 text-[#2e214c]'}`}>
                      <div className="flex justify-between items-center">
                        <span className={`flex items-center gap-1 ${txtMuted}`}>✨ Patient Stability:</span>
                        <span className="text-yellow-600 dark:text-yellow-400 font-extrabold">Moderate</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`flex items-center gap-1 ${txtMuted}`}>⛈️ Burnout Risk:</span>
                        <span className="text-red-600 dark:text-red-400 font-extrabold">Elevated</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`flex items-center gap-1 ${txtMuted}`}>📅 Stress Window:</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">Next chemo cycle</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Astra Care Insights */}
                <div className={`border rounded-3xl p-6 shadow-md flex flex-col justify-between ${cardBg} ${cardBorder}`}>
                  <div>
                    <div className="flex items-center justify-between border-b pb-2.5 mb-3.5 border-purple-100/10">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5 leading-none">
                        <Sparkles className="w-4 h-4 fill-[#d4798e]" /> Astra Care Insights
                      </h4>
                      <span className="text-[8px] font-mono border border-[#d4798e]/30 px-1.5 py-0.5 rounded text-[#d4798e]">AI DETECTED</span>
                    </div>

                    <div className={`space-y-4 text-xs leading-relaxed ${txtSubtle}`}>
                      <div className="bg-gradient-to-r from-[#d4798e]/10 to-[#9c82ba]/5 p-3 rounded-xl border-l-2 border-[#d4798e]">
                        <p className="font-bold text-[#ea96a6]">⚖️ Stress Load Leveling</p>
                        <p className={`mt-1 text-[11px] leading-relaxed ${txtMuted}`}>
                          "You've carried high emotional load for 5 days. Consider planning a recovery evening or allowing Chloe to handle meal logistics this Friday."
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-[#9c82ba]/10 to-[#decfe6]/5 p-3 rounded-xl border-l-2 border-[#9c82ba]">
                        <p className="font-bold text-[#c9a0dc]">🩺 Anxiety Triggers noticed</p>
                        <p className={`mt-1 text-[11px] leading-relaxed ${txtMuted}`}>
                          "Sarah's anxiety appears highest before oncology scans. Tap the 'What should I say?' panel to customize reassurance text sheets."
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveSection('communication')}
                    className="w-full mt-4 bg-gradient-to-r from-[#d4798e] to-[#9c82ba] text-white font-sans text-xs font-bold py-2.5 rounded-xl shadow-md cursor-pointer hover:scale-[1.01] transition"
                  >
                    Load reassurance builders →
                  </button>
                </div>

                {/* Shared Care Tasks */}
                <div className={`border rounded-3xl p-6 shadow-md flex flex-col justify-between ${cardBg} ${cardBorder}`}>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#d4798e]" /> Shared Care Tasks
                    </h4>
                    <span className={`text-[10px] mt-0.5 block font-semibold ${txtMuted}`}>Daily operational checklist</span>

                    <div className="space-y-2 mt-4 max-h-56 overflow-y-auto pr-1">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                            task.done
                              ? 'bg-[#decfe6]/10 border-transparent opacity-60 line-through'
                              : `${surfaceBg} ${surfaceBorder} hover:border-[#d4798e]/30`
                          }`}
                        >
                          <div className="flex items-start gap-2.5 flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                            <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center flex-shrink-0 ${
                              task.done ? 'bg-[#d4798e] border-[#d4798e] text-white' : 'border-[#9b8ab8]'
                            }`}>
                              {task.done && <CheckCircle className="w-3 h-3 text-[#120d21] fill-white" />}
                            </div>
                            <div>
                              <p className={`text-xs font-semibold leading-tight ${theme === 'dark' ? 'text-[#FAF8FD]' : 'text-[#2e214c]'}`}>{task.label}</p>
                              <span className={`text-[8px] uppercase font-bold tracking-wider mt-0.5 block ${txtMuted}`}>{task.time} // {task.category}</span>
                            </div>
                          </div>
                          <button onClick={() => removeTask(task.id)} className={`hover:text-[#d4798e] p-1 rounded-lg ${txtMuted}`}>
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const text = new FormData(form).get('taskText') as string;
                      if (!text.trim()) return;
                      addTask(text, 'wellness', 'Morning');
                      form.reset();
                    }}
                    className="mt-4 flex gap-1.5"
                  >
                    <input
                      name="taskText"
                      type="text"
                      placeholder="Add coordination task..."
                      className={`flex-1 text-[11px] px-3 py-2 border rounded-xl bg-transparent focus:outline-none focus:border-[#d4798e] ${theme === 'dark' ? 'text-white border-[#c9a0dc]/15' : 'text-[#2e214c] border-purple-300'}`}
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-[#d4798e]/10 text-[#d4798e] border border-[#d4798e]/20 cursor-pointer hover:bg-[#d4798e]/25"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* ENERGY BATTERY + PATTERN RECOGNITION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                
                {/* Energy Battery */}
                <div className={`border rounded-3xl p-6 shadow-md text-left ${cardBg} ${cardBorder}`}>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5">
                    <Battery className="w-4 h-4 text-emerald-500" /> Support Battery Cell
                  </h4>
                  <p className={`text-[10px] mt-0.5 font-semibold ${txtMuted}`}>Caregivers need fuel to light paths</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5 items-center">
                    <div className="relative w-28 h-28 mx-auto flex flex-col items-center justify-center rounded-full bg-gradient-to-tr from-[#9c82ba]/10 to-transparent border border-[#d4798e]/15 shadow-inner">
                      <div className="absolute inset-2 rounded-full border border-dashed border-[#d4798e]/30 scale-95 animate-spin duration-[15s]" />
                      <Battery className="w-7 h-7 text-[#ea96a6] animate-pulse" />
                      <span className={`text-lg font-black mt-1 leading-none ${txt}`}>{energyLevel}%</span>
                      <span className={`text-[8px] font-mono uppercase mt-0.5 ${txtMuted}`}>Capacitor</span>
                    </div>

                    <div className="sm:col-span-2 space-y-3 font-sans text-xs">
                      <div>
                        <div className={`flex justify-between items-center font-semibold ${txt}`}>
                          <span>🔋 Emotional Energy</span>
                          <span>{energyLevel}%</span>
                        </div>
                        <div className={`w-full h-2 rounded-full mt-1 overflow-hidden ${theme === 'dark' ? 'bg-[#07040f]' : 'bg-purple-100'}`}>
                          <div className="bg-gradient-to-r from-[#d4798e] to-[#ea96a6] h-full rounded-full transition-all duration-500" style={{ width: `${energyLevel}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className={`flex justify-between items-center font-semibold ${txt}`}>
                          <span>🔄 Recovery Speed</span>
                          <span>{recoveryScore}%</span>
                        </div>
                        <div className={`w-full h-2 rounded-full mt-1 overflow-hidden ${theme === 'dark' ? 'bg-[#07040f]' : 'bg-purple-100'}`}>
                          <div className="bg-gradient-to-r from-blue-300 to-[#9c82ba] h-full rounded-full transition-all duration-500" style={{ width: `${recoveryScore}%` }} />
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-2 rounded-xl border font-mono text-[9px] ${theme === 'dark' ? 'bg-[#decfe6]/10 border-[#c9a0dc]/10' : 'bg-purple-50 border-purple-200'}`}>
                        <span className={txtMuted}>EMOTIONAL LOAD STATUS:</span>
                        <span className="font-extrabold text-[#ea96a6]">{emotionalLoad}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pattern Recognition */}
                <div className={`border rounded-3xl p-6 shadow-md text-left flex flex-col justify-between ${cardBg} ${cardBorder}`}>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Astra Pattern Recognition
                    </h4>
                    <span className={`text-[10px] mt-0.5 block font-semibold ${txtMuted}`}>Advanced correlation logs</span>

                    <div className="space-y-3 mt-4">
                      <div className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${surfaceBg} ${surfaceBorder}`}>
                        <Activity className="w-4 h-4 text-[#d4798e] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#ea96a6]">Exhaustion Patterns Detected</p>
                          <p className={`text-[11px] mt-0.5 leading-relaxed ${txtMuted}`}>
                            Astra has identified higher stress levels logged around late evenings. We recommend complete mental off-grid times after 9:30 PM.
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${surfaceBg} ${surfaceBorder}`}>
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-emerald-600 dark:text-emerald-500">Co-Regulation Alignment positive</p>
                          <p className={`text-[11px] mt-0.5 leading-relaxed ${txtMuted}`}>
                            Sarah logged calmer anxiety levels (+25% relief) on mornings immediately following pre-appointment question prep sessions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ASTRA CHECK-IN */}
          {activeSection === 'emotion' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className={`border rounded-3xl p-6 shadow-xl relative overflow-hidden ${cardBg} ${cardBorder}`}>
                <span className="absolute inset-0 bg-radial from-purple-500/5 to-transparent blur-2xl" />
                <h3 className={`text-md font-extrabold flex items-center gap-2 ${txt}`}>
                  <Activity className="w-5 h-5 text-[#d4798e]" /> Decompress Check-In
                </h3>
                <p className={`text-xs mt-1.5 leading-relaxed ${txtMuted}`}>
                  Your emotional storage capacity is not infinite. Select exactly how you feel with absolute permission to carry frustration, quiet tiredness, or peace.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {[
                    { id: 'exhausted', emoji: '🌙', title: 'Physically Exhausted', color: 'from-[#e1dbec] to-[#decfe6] dark:to-[#2c1a4d] border-[#c9a0dc]' },
                    { id: 'worried', emoji: '🌪️', title: 'Anxious & Worried', color: 'from-[#faecee] to-[#ea96a6] dark:to-pink-900 border-[#ea96a6]' },
                    { id: 'peaceful', emoji: '🌱', title: 'Calm & Grounded', color: 'from-emerald-100 to-emerald-200 dark:to-emerald-950 border-emerald-500' },
                    { id: 'overwhelmed', emoji: '🌫️', title: 'Numb / Overwhelmed', color: 'from-slate-100 to-[#decfe6] dark:to-slate-800 border-slate-500' },
                  ].map((card) => (
                    <button
                      key={card.id}
                      onClick={() => triggerEmotionCheckIn(card.id, card.title)}
                      className={`p-4 border rounded-2xl bg-gradient-to-b flex flex-col items-center text-center gap-2 cursor-pointer hover:scale-[1.03] hover:border-[#d4798e] transition ${card.color} ${
                        selectedEmotion === card.id ? 'ring-4 ring-[#d4798e]/40 shadow-lg' : 'shadow-sm border-[#7e6c9e]/15'
                      }`}
                    >
                      <span className="text-3xl animate-pulse">{card.emoji}</span>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">{card.title}</span>
                    </button>
                  ))}
                </div>

                {selectedEmotion && (
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#d4798e]/10 to-[#9c82ba]/5 border border-[#d4798e]/30 flex gap-3 text-xs leading-relaxed">
                    <Sparkles className="w-5 h-5 text-[#d4798e] flex-shrink-0 animate-pulse mt-0.5" />
                    <div>
                      <b className="uppercase text-[9px] text-[#ea96a6] tracking-widest block font-bold">Astra Companionship Response</b>
                      <p className={`mt-1 leading-relaxed ${txtMuted}`}>{emotionFeedback}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: TREATMENT TIMELINE */}
          {activeSection === 'appointments' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className={`border rounded-3xl p-6 shadow-xl text-left ${cardBg} ${cardBorder}`}>
                <div className="flex items-center justify-between border-b border-purple-100/10 pb-4 mb-6">
                  <div>
                    <h3 className={`text-md font-extrabold flex items-center gap-1.5 ${txt}`}>
                      <Calendar className="w-5 h-5 text-[#d4798e]" /> Shared Appointment &amp; Treatment Pipeline
                    </h3>
                    <p className={`text-xs mt-1 ${txtMuted}`}>Light alignment pathways for oncology visits</p>
                  </div>
                  <button
                    onClick={() => {
                      const title = prompt("Enter treatment milestone title:");
                      if (!title) return;
                      const date = prompt("Enter scheduled date:", "Tomorrow");
                      const transport = prompt("Enter transport details:", "Transport unarranged");
                      const notes = prompt("Pin initial care notes:");
                      const newEvent = {
                        id: Math.random().toString(),
                        title,
                        date: date || 'Upcoming',
                        time: '12:05 PM',
                        transport: transport || 'Unarranged',
                        medsLogged: false,
                        notesPinned: notes || 'No notes'
                      };
                      setAppointments(prev => [newEvent, ...prev]);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#d4798e]/10 border border-[#d4798e]/25 text-[#d4798e] text-xs font-bold hover:bg-[#d4798e]/20 cursor-pointer"
                  >
                    + Add Milestone
                  </button>
                </div>

                <div className="relative pl-7 border-l border-dashed border-[#c9a0dc]/30 space-y-8 text-xs">
                  {appointments.map((app, idx) => (
                    <div key={app.id} className="relative">
                      <span className="absolute -left-[35px] top-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#120d21] bg-gradient-to-r from-[#d4798e] to-[#9c82ba] ring-4 ring-[#d4798e]/20 shadow animate-pulse" />
                      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl border transition-all ${surfaceBg} ${surfaceBorder} hover:border-[#d4798e]/25`}>
                        <div className="md:col-span-3 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-[#d4798e]/10 text-[#d4798e] font-extrabold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{app.date} // {app.time}</span>
                            <span className={`text-[10px] font-mono ${txtMuted}`}>🚙 {app.transport}</span>
                          </div>
                          <h4 className={`text-sm font-extrabold leading-snug ${theme === 'dark' ? 'text-[#f4d4a8]' : 'text-[#2e214c]'}`}>{app.title}</h4>
                          <p className={`text-[11px] leading-relaxed italic pr-2 ${txtMuted}`}>📝 Pinned guidelines: "{app.notesPinned}"</p>
                        </div>
                        <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 border-[#7e6c9e]/10 pt-3 md:pt-0 pl-0 md:pl-4 md:border-l border-dashed border-purple-100/10">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={app.medsLogged} onChange={() => {
                              setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, medsLogged: !a.medsLogged } : a));
                            }} className="accent-[#d4798e] rounded" />
                            <span className={`text-[10px] font-bold ${txtMuted}`}>Meds arranged</span>
                          </label>
                          <button
                            onClick={() => {
                              const note = prompt("Edit pinned oncologist notes:", app.notesPinned);
                              if (note !== null) {
                                setAppointments(prev => prev.map(a => a.id === app.id ? { ...a, notesPinned: note } : a));
                              }
                            }}
                            className={`w-full text-center py-1 rounded border text-xs hover:text-[#d4798e] ${theme === 'dark' ? 'bg-[#decfe6]/20 border-[#c9a0dc]/10 text-[#9b8ab8]' : 'bg-purple-50 border-purple-200 text-[#7e6c9e]'}`}
                          >
                            Edit notes
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: COMMUNICATION ASSISTANT */}
          {activeSection === 'communication' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className={`border rounded-3xl overflow-hidden shadow-xl flex flex-col h-[520px] relative ${cardBg} ${cardBorder}`}>
                <div className="bg-[#120d21] p-4 border-b border-[#c9a0dc]/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d4798e] via-[#9c82ba] to-[#decfe6] flex items-center justify-center text-white ring-2 ring-[#d4798e]">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black tracking-widest text-[#d4798e] uppercase">WHAT SHOULD I SAY?</h3>
                      <p className="text-[9px] text-[#9b8ab8] font-mono">EMPATHETIC PHRASING SYNTHESISE // ACTIVE</p>
                    </div>
                  </div>
                  <span className="text-[9px] border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded font-mono animate-pulse">● ASTRA SECURE FEED</span>
                </div>

                <div className={`flex-1 overflow-y-auto p-5 space-y-4 ${theme === 'dark' ? 'bg-[#07040f]/40' : 'bg-slate-50/60'}`}>
                  {commChat.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#120d21] text-white rounded-tr-none'
                          : `${cardBg} rounded-tl-none border ${cardBorder} ${txtSubtle}`
                      }`}>
                        <p className="whitespace-pre-line leading-relaxed font-semibold">{msg.text}</p>
                        {msg.solutions && (
                          <div className="mt-3 flex flex-col gap-2 border-t border-[#7e6c9e]/10 pt-2 text-left">
                            <span className={`text-[8px] font-mono uppercase font-bold tracking-wider ${txtMuted}`}>Tap a quick query prompt:</span>
                            {msg.solutions.map((sol, sIdx) => (
                              <button key={sIdx} onClick={() => handleSendCommQuery(sol)} className="w-full text-left p-2.5 rounded-xl border border-[#c9a0dc]/20 bg-[#decfe6]/10 text-xs text-[#d4798e] hover:bg-[#d4798e]/10 cursor-pointer font-bold leading-normal transition">
                                {sol}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {typing && (
                    <div className="flex justify-start">
                      <div className={`border rounded-2xl rounded-tl-none p-4 flex items-center gap-1 text-xs font-bold shadow-inner ${cardBg} ${cardBorder} ${txtMuted}`}>
                        <span className="w-1.5 h-1.5 bg-[#d4798e] rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-[#d4798e] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 bg-[#d4798e] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        <span className="ml-1">Formulating reassurance guidelines...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`p-4 border-t flex gap-2 ${cardBg} ${cardBorder}`}>
                  <input
                    type="text"
                    placeholder="Ask how to frame difficult discussions..."
                    value={commQuery}
                    onChange={(e) => setCommQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCommQuery()}
                    className={`flex-1 text-xs px-4 py-3 border rounded-xl bg-transparent focus:outline-none focus:border-[#d4798e] ${theme === 'dark' ? 'text-[#decfe6] border-[#c9a0dc]/15' : 'text-[#2e214c] border-purple-300'}`}
                  />
                  <button onClick={() => handleSendCommQuery()} className="w-11 h-11 rounded-xl bg-[#d4798e] hover:bg-[#ea96a6] text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-103 transition">
                    <Send className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: BURNOUT WEATHER */}
          {activeSection === 'burnout' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className={`border rounded-3xl p-6 shadow-xl leading-relaxed text-left ${cardBg} ${cardBorder}`}>
                <h3 className={`text-md font-extrabold flex items-center gap-1.5 ${txt}`}>
                  <Zap className="w-5 h-5 text-[#d4798e] animate-pulse" /> Emotional Weather Timeline
                </h3>
                <p className={`text-xs mt-1 ${txtMuted}`}>Spotting fatigue accumulation to map safe bounds</p>

                <div className={`mt-5 p-4 rounded-2xl border grid grid-cols-1 md:grid-cols-2 gap-4 ${theme === 'dark' ? 'bg-[#07040f] border-[#c9a0dc]/15' : 'bg-purple-50/55 border-purple-200/60'}`}>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#d4798e] block">Log Decompression Node</span>
                    <p className={`text-[11px] leading-relaxed mt-1 ${txtMuted}`}>Log fatigue instances to unlock rest offsets dynamically.</p>
                    <div className="flex gap-2 flex-wrap mt-3">
                      <button onClick={() => addBurnoutEvent('fatigue', 'Felt deep mental tiredness after arranging schedules.', 40)} className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold cursor-pointer ${theme === 'dark' ? 'border-[#c9a0dc]/20 bg-[#d4798e]/10 text-[#d4798e]' : 'border-purple-300 bg-[#d4798e]/10 text-purple-700'}`}>
                        ☁️ Log Fatigue Spike
                      </button>
                      <button onClick={() => addBurnoutEvent('overwhelm', 'Worry index high before radiotherapy planning.', 25)} className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold cursor-pointer ${theme === 'dark' ? 'border-pink-500/20 bg-pink-500/10 text-[#ea96a6]' : 'border-pink-300 bg-pink-50 text-pink-700'}`}>
                        🌧️ Log Overwhelm
                      </button>
                    </div>
                  </div>
                  <div className={`relative rounded-xl overflow-hidden h-24 flex flex-col justify-center items-center p-3 text-center border border-dashed ${theme === 'dark' ? 'bg-gradient-to-tr from-[#251a3d] to-[#07040f] border-[#c9a0dc]/15' : 'bg-gradient-to-tr from-purple-100/40 to-slate-50 border-purple-300/60'}`}>
                    <span className="text-xl animate-spin" style={{ animationDuration: '24s' }}>🌀</span>
                    <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${theme === 'dark' ? 'text-[#ea96a6]' : 'text-purple-700'}`}>Atmosphere: Starry &amp; Hazy</span>
                    <span className={`text-[8px] mt-0.5 font-mono ${txtMuted}`}>Micro-recoveries settling slowly</span>
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#d4798e] block pl-1">Historical Weather Chart</span>
                  <div className="space-y-4">
                    {burnoutEvents.map((evt) => (
                      <div key={evt.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left hover:border-purple-300 transition shadow-sm ${surfaceBg} ${surfaceBorder}`}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${txtMuted}`}>{evt.time}</span>
                            <span className={`text-[8px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                              evt.moodType === 'fatigue' ? 'bg-[#c9a0dc]/20 text-purple-700 dark:text-[#c9a0dc]' :
                              evt.moodType === 'overwhelm' ? 'bg-rose-500/10 text-pink-600 dark:text-[#ea96a6]' :
                              evt.moodType === 'stable' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                              'bg-amber-400/10 text-amber-700 dark:text-amber-300'
                            }`}>
                              {evt.moodType}
                            </span>
                          </div>
                          <p className={`text-xs font-semibold leading-tight pr-3 ${theme === 'dark' ? 'text-[#f4d4a8]' : 'text-[#2e214c]'}`}>"{evt.notes}"</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[9px] font-mono uppercase font-bold ${txtMuted}`}>Energy:</span>
                          <span className={`text-xs font-black ${txt}`}>{evt.energy}%</span>
                          <div className={`w-12 h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-[#07040f]' : 'bg-purple-100'}`}>
                            <div className="bg-[#d4798e] h-full rounded-full" style={{ width: `${evt.energy}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: CARE ORBIT */}
          {activeSection === 'circle' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className={`border rounded-3xl p-6 shadow-xl leading-relaxed text-left ${cardBg} ${cardBorder}`}>
                <div className="border-b pb-4 mb-6 border-purple-100/10">
                  <h3 className={`text-md font-extrabold flex items-center gap-1.5 ${txt}`}>
                    <Users className="w-5 h-5 text-[#d4798e]" /> Concentric Care Support Circle
                  </h3>
                  <p className={`text-xs mt-1 ${txtMuted}`}>Mapping communication resonance, support strain, and orbital connectivity</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className={`lg:col-span-7 relative rounded-3xl p-6 border text-center h-[340px] flex items-center justify-center overflow-hidden ${theme === 'dark' ? 'bg-[#07040f] border-[#c9a0dc]/10' : 'bg-purple-50/20 border-purple-200/50'}`}>
                    <div className="absolute inset-6 border border-dashed border-purple-200/50 dark:border-[#c9a0dc]/15 rounded-full animate-spin duration-[40s]" />
                    <div className="absolute inset-16 border border-dashed border-teal-400/20 rounded-full animate-spin duration-[28s]" />
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="rgba(212,121,142,0.3)" strokeDasharray="4" strokeWidth="1" />
                      <line x1="50%" y1="50%" x2="80%" y2="35%" stroke="rgba(156,130,186,0.3)" strokeDasharray="4" strokeWidth="1" />
                      <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="rgba(147,197,253,0.3)" strokeDasharray="4" strokeWidth="1" />
                      <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="rgba(45,212,191,0.3)" strokeDasharray="4" strokeWidth="1" />
                    </svg>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#d4798e] via-[#9c82ba] to-[#decfe6] flex flex-col items-center justify-center text-white font-black shadow-2xl z-10 animate-pulse cursor-pointer">
                      <Heart className="w-4 h-4 fill-white" />
                      <span className="text-[10px] mt-0.5 font-black">SARAH</span>
                    </div>
                    <div className="absolute top-12 left-12 w-11 h-11 rounded-full bg-gradient-to-tr from-rose-300 to-amber-200 border border-white flex flex-col items-center justify-center text-[#1a1530] font-bold text-[8px] shadow-md z-10 cursor-pointer hover:scale-105">
                      <span>Mom</span><span className="text-[6px] opacity-70">Active</span>
                    </div>
                    <div className="absolute top-24 right-10 w-12 h-12 rounded-full bg-gradient-to-tr from-purple-300 to-indigo-100 border border-white flex flex-col items-center justify-center text-[#1a1530] font-bold text-[8px] shadow-md z-10 cursor-pointer hover:scale-105">
                      <span>Oncologist</span><span className="text-[6px] opacity-70">Dr. Moss</span>
                    </div>
                    <div className="absolute bottom-10 right-20 w-11 h-11 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-100 border border-white flex flex-col items-center justify-center text-[#1a1530] font-bold text-[8px] shadow-md z-10 cursor-pointer hover:scale-105">
                      <span>Sister</span><span className="text-[6px] opacity-70">Chloe</span>
                    </div>
                    <div className="absolute bottom-14 left-14 w-10 h-10 rounded-full bg-gradient-to-tr from-teal-300 to-emerald-200 border border-white flex flex-col items-center justify-center text-[#1a1530] font-bold text-[8px] shadow-md z-10 cursor-pointer hover:scale-105">
                      <span>Friend</span><span className="text-[6px] opacity-70">Gavin</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#d4798e] block">Orbit Status Cards</span>
                    <div className="space-y-2.5">
                      <div className={`p-3 rounded-2xl border text-xs text-left ${surfaceBg} ${surfaceBorder}`}>
                        <div className="flex justify-between font-bold">
                          <span className={theme === 'dark' ? 'text-[#f4d4a8]' : 'text-[#2e214c]'}>Mother (Mom)</span>
                          <span className="text-emerald-600 dark:text-emerald-500 font-mono text-[9px]">ACTIVE</span>
                        </div>
                        <p className={`text-[11px] mt-1 leading-normal ${txtMuted}`}>"Checked Sarah's morning hydration. Arranged lunch porridge."</p>
                      </div>
                      <div className={`p-3 rounded-2xl border text-xs text-left ${surfaceBg} ${surfaceBorder}`}>
                        <div className="flex justify-between font-bold">
                          <span className={theme === 'dark' ? 'text-[#f4d4a8]' : 'text-[#2e214c]'}>Oncology Lead (Dr. Moss)</span>
                          <span className="text-[#9c82ba] font-mono text-[9px]">CLINICAL</span>
                        </div>
                        <p className={`text-[11px] mt-1 leading-normal ${txtMuted}`}>"Provided scan parameter updates. Safe bounds aligned."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: PRIVATE JOURNAL */}
          {activeSection === 'journal' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className={`border rounded-3xl p-6 shadow-xl leading-relaxed text-left relative overflow-hidden ${cardBg} ${cardBorder}`}>
                <span className="absolute top-0 right-0 w-28 h-28 bg-[#d4798e]/5 blur-2xl rounded-full" />
                <h3 className={`text-md font-extrabold flex items-center gap-2 ${txt}`}>
                  <Lock className="w-4 h-4 text-emerald-500" /> Locked Private Decompress Space
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${txtMuted}`}>
                  Caregivers suppress emotions constantly to appear strong on the outside. This journal box is completely secure, invisible to Sarah, with a floating voice-to-transcribe orb.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
                  <div className={`md:col-span-5 rounded-2xl p-5 border flex flex-col items-center justify-center text-center relative overflow-hidden h-[240px] ${theme === 'dark' ? 'bg-[#07040f] border-[#c9a0dc]/10' : 'bg-purple-50/20 border-purple-200/55'}`}>
                    <div className="absolute inset-0 bg-radial from-violet-600/10 to-transparent pointer-events-none blur-xl" />
                    <div className={`flex items-end justify-center gap-1 my-4 h-12 ${voiceActive ? 'opacity-100' : 'opacity-30'}`}>
                      {[1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 2, 1].map((bar, bIdx) => (
                        <div key={bIdx} className="w-1 rounded-full bg-gradient-to-t from-[#decfe6] to-[#d4798e] transition-all"
                          style={{ height: voiceActive ? `${bar * 9 + Math.random() * 10}px` : '4px' }} />
                      ))}
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#ea96a6] mt-1 font-mono">
                      {voiceActive ? `vocal stream: Active // ${waveSeconds}s` : 'Vocal stream idle'}
                    </p>
                    <button
                      onClick={triggerVoiceNote}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg mt-4 ring-4 ${voiceActive ? 'bg-[#d4798e] ring-pink-500/20 shadow-[#d4798e]/40 hover:scale-95 animate-pulse' : 'bg-[#1c1530] border border-[#c9a0dc]/40 ring-[#c9a0dc]/10 hover:scale-105'}`}
                    >
                      <Mic className={`w-5 h-5 ${voiceActive ? 'text-white' : 'text-[#decfe6]'}`} />
                    </button>
                    <span className={`text-[9px] mt-2 font-bold uppercase tracking-wider ${txtMuted}`}>{voiceActive ? 'Tap to stop transcription' : 'Tap to unpack voice'}</span>
                  </div>

                  <div className="md:col-span-7 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#d4798e] block">Write or transcribed entry notes:</span>
                      <textarea
                        className={`w-full text-xs p-4 rounded-2xl border mt-2 focus:outline-none focus:border-[#d4798e] leading-relaxed bg-transparent ${theme === 'dark' ? 'text-[#decfe6] border-[#c9a0dc]/15' : 'text-[#2e214c] border-purple-300 bg-slate-50'}`}
                        rows={6}
                        placeholder="Pour whatever fits inside your heart tonight. Sarah cannot read this; your boundaries are locked."
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className={`text-[9px] font-mono flex items-center gap-1 ${txtMuted}`}>🔒 Locked &amp; Aligned Encryption Stable</span>
                      <button
                        onClick={saveJournalEntry}
                        disabled={!journalText.trim()}
                        className="px-5 py-2 rounded-xl bg-[#d4798e] hover:bg-[#ea96a6] text-white text-xs font-bold leading-none cursor-pointer disabled:opacity-40"
                      >
                        Commit to Star Constell ✦
                      </button>
                    </div>
                  </div>
                </div>

                {journalLogs.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#d4798e] block pl-1">Decompress Archives</span>
                    <div className="space-y-4">
                      {journalLogs.map((log) => (
                        <div key={log.id} className={`p-5 rounded-2xl border text-left space-y-3.5 hover:border-[#c9a0dc]/20 transition ${surfaceBg} ${surfaceBorder}`}>
                          <div className="flex justify-between items-center border-b border-[#7e6c9e]/10 pb-2">
                            <span className={`text-[9px] font-mono flex items-center gap-1 ${txtMuted}`}>🔓 DECOMPRESSED LOG</span>
                            <span className={`text-[10px] font-mono font-bold ${txtMuted}`}>{log.date}</span>
                          </div>
                          <p className={`text-xs leading-relaxed italic pr-2 ${txtSubtle}`}>"{log.text}"</p>
                          <div className="p-3 bg-[#decfe6]/10 rounded-xl border border-[#c9a0dc]/15 flex gap-2.5 items-start text-[11px]">
                            <Sparkles className="w-4 h-4 text-[#d4798e] flex-shrink-0 animate-pulse" />
                            <div>
                              <b className="uppercase font-bold tracking-wider text-[8px] text-[#ea96a6] block mb-0.5">Astra Compass Interpretation:</b>
                              <p className={`italic leading-normal ${txtMuted}`}>{log.reply}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'shared' && (
            <div className="animate-fade-in">
              <SharedConstellation theme={theme} role="caregiver" onNavigateHome={() => setActiveSection('home')} />
            </div>
          )}
        </div>

        {/* FLOATING QUICK ACTIONS ORB */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            {quickSupportOpen && (
              <div className="absolute bottom-16 right-0 w-52 bg-[#120d21] border border-[#c9a0dc]/30 rounded-2xl p-3 shadow-2xl backdrop-blur-md animate-fade-in flex flex-col gap-1.5 text-left text-xs text-white">
                <span className="text-[9px] font-black uppercase text-[#ea96a6] border-b border-[#c9a0dc]/10 pb-1.5 mb-1.5 pl-1 tracking-widest block font-mono">QUICK COMPASS</span>
                <button onClick={() => { setActiveSection('communication'); setQuickSupportOpen(false); handleSendCommQuery("How do I talk without sounding afraid?"); }} className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-[11px] font-semibold text-[#decfe6] hover:bg-white/10 cursor-pointer text-left transition">
                  <MessageSquare className="w-3.5 h-3.5 text-[#d4798e]" /><span>Phrasing Guidance ✨</span>
                </button>
                <button onClick={() => { setActiveSection('journal'); setQuickSupportOpen(false); }} className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-[11px] font-semibold text-[#decfe6] hover:bg-white/10 cursor-pointer text-left transition">
                  <Mic className="w-3.5 h-3.5 text-purple-400" /><span>Vocal Grounding 🎙️</span>
                </button>
                <button onClick={() => { setActiveSection('emotion'); setQuickSupportOpen(false); }} className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-[11px] font-semibold text-[#decfe6] hover:bg-white/10 cursor-pointer text-left transition">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /><span>Quick Rest Check 🌸</span>
                </button>
                <div className="border-t border-[#c9a0dc]/15 pt-1.5 mt-1">
                  <a href="https://www.bcf.org.sg" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-[11px] font-black text-red-400 hover:bg-red-500/10 cursor-pointer text-left transition">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-bounce" /><span>Emergency Lines 🚨</span>
                  </a>
                </div>
              </div>
            )}
            <button
              onClick={() => setQuickSupportOpen(!quickSupportOpen)}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-[#d4798e] via-[#9c82ba] to-[#e8b4bc] text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-2xl hover:scale-103 hover:shadow-[#d4798e]/20 transition-all ring-4 ring-[#d4798e]/20 select-none"
            >
              <Heart className="w-4 h-4 fill-white text-none animate-pulse" />
              <span>Astra Care Orb</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}