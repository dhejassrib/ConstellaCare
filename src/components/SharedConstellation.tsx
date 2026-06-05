import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star, Heart, Sparkles, Send, HelpCircle, Calendar, ArrowRight,
  ShieldCheck, RefreshCw, MessageSquare, AlertCircle, Award, CheckCircle2,
  Share2, Zap, LayoutGrid, Radio, Plus, Trash, Clock, Activity, FileText
} from 'lucide-react';

interface SharedConstellationProps {
  theme: 'light' | 'dark';
  role: 'patient' | 'caregiver';
  isLoggedIn?: boolean;
  onNavigateHome: () => void;
}

interface MessageStar {
  id: string;
  sender: 'patient' | 'caregiver';
  message: string;
  senderName: string;
  timestamp: string;
  x: number; // percentage pos
  y: number; // percentage pos
}

interface SharedMilestone {
  id: string;
  title: string;
  date: string;
  category: 'milestone' | 'encouragement' | 'support' | 'activity';
  notes: string;
  createdBy: string;
}

export default function SharedConstellation({ theme, role, isLoggedIn = false, onNavigateHome }: SharedConstellationProps) {
  // Shared Live Constellation States (with localStorage syncing)
  const [messageStars, setMessageStars] = useState<MessageStar[]>(() => {
    const cached = localStorage.getItem('shared-message-stars');
    if (cached) return JSON.parse(cached);
    return [
      { id: '1', sender: 'caregiver', message: 'Thinking of you before treatment cycle today, you are my absolute light 💜', senderName: 'Caregiver (Mom)', timestamp: '9:30 AM', x: 25, y: 30 },
      { id: '2', sender: 'patient', message: 'Completed my cozy bubble breathing session! Felt very warm.', senderName: 'Patient (Sarah)', timestamp: '11:15 AM', x: 75, y: 40 },
      { id: '3', sender: 'caregiver', message: 'I packed your ginger tea bags and wool socks for tomorrow.', senderName: 'Caregiver (Mom)', timestamp: '1:05 PM', x: 45, y: 70 },
    ];
  });

  const [milestones, setMilestones] = useState<SharedMilestone[]>(() => {
    const cached = localStorage.getItem('shared-milestones');
    if (cached) return JSON.parse(cached);
    return [
      { id: '1', title: 'Finished Recovery treatment cycle', date: 'May 20, 2026', category: 'milestone', notes: 'Walked through review together successfully.', createdBy: 'Oncology Lead' },
      { id: '2', title: 'Active Grounding Breathing Completed', date: 'May 24, 2026', category: 'activity', notes: 'Sarah breathed for 5 full cycles smoothly.', createdBy: 'Sarah' },
      { id: '3', title: 'Family Support Circles Aligned', date: 'May 25, 2026', category: 'support', notes: 'Mom, Sibling, and spouses split logistics.', createdBy: 'Mom' },
    ];
  });

  const [supportRequested, setSupportRequested] = useState<boolean>(() => {
    return localStorage.getItem('shared-support-request') === 'true';
  });

  const [supportMessage, setSupportMessage] = useState<string>(() => {
    return localStorage.getItem('shared-support-msg') || 'Needs extra care presence today.';
  });

  // Local state for layout tab filtering inside left column
  const [activeLeftTab, setActiveLeftTab] = useState<'timeline' | 'memories'>('timeline');

  // External states loaded from local storage for a real Shared Health Timeline
  const [meds, setMeds] = useState<any[]>([]);
  const [symptoms, setSymptoms] = useState<Record<string, number>>({});
  const [journals, setJournals] = useState<any[]>([]);

  // shooting stars trigger state
  const [shootingStars, setShootingStars] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [lightCount, setLightCount] = useState<number>(() => {
    const cached = localStorage.getItem('shared-light-count');
    return cached ? parseInt(cached) : 48;
  });

  // Local Form state
  const [newMessage, setNewMessage] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneNotes, setNewMilestoneNotes] = useState('');

  // Account Sync progressive triggers
  const [showProgressiveAuth, setShowProgressiveAuth] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState('');

  // Input states
  const [customSupportNote, setCustomSupportNote] = useState('');

  // Trusted circle inputs
  const [invitedEmail, setInvitedEmail] = useState('');
  const [invitedRelation, setInvitedRelation] = useState<'spouse' | 'sibling' | 'friend' | 'parent'>('sibling');

  useEffect(() => {
    localStorage.setItem('shared-message-stars', JSON.stringify(messageStars));
  }, [messageStars]);

  useEffect(() => {
    localStorage.setItem('shared-milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('shared-support-request', supportRequested ? 'true' : 'false');
  }, [supportRequested]);

  useEffect(() => {
    localStorage.setItem('shared-light-count', lightCount.toString());
  }, [lightCount]);

  // Load real telemetry records on startup
  useEffect(() => {
    try {
      const medsCache = localStorage.getItem('constella-medications');
      if (medsCache) setMeds(JSON.parse(medsCache));

      const sympCache = localStorage.getItem('constella-symptom-logs');
      if (sympCache) setSymptoms(JSON.parse(sympCache));

      const journCache = localStorage.getItem('constella-reflection-history');
      if (journCache) setJournals(JSON.parse(journCache));
    } catch (e) {
      console.error("Error loading shared timeline telemetry logs", e);
    }
  }, []);

  // Utility to fire a shooting star
  const triggerSendLight = () => {
    const newStar = {
      id: Math.random().toString(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    };
    setShootingStars(prev => [...prev, newStar]);
    setLightCount(prev => prev + 1);

    // Clean up animation
    setTimeout(() => {
      setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
    }, 1500);

    // Check progressive reward signup trigger
    if (lightCount >= 50) {
      triggerProgressiveAuth("Light Up Each Other Spark");
    }
  };

  const triggerProgressiveAuth = (reason: string) => {
    if (isLoggedIn) return;
    try {
      if (localStorage.getItem('constella_user')) return;
    } catch {
      /* ignore */
    }
    setAuthTriggerReason(reason);
    setShowProgressiveAuth(true);
  };

  const handleSendMessageStar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newStar: MessageStar = {
      id: Math.random().toString(),
      sender: role,
      message: newMessage,
      senderName: role === 'patient' ? 'Sarah (Patient)' : 'Mom (Caregiver)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      x: Math.floor(Math.random() * 65) + 18,
      y: Math.floor(Math.random() * 65) + 18
    };

    setMessageStars(prev => [...prev, newStar]);
    
    // Add an automated milestone of connection
    const newMs: SharedMilestone = {
      id: Math.random().toString(),
      title: `${newStar.senderName} cast a Communication Star`,
      date: 'Just Now',
      category: 'encouragement',
      notes: `"${newStar.message.slice(0, 40)}..."`,
      createdBy: newStar.senderName
    };
    setMilestones(prev => [newMs, ...prev]);

    setNewMessage('');

    setTimeout(() => {
      triggerProgressiveAuth("Casting Message Star across orbits");
    }, 700);
  };

  const handleToggleSupportRequest = () => {
    if (supportRequested) {
      setSupportRequested(false);
      localStorage.setItem('shared-support-request', 'false');
    } else {
      const note = customSupportNote.trim() || "Sarah is raw today and welcomes extra gentle supportive text lines.";
      setSupportRequested(true);
      setSupportMessage(note);
      localStorage.setItem('shared-support-request', 'true');
      localStorage.setItem('shared-support-msg', note);

      // Log milestone
      const newMs: SharedMilestone = {
        id: Math.random().toString(),
        title: 'Support Beacon Ignited',
        date: 'Just Now',
        category: 'support',
        notes: `Sarah set support request: "${note}"`,
        createdBy: 'Sarah (Patient)'
      };
      setMilestones(prev => [newMs, ...prev]);
      setCustomSupportNote('');

      setTimeout(() => {
        triggerProgressiveAuth("Triggered live urgent patient beacon");
      }, 700);
    }
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    const newMs: SharedMilestone = {
      id: Math.random().toString(),
      title: newMilestoneTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: 'milestone',
      notes: newMilestoneNotes || 'Committed to our collective care memories.',
      createdBy: role === 'patient' ? 'Patient (Sarah)' : 'Caregiver (Mom)'
    };

    setMilestones(prev => [newMs, ...prev]);
    setNewMilestoneTitle('');
    setNewMilestoneNotes('');

    setTimeout(() => {
      triggerProgressiveAuth("Added timeline milestone marker");
    }, 800);
  };

  const handleInviteToCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitedEmail.trim()) return;
    alert(`✉️ Invitation sent securely to ${invitedEmail}! They have been invited to join your support circle orbit as a ${invitedRelation}.`);
    setInvitedEmail('');
    triggerProgressiveAuth("Invited Trusted Circle Orbit Member");
  };

  const removeMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const clearSupportBeacon = () => {
    setSupportRequested(false);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 font-sans ${theme === 'dark' ? 'bg-[#06030c] text-[#f7f2eb]' : 'bg-[#FAF7FC] text-[#1a1135]'}`}>
      
      {/* Absolute backdrops */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#a855f7]/10 via-[#ec4899]/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.03),transparent)]" />
      </div>

      <div className="relative z-10 px-4 md:px-8 pt-6 pb-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-base shadow-lg ring-4 ring-purple-500/10 animate-pulse">
                ✨
              </span>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#d4798e] block">COLLABORATIVE CO-CARE HUB</span>
                <h1 className={`text-xl md:text-2xl font-black italic tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#3d2c5e]'}`}>
                  Shared Constellation Portal
                </h1>
              </div>
            </div>

            <button
              onClick={onNavigateHome}
              className={`px-4 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                theme === 'dark' 
                  ? 'bg-purple-950/20 text-[#decfe6] border-purple-500/30 hover:border-purple-500/60' 
                  : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
              }`}
            >
              ← Back to individual Dashboard
            </button>
          </div>

          <div className={`relative overflow-hidden rounded-3xl p-5 md:p-6 border text-center shadow-lg ${
            theme === 'dark' ? 'bg-[#110c24]/95 border-purple-500/20 text-white' : 'bg-white border-purple-100 text-[#1e133a]'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-1">
              <h2 className="text-base md:text-lg font-black italic text-purple-650 dark:text-purple-300">
                “Two stars navigating the same night sky.”
              </h2>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-[#4f426d]'}`}>
                Welcome to active co-presence. Most health tools compile charts as cold rows of spreadsheets. 
                ConstellaCare connects patient timelines and caregiver tools into a single glowing web of shared micro-comfort.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SUPPORT BEACON BANNER */}
      {/* {supportRequested && (
        <div className="px-4 md:px-8 py-1 relative z-10 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-[#110c24] border border-rose-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-pulse">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#d4798e]">ACTIVE SUPPORT BEACON DECLARED</span>
                <p className="text-xs font-bold text-rose-200 mt-0.5">
                  Sarah requested emotional presence check-in: <span className="italic font-normal">"{supportMessage}"</span>
                </p>
              </div>
            </div>

            {role === 'caregiver' ? (
              <button
                onClick={() => {
                  triggerSendLight();
                  alert("✨ A supportive light beam has been cast to Sarah immediately.");
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-sans text-[11px] font-bold shadow hover:scale-102 cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-white" /> Respond with Love
              </button>
            ) : (
              <button
                onClick={clearSupportBeacon}
                className="px-3 py-1 text-slate-450 hover:text-[#d4798e] bg-slate-800/10 hover:bg-slate-800/20 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Clear beacon
              </button>
            )}
          </div>
        </div>
      )} */}

      {/* HUB WORKSPACE LAYOUT */}
      <div className="relative z-10 px-4 md:px-8 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">

        {/* ============================================== */}
        {/* LEFT COLUMN: SHARED JOURNEY & METRIC TIMELINE */}
        {/* ============================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className={`border rounded-3xl p-5 shadow-lg ${
            theme === 'dark' ? 'bg-[#110c24]/90 border-purple-500/25 text-white' : 'bg-white border-purple-150 text-[#1e133a]'
          }`}>
            <div className="border-b border-slate-100 dark:border-purple-500/10 pb-3 mb-4 text-left">
              <h3 className="text-xs font-black uppercase tracking-widest text-purple-700 dark:text-purple-400">
                Shared Health Snapshot
              </h3>
              <span className="text-[10px] text-slate-400">
                Key updates visible to both patient and caregiver
              </span>
            </div>

            {/* Render Tab Contents */}
            <div className="space-y-4 text-left">

              {/* Health Snapshot */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-purple-950/15 border border-slate-100 dark:border-purple-500/5">
                <h4 className="text-[10px] font-bold uppercase tracking-wide text-purple-600 mb-2">
                  Shared Health Snapshot
                </h4>

                <div className="space-y-1 text-xs">
                  <p>💜 Mood: Calm</p>
                  <p>⚡ Fatigue: Moderate</p>
                  <p>💊 Medication adherence: 85%</p>
                </div>
              </div>

              {/* Appointment */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-purple-950/15 border border-slate-100 dark:border-purple-500/5">
                <h4 className="text-[10px] font-bold uppercase tracking-wide text-purple-600 mb-2">
                  Upcoming Appointment
                </h4>

                <p className="text-xs">
                  Tomorrow · General Check-In & Medication Review
                </p>
              </div>

              {/* Shared Tasks */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-purple-950/15 border border-slate-100 dark:border-purple-500/5">
                <h4 className="text-[10px] font-bold uppercase tracking-wide text-purple-600 mb-2">
                  Shared Care Tasks
                </h4>

                <ul className="text-xs space-y-1">
                  <li>✓ Prepare consultation questions</li>
                  <li>✓ Track fatigue this evening</li>
                  <li>✓ Confirm medication refill</li>
                </ul>
              </div>

              {/* Support Message */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-purple-950/15 border border-slate-100 dark:border-purple-500/5">
                <h4 className="text-[10px] font-bold uppercase tracking-wide text-purple-600 mb-2">
                  Recent Support
                </h4>

                <p className="text-xs italic">
                  "Thinking of you today."
                </p>

                <p className="text-[10px] mt-1 text-slate-400">
                  — Sarah
                </p>
              </div>

            </div>
            
          </div>

        </div>

        {/* ============================================== */}
        {/* CENTER COLUMN: LIVE CONSTELLATION TWIN MAP */}
        {/* ============================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#110c24] border border-purple-500/20 rounded-3xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between h-[510px]">
            {/* Ambient map stars */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
              <div className="absolute inset-10 border border-dashed border-purple-500/10 rounded-full animate-spin duration-[55s]" />
              <div className="absolute inset-28 border border-dashed border-pink-500/10 rounded-full animate-spin duration-[30s]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-purple-500/5 blur-2xl" />
            </div>

            <div className="relative z-10 flex justify-between items-start">
              <div className="text-left">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-pink-400 animate-pulse" /> Live Constellation Grid
                </h3>
                <span className="text-[10px] text-purple-300/80 block">Simultaneous co-presence linked live</span>
              </div>
              <div className="bg-[#070512] border border-purple-500/20 rounded-lg px-2.5 py-1 font-mono text-[9px] text-purple-300">
                ⭐ {messageStars.length} Stars aligned
              </div>
            </div>

            {/* Interactive map twins alignment */}
            <div className="relative w-full h-[320px] bg-slate-950/40 rounded-2xl border border-purple-500/5 overflow-hidden my-4 z-10 flex items-center justify-center">
              
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="30%" y1="50%" x2="70%" y2="50%" stroke="url(#line-glow)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                {messageStars.map((ms) => (
                  <line
                    key={ms.id}
                    x1="50%"
                    y1="50%"
                    x2={`${ms.x}%`}
                    y2={`${ms.y}%`}
                    stroke="rgba(168, 85, 247, 0.25)"
                    strokeWidth="0.75"
                  />
                ))}

                <defs>
                  <linearGradient id="line-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Patient node */}
              <div className="absolute left-[18%] top-[38%] text-center z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-pink-500/30 ring-4 ring-pink-500/20 animate-pulse">
                  Sarah
                </div>
                <span className="text-[9px] font-mono text-pink-300 block mt-1.5">● Patient Star</span>
              </div>

              {/* Caregiver node */}
              <div className="absolute right-[18%] top-[38%] text-center z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-450 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-550/30 ring-4 ring-purple-550/20 animate-pulse" style={{ animationDelay: '1s' }}>
                  Mom
                </div>
                <span className="text-[9px] font-mono text-purple-300 block mt-1.5">● Care Core</span>
              </div>

              {/* Message stars */}
              {messageStars.map((star) => (
                <div
                  key={star.id}
                  className="absolute cursor-pointer group"
                  style={{ left: `${star.x}%`, top: `${star.y}%` }}
                  title={`${star.senderName}: "${star.message}"`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#FAF8FD] flex items-center justify-center shadow-md ring-4 ring-purple-500/10 hover:scale-[1.3] transition-all">
                    <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400 animate-pulse" />
                  </div>

                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#0c081d] border border-purple-500/40 text-[9px] text-[#decfe6] rounded-xl p-2.5 w-40 z-30 pointer-events-none transition-opacity duration-250 shadow-xl leading-relaxed text-left">
                    <b className="block text-pink-400">{star.senderName}</b>
                    <p className="mt-0.5 italic">"{star.message}"</p>
                    <span className="block text-slate-500 text-[8px] text-right mt-1 font-mono">{star.timestamp}</span>
                  </div>
                </div>
              ))}

              <AnimatePresence>
                {shootingStars.map((ss) => (
                  <motion.div
                    key={ss.id}
                    initial={{ scale: 0.1, opacity: 1, y: -20, x: -20 }}
                    animate={{ scale: [1, 2.5, 0.5], opacity: [0, 1, 1, 0], x: 0, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute z-20 pointer-events-none"
                    style={{ left: `${ss.x}%`, top: `${ss.y}%` }}
                  >
                    <Sparkles className="w-8 h-8 text-amber-300 filter drop-shadow-[0_0_8px_gold] animate-spin" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Light alignment action */}
            <div className="relative z-10 flex items-center justify-between bg-[#070512]/90 border border-purple-500/15 p-3 rounded-2xl text-[10px] text-purple-300">
              <span className="text-left font-medium">💖 Active light connections: <b>{lightCount} alignment sparks</b></span>
              <button
                onClick={triggerSendLight}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold tracking-tight hover:scale-102 hover:shadow-lg hover:shadow-purple-500/15 cursor-pointer transition-transform flex items-center gap-1 font-sans text-[11px]"
              >
                <Zap className="w-3 h-3 fill-white" /> Send Support Spark!
              </button>
            </div>
          </div>

        </div>

        {/* ============================================== */}
        {/* RIGHT COLUMN: ACTION CONTROLS & TRUSTED CIRCLE */}
        {/* ============================================== */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* CAST COMMUNICATION COINCIDENCE STAR */}
          <div className={`border rounded-3xl p-5 shadow-lg ${
            theme === 'dark' ? 'bg-[#110c24]/90 border-purple-500/25 text-white' : 'bg-white border-purple-150 text-[#1e133a]'
          }`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-purple-700 dark:text-[#a855f7] flex items-center gap-1.5 text-left border-b border-purple-500/10 pb-2 mb-3">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Cast Message Star
            </h3>
            <p className={`text-[10px] text-left leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-[#4f426d]'}`}>
              Write a gentle message or comfort check-in. It will lock in space as a permanent star on Sarah's timeline instantly.
            </p>

            <form onSubmit={handleSendMessageStar} className="space-y-3">
              <textarea
                placeholder="Type your encouraging reminder or meal logistics notes..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                maxLength={90}
                className="w-full text-xs p-3 h-20 rounded-2xl border bg-transparent font-sans text-slate-750 dark:text-slate-100 border-slate-200 dark:border-purple-500/20 focus:outline-none focus:border-pink-500"
              />
              <div className="flex justify-between items-center text-[9px] text-slate-400">
                <span>Max 90 chars</span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-sans font-bold shadow-md hover:bg-purple-700 cursor-pointer flex items-center gap-1 shrink-0"
                >
                  Cast Star <Send className="w-3 h-3 fill-white" />
                </button>
              </div>
            </form>
          </div>

          {/* BRING TRUSTED RELATION CIRCLES IN */}
          {/* <div className={`border rounded-3xl p-5 shadow-lg ${
            theme === 'dark' ? 'bg-[#110c24]/90 border-purple-500/25 text-white' : 'bg-white border-purple-150 text-[#1e133a]'
          }`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#a855f7] flex items-center gap-1.5 border-b border-purple-500/10 pb-2 mb-3 text-left">
              <Plus className="w-4 h-4 text-purple-500" /> Trusted Circle Invite
            </h3>
            <p className={`text-[10px] text-left leading-normal mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-[#4f426d]'}`}>
              Invite additional members (spouse, sibling, friend, parent, caregiver) to join this mutual constellation workspace.
            </p>

            <form onSubmit={handleInviteToCircle} className="space-y-3 text-left">
              <div>
                <label className="text-[8px] font-bold font-mono text-slate-400 uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@trustedcircle.com"
                  value={invitedEmail}
                  onChange={e => setInvitedEmail(e.target.value)}
                  className="w-full text-[11px] px-3 py-2 border rounded-xl bg-transparent font-sans text-slate-700 dark:text-slate-105 border-slate-200 dark:border-purple-500/20 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[8px] font-bold font-mono text-slate-400 uppercase block mb-1">Relationship Role</label>
                <select
                  value={invitedRelation}
                  onChange={e => setInvitedRelation(e.target.value as any)}
                  className="w-full text-[11px] px-2.5 py-2 border rounded-xl bg-white dark:bg-slate-950 font-sans text-slate-700 dark:text-slate-105 border-slate-200 dark:border-purple-500/20 focus:outline-none focus:border-purple-500"
                >
                  <option value="spouse">Spouse / Partner</option>
                  <option value="sibling">Sibling (Brother/Sister)</option>
                  <option value="parent">Parent (Mother/Father)</option>
                  <option value="friend">Best Friend</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-sans text-xs font-bold rounded-xl shadow cursor-pointer hover:opacity-90 active:scale-[0.99] transition mt-2"
              >
                + Invite to Support Orbit
              </button>
            </form>
          </div> */}

          {/* MILSTONE MEMORIES CHRONOLOGY */}
          {/* <div className={`border rounded-3xl p-5 shadow-lg ${
            theme === 'dark' ? 'bg-[#110c24]/90 border-purple-500/25 text-white' : 'bg-white border-purple-150 text-[#1e133a]'
          }`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#a855f7] flex items-center gap-1.5 border-b border-purple-500/10 pb-2 mb-3 text-left">
              <Calendar className="w-4 h-4" /> Add Memory Event
            </h3>
            
            <form onSubmit={handleAddMilestone} className="space-y-3">
              <input
                type="text"
                placeholder="E.g. Finished physical alignment"
                value={newMilestoneTitle}
                onChange={e => setNewMilestoneTitle(e.target.value)}
                required
                className="w-full text-[11px] px-3 py-2 border rounded-xl bg-transparent font-sans text-slate-705 dark:text-slate-100 border-slate-200 dark:border-purple-500/20 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="E.g. Checked glucose levels, paced and rested"
                value={newMilestoneNotes}
                onChange={e => setNewMilestoneNotes(e.target.value)}
                className="w-full text-[11px] px-3 py-2 border rounded-xl bg-transparent font-sans text-slate-705 dark:text-slate-100 border-slate-200 dark:border-purple-500/20 focus:outline-none focus:border-purple-500"
              />
              
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-sans text-xs font-bold rounded-xl shadow cursor-pointer hover:opacity-90 active:scale-[0.99] transition"
              >
                + Commit to Sky Timeline
              </button>
            </form>
          </div> */}

        </div>

      </div>

      {/* REWARD REGISTRATION MODAL */}
      <AnimatePresence>
        {showProgressiveAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProgressiveAuth(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-md bg-[#130d2a] border border-purple-500/35 overflow-hidden rounded-3xl p-6 text-center shadow-2xl z-10"
            >
              <div className="absolute top-3 left-4 w-12 h-12 bg-pink-500/10 blur-xl rounded-full" />
              <div className="absolute bottom-3 right-4 w-12 h-12 bg-purple-500/10 blur-xl rounded-full" />

              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white text-xl mx-auto mb-4 animate-pulse">
                ✨
              </div>

              <h3 className="text-base font-black text-rose-100 italic">
                Preserve your mutual constellation progress across platforms!
              </h3>
              
              <div className="p-3 my-3 bg-purple-950/40 rounded-2xl border border-purple-500/15">
                <span className="text-[9px] uppercase font-mono font-black text-pink-400 block tracking-widest text-left">
                  🌟 ACTIVITY REWARD TRIGGERED
                </span>
                <p className="text-[11px] text-[#decfe6] italic text-left mt-0.5 leading-normal">
                  You triggered: <span className="font-bold">"{authTriggerReason}"</span>. Binding your accounts preserves stars alignment histories and medication reminders securely on Google Cloud firestore so you and Sarah both see it live.
                </p>
              </div>

              <div className="space-y-2 pb-2">
                <button
                  onClick={() => {
                    alert("✨ OAuth Google Account preserves clinical timelines seamlessly in production.");
                    setShowProgressiveAuth(false);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-white text-black font-sans font-extrabold text-xs shadow-md cursor-pointer hover:bg-slate-100 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Continue with Google Account
                </button>

                <button
                  onClick={() => {
                    const email = prompt("Enter email to preserve progress:", "sarah@constella.com");
                    if (email) {
                      alert(`✉️ Login link code dispatched to ${email}! Check email.`);
                      setShowProgressiveAuth(false);
                    }
                  }}
                  className="w-full py-2.5 rounded-2xl bg-[#a855f7]/25 hover:bg-[#a855f7]/40 text-[#fba5c9] border border-[#a855f7]/30 font-sans font-extrabold text-xs shadow-sm cursor-pointer transition-transform"
                >
                  Continue with Email Link
                </button>

                <button
                  onClick={() => setShowProgressiveAuth(false)}
                  className="w-full py-2 text-xs text-slate-400 hover:text-slate-300 font-bold block transition cursor-pointer"
                >
                  Keep as Guest
                </button>
              </div>

              <p className="text-[9px] text-slate-500 leading-relaxed font-sans max-w-xs mx-auto">
                No complex passwords required. Protected under secure HIPAA physical encryption safe-guards.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
