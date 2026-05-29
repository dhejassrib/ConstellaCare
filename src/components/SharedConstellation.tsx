import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star, Heart, Sparkles, Send, HelpCircle, Calendar, ArrowRight,
  ShieldCheck, RefreshCw, MessageSquare, AlertCircle, Award, CheckCircle2,
  Share2, Zap, LayoutGrid, Radio, Plus, Trash
} from 'lucide-react';

interface SharedConstellationProps {
  theme: 'light' | 'dark';
  role: 'patient' | 'caregiver';
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

export default function SharedConstellation({ theme, role, onNavigateHome }: SharedConstellationProps) {
  // Shared Live Constellation States (with localStorage syncing)
  const [messageStars, setMessageStars] = useState<MessageStar[]>(() => {
    const cached = localStorage.getItem('shared-message-stars');
    if (cached) return JSON.parse(cached);
    return [
      { id: '1', sender: 'caregiver', message: 'Thinking of you before treatment cycle today, you are my absolute light 💜', senderName: 'Caregiver (Mom)', timestamp: '9:30 AM', x: 25, y: 30 },
      { id: '2', sender: 'patient', message: 'Completed my cozy bubble breathing session! Felt very warm.', senderName: 'Patient (Sarah)', timestamp: '11:15 AM', x: 75, y: 40 },
      { id: '3', sender: 'caregiver', message: 'I packed your organic ginger teas and wool socks for tomorrow.', senderName: 'Caregiver (Mom)', timestamp: '1:05 PM', x: 45, y: 70 },
    ];
  });

  const [milestones, setMilestones] = useState<SharedMilestone[]>(() => {
    const cached = localStorage.getItem('shared-milestones');
    if (cached) return JSON.parse(cached);
    return [
      { id: '1', title: 'Finished Treatment Cycle #1', date: 'May 20, 2026', category: 'milestone', notes: 'Walked through oncologist review together.', createdBy: 'Oncology Lead' },
      { id: '2', title: 'First Deep Calm Breathing Logged', date: 'May 24, 2026', category: 'activity', notes: 'Sarah breathed for 5 full cycles smoothly.', createdBy: 'Sarah' },
      { id: '3', title: 'Hermitage Support Network Set Up', date: 'May 25, 2026', category: 'support', notes: 'Mom & Sister aligned tasks scheduler.', createdBy: 'Mom' },
    ];
  });

  const [supportRequested, setSupportRequested] = useState<boolean>(() => {
    return localStorage.getItem('shared-support-request') === 'true';
  });

  const [supportMessage, setSupportMessage] = useState<string>(() => {
    return localStorage.getItem('shared-support-msg') || 'Needs extra care environment today.';
  });

  // shooting stars trigger state
  const [shootingStars, setShootingStars] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [lightCount, setLightCount] = useState<number>(() => {
    const cached = localStorage.getItem('shared-light-count');
    return cached ? parseInt(cached) : 42;
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
    if (lightCount >= 42) {
      triggerProgressiveAuth("Light Up Each Other Spark");
    }
  };

  // Helper to summon Progressive Sign-Up Modal
  const triggerProgressiveAuth = (reason: string) => {
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
      x: Math.floor(Math.random() * 70) + 15,
      y: Math.floor(Math.random() * 70) + 15
    };

    setMessageStars(prev => [...prev, newStar]);
    
    // Add an automated milestone of connection
    const newMs: SharedMilestone = {
      id: Math.random().toString(),
      title: `${newStar.senderName} posted a Message Star`,
      date: 'Just Now',
      category: 'encouragement',
      notes: `"${newStar.message.slice(0, 45)}..."`,
      createdBy: newStar.senderName
    };
    setMilestones(prev => [newMs, ...prev]);

    setNewMessage('');

    // Trigger progressive auth trigger after sending a communication star!
    setTimeout(() => {
      triggerProgressiveAuth("Exchanging Connection Message Star");
    }, 800);
  };

  const handleToggleSupportRequest = () => {
    if (supportRequested) {
      setSupportRequested(false);
      localStorage.setItem('shared-support-request', 'false');
    } else {
      const note = customSupportNote.trim() || "Sarah is feeling slightly foggy and needs extra gentle presence.";
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

      // Auto trigger auth prompt
      setTimeout(() => {
        triggerProgressiveAuth("Ignited Shared Constellation Beacon");
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
      notes: newMilestoneNotes || 'Committed to our collective therapeutic memory sky.',
      createdBy: role === 'patient' ? 'Patient (Sarah)' : 'Caregiver (Mom)'
    };

    setMilestones(prev => [newMs, ...prev]);
    setNewMilestoneTitle('');
    setNewMilestoneNotes('');

    setTimeout(() => {
      triggerProgressiveAuth("Added Milestone Memory Key");
    }, 800);
  };

  const removeMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const clearSupportBeacon = () => {
    setSupportRequested(false);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 font-sans ${theme === 'dark' ? 'bg-[#06030c] text-[#f7f2eb]' : 'bg-[#FAF7FC] text-[#1c1135]'}`}>
      
      {/* Space gradient backdrop visual overlays */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#a855f7]/10 via-[#ec4899]/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#6366f1]/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.03),transparent)]" />
      </div>

      {/* 🔮 TOP HERO SECTION */}
      <div className="relative z-10 px-6 md:px-10 pt-8 pb-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-base shadow-lg ring-4 ring-purple-500/10 animate-pulse">
                ✨
              </span>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-pink-500 block">Mutual Copresence</span>
                <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent italic tracking-tight">
                  ✨ Shared Constellation Link
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateHome}
                className="px-4 py-2 text-xs font-bold rounded-xl border bg-[#06030c]/30 text-purple-400 border-purple-500/20 hover:border-purple-500/50 cursor-pointer transition-all"
              >
                ← Back to individual Dashboard
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-slate-950/60 dark:bg-[#110c24]/95 border border-purple-500/20 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 blur-3xl rounded-full" />
            <div className="relative z-10 max-w-xl mx-auto space-y-2">
              <span className="bg-purple-950/50 border border-purple-400/30 text-purple-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                💞 Emotional co-care link active
              </span>
              <h2 className="text-xl md:text-2xl font-black text-rose-100 italic tracking-tight">
                "Two stars navigating the same night sky."
              </h2>
              <p className="text-xs text-slate-350 leading-relaxed">
                Most health platforms monitor symptoms as data. ConstellaCare maps the soft lines connecting you.
                Every encouraging note, shared task, and lighted star keeps the mutual sky glowing.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* BEACON COMPONENT: If Support beacon is lit from patient, show banner */}
      {supportRequested && (
        <div className="px-6 md:px-10 py-1.5 relative z-10 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-[#110c24] border border-red-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-pulse">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">ACTIVE SUPPORT BEACON DECLARED</span>
                <p className="text-xs font-bold text-rose-100 mt-0.5">
                  Sarah requested gentle emotional shelter: <span className="italic font-normal">"{supportMessage}"</span>
                </p>
              </div>
            </div>

            {role === 'caregiver' ? (
              <button
                onClick={() => {
                  triggerSendLight();
                  alert("✨ You sent Sarah a calming cosmic light wave of support immediately.");
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-sans text-[11px] font-bold shadow hover:bg-rose-600 cursor-pointer transition-all flex items-center gap-1"
              >
                <Heart className="w-3.5 h-3.5 fill-white" /> Respond with Love
              </button>
            ) : (
              <button
                onClick={clearSupportBeacon}
                className="px-3 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold"
              >
                Clear beacon
              </button>
            )}
          </div>
        </div>
      )}

      {/* 🌌 THREE COLUMN COLLABORATIVE GRID */}
      <div className="relative z-10 px-6 md:px-10 pb-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">

        {/* ============================================== */}
        {/* LEFT COLUMN: SHARED JOURNEY & MILESTONES (4 cols) */}
        {/* ============================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-[#110c24]/90 border border-slate-100 dark:border-purple-500/20 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-500/10 pb-3 mb-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-1.5 text-left">
                  <CheckCircle2 className="w-4 h-4" /> Shared Journey Log
                </h3>
                <span className="text-[9px] text-slate-400 mt-0.5 block text-left">Synched mutual milestone timeline</span>
              </div>
              <Award className="w-4.5 h-4.5 text-amber-500" />
            </div>

            {/* List of active accomplishments */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {milestones.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-8">No shared memories aligned yet.</p>
              ) : (
                milestones.map((ms) => (
                  <div 
                    key={ms.id} 
                    className="p-3 bg-slate-50 dark:bg-[#070512] rounded-2xl border border-slate-100 dark:border-purple-500/10 hover:border-purple-500/30 transition-all text-left relative group font-sans"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        ms.category === 'support' ? 'bg-rose-500/10 text-rose-450 border border-rose-500/20' :
                        ms.category === 'activity' ? 'bg-emerald-500/10 text-emerald-405 border border-emerald-500/20' :
                        'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      }`}>
                        {ms.category}
                      </span>
                      <span className="text-[8px] font-mono text-slate-400">{ms.date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 dark:text-[#f4d4a8] mt-1 leading-tight">{ms.title}</h4>
                    <p className="text-[11px] text-slate-550 dark:text-slate-350 italic mt-0.5">"{ms.notes}"</p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-slate-100 dark:border-purple-500/5 text-[9px] text-slate-400">
                      <span>Aligned by: <b>{ms.createdBy}</b></span>
                      <button
                        onClick={() => removeMilestone(ms.id)}
                        className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition"
                        title="Remove milestone"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Sync Save Cloud call to action */}
            <div className="mt-4 pt-3 border-t border-purple-500/10 text-center">
              <button
                onClick={() => triggerProgressiveAuth("Synched Multi-User Backup Core")}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/20 text-purple-300 text-xs font-bold cursor-pointer transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Force Constellation Backup
              </button>
            </div>
          </div>

        </div>

        {/* ============================================== */}
        {/* CENTER COLUMN: LIVE CONSTELLATION TWIN MAP (5 cols) */}
        {/* ============================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#110c24] border border-purple-500/20 rounded-3.5xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between h-[510px]">
            {/* Background space particle atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
              <div className="absolute inset-10 border border-dashed border-purple-500/10 rounded-full animate-spin duration-[40s]" />
              <div className="absolute inset-28 border border-dashed border-pink-500/10 rounded-full animate-spin duration-[24s]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-purple-500/5 blur-2xl" />
            </div>

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5 text-left">
                  <Radio className="w-4 h-4 text-pink-400 animate-pulse" /> Live Constellation Grid
                </h3>
                <span className="text-[10px] text-purple-300/80 block text-left">Two stars orbiting, mutual memory nodes lit</span>
              </div>
              <div className="bg-[#070512] border border-purple-500/20 rounded-lg px-2.5 py-1 font-mono text-[10px] text-purple-300">
                ⭐ {messageStars.length} Stars aligned
              </div>
            </div>

            {/* Interactive map zone with visual orbiting twins */}
            <div className="relative w-full h-[320px] bg-slate-950/40 rounded-2xl border border-purple-500/5 overflow-hidden my-4 z-10 flex items-center justify-center">
              
              {/* Orb filaments/strings between nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                {/* Connecting lines between orbiting twins */}
                <line x1="30%" y1="50%" x2="70%" y2="50%" stroke="url(#line-glow)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                
                {/* Visual connectors to message stars */}
                {messageStars.map((ms, idx) => (
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

              {/* Patient Central Node - Orbiting Left */}
              <div className="absolute left-[20%] top-[40%] text-center z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-pink-500/30 ring-4 ring-pink-500/20 animate-pulse">
                  Sarah
                </div>
                <span className="text-[9px] font-mono text-pink-300 block mt-1.5">● Sarah's Star</span>
              </div>

              {/* Caregiver Central Node - Orbiting Right */}
              <div className="absolute right-[20%] top-[40%] text-center z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-450 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-550/30 ring-4 ring-purple-550/20 animate-pulse" style={{ animationDelay: '1s' }}>
                  Mom
                </div>
                <span className="text-[9px] font-mono text-purple-300 block mt-1.5">● Care Core</span>
              </div>

              {/* Dynamic message stars positions */}
              {messageStars.map((star) => (
                <div
                  key={star.id}
                  className="absolute cursor-pointer group"
                  style={{ left: `${star.x}%`, top: `${star.y}%` }}
                  title={`${star.senderName}: "${star.message}"`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#FAF8FD] flex items-center justify-center shadow-md ring-4 ring-purple-500/10 hover:scale-[1.3] transition-all">
                    <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300 animate-pulse" />
                  </div>

                  {/* Hover notes capsule */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#0c081d] border border-purple-500/40 text-[9px] text-[#decfe6] rounded-xl p-2.5 w-40 z-30 pointer-events-none transition-opacity duration-250 shadow-xl leading-relaxed">
                    <b className="block text-pink-400">{star.senderName}</b>
                    <p className="mt-0.5 italic">"{star.message}"</p>
                    <span className="block text-slate-500 text-[8px] text-right mt-1 font-mono">{star.timestamp}</span>
                  </div>
                </div>
              ))}

              {/* Sending Light Animated Particles */}
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

            {/* Micro Connection status indicators button */}
            <div className="relative z-10 flex items-center justify-between bg-[#070512]/90 border border-purple-500/15 p-3 rounded-2xl text-[10px] text-purple-305">
              <span>💖 Active light exchanges: <b>{lightCount} times</b></span>
              <button
                onClick={triggerSendLight}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold tracking-tight hover:scale-102 hover:shadow-lg hover:shadow-purple-500/15 cursor-pointer transition-transform flex items-center gap-1 font-sans text-[11px]"
              >
                <Zap className="w-3 h-3 fill-white" /> Send Light Star!
              </button>
            </div>
          </div>

        </div>

        {/* ============================================== */}
        {/* RIGHT COLUMN: ACTION CONTROLS CENTER (3 cols)  */}
        {/* ============================================== */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* ACTION SET 1: Send Message Star */}
          <div className="bg-white dark:bg-[#110c24]/90 border border-slate-100 dark:border-purple-500/20 rounded-3xl p-5 shadow-lg">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#a855f7] flex items-center gap-1.5 text-left border-b border-purple-500/10 pb-2 mb-3">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Cast Message Star
            </h3>
            <p className="text-[10px] text-slate-400 text-left leading-relaxed mb-4">
              Write a gentle message. It will solidify as a glowing star on Sarah's constellation map instantly.
            </p>

            <form onSubmit={handleSendMessageStar} className="space-y-3">
              <textarea
                placeholder="Write a sweet reminder or care update..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                maxLength={90}
                className="w-full text-xs p-3 h-20 rounded-2xl border bg-transparent font-sans text-slate-700 dark:text-slate-100 border-slate-200 dark:border-purple-500/20 focus:outline-none focus:border-pink-500"
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

          {/* ACTION SET 2: Send Support Beacon */}
          {role === 'patient' && (
            <div className="bg-gradient-to-tr from-rose-500/15 via-[#110c24]/10 to-[#110c24] border border-rose-500/25 rounded-3xl p-5 shadow-lg text-left">
              <h3 className="text-xs font-black uppercase tracking-widest text-rose-400 flex items-center gap-1.5 border-b border-rose-500/10 pb-2 mb-3">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> Support Beacon
              </h3>
              <p className="text-[10px] text-slate-350 leading-relaxed mb-3">
                Feeling overwhelmed or need cozy physical help right now? Tap to alert Mom immediately.
              </p>
              
              <div className="space-y-2.5">
                <input
                  type="text"
                  placeholder="Need herbal drops / holding hand..."
                  value={customSupportNote}
                  onChange={(e) => setCustomSupportNote(e.target.value)}
                  className="w-full text-[10px] px-3 py-2 border rounded-xl bg-transparent border-purple-500/20 text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                
                <button
                  onClick={handleToggleSupportRequest}
                  className={`w-full py-2.5 rounded-xl font-bold font-sans text-xs flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer ${
                    supportRequested 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-rose-550/15 hover:bg-rose-550/25 border border-rose-500/30 text-rose-405'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {supportRequested ? 'Snuff Support Beacon' : 'Ignite Support Beacon'}
                </button>
              </div>
            </div>
          )}

          {/* ACTION SET 3: Add Shared Milestone */}
          <div className="bg-white dark:bg-[#110c24]/90 border border-slate-100 dark:border-purple-500/20 rounded-3xl p-5 shadow-lg text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#a855f7] flex items-center gap-1.5 border-b border-purple-500/10 pb-2 mb-3">
              <Calendar className="w-4 h-4" /> Add Shared Milestone
            </h3>
            
            <form onSubmit={handleAddMilestone} className="space-y-3">
              <input
                type="text"
                placeholder="E.g. Finished pre-chemo review"
                value={newMilestoneTitle}
                onChange={e => setNewMilestoneTitle(e.target.value)}
                required
                className="w-full text-[11px] px-3 py-2 border rounded-xl bg-transparent font-sans text-slate-700 dark:text-slate-100 border-slate-200 dark:border-purple-500/20 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="E.g. Copied dermatologist prompt sheets"
                value={newMilestoneNotes}
                onChange={e => setNewMilestoneNotes(e.target.value)}
                className="w-full text-[11px] px-3 py-2 border rounded-xl bg-transparent font-sans text-slate-700 dark:text-slate-100 border-slate-200 dark:border-purple-500/20 focus:outline-none focus:border-purple-500"
              />
              
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-sans text-xs font-bold rounded-xl shadow cursor-pointer hover:opacity-90 active:scale-[0.99] transition"
              >
                + Commit to Sky Timeline
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 🌌 REWARD-DRIVEN PROGRESSIVE ACCOUNT REGISTRATION MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showProgressiveAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProgressiveAuth(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal dialog box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-md bg-[#130d2a] border border-purple-500/35 overflow-hidden rounded-3xl p-6.5 text-center shadow-2xl z-10"
            >
              {/* Outer decorative stars */}
              <div className="absolute top-3 left-4 w-12 h-12 bg-pink-500/10 blur-xl rounded-full" />
              <div className="absolute bottom-3 right-4 w-12 h-12 bg-purple-500/10 blur-xl rounded-full" />

              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white text-xl mx-auto mb-4 animate-bounce">
                ✨
              </div>

              <h3 className="text-base font-black text-slate-100 italic">
                Save your constellation journey and emotional progress across devices!
              </h3>
              
              <div className="p-3 my-3.5 bg-purple-950/40 rounded-2xl border border-purple-500/15">
                <span className="text-[9px] uppercase font-mono font-black text-pink-400 block tracking-widest text-left">
                  🌟 ACTIVITY REWARD EARNED
                </span>
                <p className="text-[11px] text-purple-300 italic text-left mt-0.5">
                  You just triggered: <span className="font-bold">"{authTriggerReason}"</span>. Linking your accounts ensures you and your loved caregiver never lose aligned stars, journals, or medication sheets.
                </p>
              </div>

              <div className="space-y-2 pb-2">
                <button
                  onClick={() => {
                    alert("✨ Seamless OAuth sequence requested! In production, this anchors a Google Workspace Google Account context effortlessly.");
                    setShowProgressiveAuth(false);
                  }}
                  className="w-full py-3 rounded-2xl bg-white text-black font-sans font-extrabold text-xs shadow-md cursor-pointer hover:bg-slate-100 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => {
                    const email = prompt("Enter email to preserve progress:", "sarah@constella.com");
                    if (email) {
                      alert(`📩 Magic login linkage code dispatched to ${email}! Check inbox.`);
                      setShowProgressiveAuth(false);
                    }
                  }}
                  className="w-full py-3 rounded-2xl bg-[#a855f7]/25 hover:bg-[#a855f7]/40 text-[#fba5c9] border border-[#a855f7]/30 font-sans font-extrabold text-xs shadow-sm cursor-pointer transition-transform"
                >
                  Continue with Email
                </button>

                <button
                  onClick={() => setShowProgressiveAuth(false)}
                  className="w-full py-2.5 text-xs text-slate-450 hover:text-slate-300 font-bold block transition"
                >
                  Continue as Guest
                </button>
              </div>

              <p className="text-[9px] text-slate-500 leading-relaxed font-sans max-w-xs mx-auto">
                No passwords required. By continuing, you agree to secure HIPAA physical safeguards and medical privacy parameters.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
