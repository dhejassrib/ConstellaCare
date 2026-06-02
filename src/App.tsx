// app.tsx:
import { useState, useEffect, useRef } from 'react';
import Landing from './Landing';
import { 
  NAV_GROUPS, 
  REFLECTIONS, 
  PATIENT_EMOTION_CARDS, 
  PATIENT_AI_RESPONSES, 
  MESSAGE_BOTTLES,
  INITIAL_MILESTONES 
} from './data';
import { Section, ConstellationStar, ChatMessage, JournalEntry } from './types';

// Import modular subcomponents
import LivingConstellation from './components/LivingConstellation';
import AstraInsights from './components/AstraInsights';
import SymptomTracker from './components/SymptomTracker';
import CareCircle from './components/CareCircle';
import VoiceJournal from './components/VoiceJournal';
import AppointmentCopilot from './components/AppointmentCopilot';
import BubbleBreathing from './components/BubbleBreathing';
import FacialEmotionDetection from './components/FacialEmotionDetection';
import EmotionCards from './components/EmotionCards';
import EmotionalTrendTracking from './components/EmotionalTrendTracking';
import Reports from './components/Reports';
import Resources from './components/Resources';
import CaregiverDashboard from './components/CaregiverDashboard';
import SharedConstellation from './components/SharedConstellation';
import ProgressiveAuthModal from './components/ProgressiveAuthModal';

// Lucide Icons
import {
  Sun, Moon, Star, MessageSquare, Heart, Sparkles, Navigation, CheckCircle,
  ChevronRight, Compass, ShieldAlert, Award, FileText, Send, HelpCircle, X,
  Activity, Battery, Plus, Trash, Lock, Calendar, Users, Mic, Volume2, Clock,
  ArrowRight, ShieldCheck, RefreshCw, Wind, Pill, FileBarChart, Mail, Trophy, BookOpen, Zap
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'patient' | 'caregiver'>('landing');
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [quickSupportOpen, setQuickSupportOpen] = useState(false);

  // Core Constellation Trackers
  const [totalStars, setTotalStars] = useState(8);
  const [stars, setStars] = useState<ConstellationStar[]>([
    { id: '1', x: 20, y: 15, label: 'Diagnosis Acceptance Check-In', category: 'mood', timestamp: 'May 16, 2026', brightness: 0.8 },
    { id: '2', x: 45, y: 35, label: 'Chemo Infusion Prep Session', category: 'appointment', timestamp: 'May 20, 2026', brightness: 0.9 },
    { id: '3', x: 75, y: 25, label: 'Symptom Severity Alignment', category: 'symptom', timestamp: 'May 21, 2026', brightness: 0.75 },
    { id: '4', x: 85, y: 65, label: 'Evening Calm Breathing Circle', category: 'calm', timestamp: 'May 24, 2026', brightness: 0.85 },
    { id: '5', x: 30, y: 75, label: 'Mom Joined Constellation Circle', category: 'journal', timestamp: 'May 25, 2026', brightness: 0.8 },
    { id: '6', x: 60, y: 80, label: 'First Written Journal Entry', category: 'journal', timestamp: 'May 26, 2026', brightness: 0.7 },
    { id: '7', x: 10, y: 55, label: 'Consultation Questions Copied', category: 'appointment', timestamp: 'May 28, 2026', brightness: 0.9 },
    { id: '8', x: 40, y: 50, label: 'Somatic Chest Release Release', category: 'calm', timestamp: 'May 29, 2026', brightness: 0.88 },
  ]);

  // Last action tracking to update Astra Insights dynamically
  const [lastAction, setLastAction] = useState<string>('Saved physical nausea log');
  const [symptomLog, setSymptomLog] = useState<Record<string, number>>({
    Fatigue: 3, Nausea: 2, Pain: 1, Anxiety: 3, 'Appetite loss': 2, 'Sleep issues': 2
  });

  // Progressive Login / Auth Modal
  const [progressiveAuthOpen, setProgressiveAuthOpen] = useState(false);
  const [progressiveAuthReason, setProgressiveAuthReason] = useState("");

  // Real or Simulated Authenticated Session Client State
  const [user, setUser] = useState<{ email: string; displayName: string } | null>(() => {
    try {
      const cached = localStorage.getItem('constella_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const handleAuthSuccess = (email: string, displayName: string) => {
    const newUser = { email, displayName };
    setUser(newUser);
    localStorage.setItem('constella_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('constella_user');
  };

  const [milestonesTriggered, setMilestonesTriggered] = useState<Record<string, boolean>>(() => {
    try {
      const cached = localStorage.getItem('patient-milestones-auth-triggers');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const triggerMilestoneAuth = (reason: string, triggerKey: string) => {
    if (milestonesTriggered[triggerKey]) return;
    const next = { ...milestonesTriggered, [triggerKey]: true };
    setMilestonesTriggered(next);
    localStorage.setItem('patient-milestones-auth-triggers', JSON.stringify(next));
    setProgressiveAuthReason(reason);
    setProgressiveAuthOpen(true);
  };

  // Message Bottles Unlocks
  const [bottleIndex, setBottleIndex] = useState<number | null>(null);
  const [unlockedBottles, setUnlockedBottles] = useState(0);

  // Reflection Journaling logs
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [reflectionHistory, setReflectionHistory] = useState<JournalEntry[]>([]);

  // Astra Chat Dialog logs
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', sender: 'astra', text: "Hello, Sarah. I am Astra, your empathetic cosmic companion. There are no expectations or wrong coordinates here. What is rising inside your heart today?", timestamp: '2:30 PM' }
  ]);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Timeline list state
  const [timelineItems, setTimelineItems] = useState(INITIAL_MILESTONES);

  // Dynamic theme selector effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Scroll chat window to base
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // Observer to trigger progressive auth on Care Circle open
  useEffect(() => {
    if (activeSection === 'circle') {
      setTimeout(() => {
        triggerMilestoneAuth("Enrolling Co-Regulating Care Circle", "care_circle");
      }, 1000);
    }
  }, [activeSection]);

  // Star Accretion engine (illuminates a node on mapping coordinates)
  const addStar = (label: string, category: 'mood' | 'calm' | 'journal' | 'appointment' | 'symptom') => {
    const newStar: ConstellationStar = {
      id: Math.random().toString(),
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      label,
      category,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      brightness: 0.85
    };
    setStars(prev => [...prev, newStar]);
    setTotalStars(prev => {
      const nextTotal = prev + 1;
      setTimeout(() => {
        triggerMilestoneAuth("Constellation Sky Star Earned", "first_star");
      }, 1000);
      return nextTotal;
    });
  };

  // Chat request dispatch
  const handleSendChat = async (promptOverride?: string) => {
    const activeText = promptOverride || chatPrompt;
    if (!activeText.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: activeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, userMsg]);
    if (!promptOverride) setChatPrompt('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/astra/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activeText,
          history: chatHistory.map(h => ({ sender: h.sender, text: h.text }))
        })
      });
      if (response.ok) {
        const data = await response.json();
        const astraMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'astra',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, astraMsg]);
        addStar("Consulted Astra AI Alignment", "journal");
        setLastAction("Consulted Astra Companion");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  // Open Message Bottles
  const unlockBottle = () => {
    const nextIdx = (bottleIndex ?? -1) + 1;
    if (nextIdx < MESSAGE_BOTTLES.length) {
      setBottleIndex(nextIdx);
      setUnlockedBottles(nextIdx + 1);
      addStar("Opened Hope Message Bottle", "journal");
      setLastAction("Opened therapeutic bottle");
      const currentUnlocked = nextIdx + 1;
      setTimeout(() => {
        if (currentUnlocked >= 3) {
          triggerMilestoneAuth("Unlocked 3 Hope Message Bottles", "message_bottles_3");
        } else {
          triggerMilestoneAuth("Opened Cosmic Hope Bottle", "message_bottle");
        }
      }, 1200);
    }
  };

  // Complete Reflection
  const handleSaveReflection = () => {
    if (!reflectionAnswer.trim()) return;
    const newEntry: JournalEntry = {
      id: Math.random().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      prompt: REFLECTIONS[reflectionIndex],
      text: reflectionAnswer
    };
    setReflectionHistory(prev => [newEntry, ...prev]);
    addStar("Logged Written Reflection Archive", "journal");
    setLastAction("Logged written reflection");
    setReflectionAnswer('');
    setReflectionIndex(i => (i + 1) % REFLECTIONS.length);
    setTimeout(() => {
      triggerMilestoneAuth("Saved Private Emotional Reflection", "first_reflection");
    }, 1200);
  };

  const getSectionTitle = () => {
    return NAV_GROUPS.flatMap(g => g.items).find(i => i.id === activeSection)?.label ?? 'Dashboard';
  };

  if (view === 'landing') {
    return (
      <Landing 
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onNavigate={(path) => {
          if (path === '/patient') {
            setView('patient');
          } else if (path === '/caregiver') {
            setView('caregiver');
          }
        }} 
      />
    );
  }

  if (view === 'caregiver') {
    return (
      <>
        <CaregiverDashboard
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          user={user}
          onAuthTrigger={() => {
            setProgressiveAuthReason("Encrypting & backing up Caregiver logs");
            setProgressiveAuthOpen(true);
          }}
          onLogout={handleLogout}
          onNavigate={(path) => {
            if (path === '/') {
              setView('landing');
            }
          }}
        />
        <ProgressiveAuthModal
          isOpen={progressiveAuthOpen}
          onClose={() => setProgressiveAuthOpen(false)}
          reason={progressiveAuthReason}
          theme={theme}
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <div className={`flex min-h-screen transition-all duration-500 font-sans ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#FAF8FD] text-[#1e133a]'}`}>
      
      {/* 🔮 Background floating space specs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-500/10 via-teal-500/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
      </div>

      {/* ── Sidebar Navigation ── */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 border-r backdrop-blur-md w-64 z-40 flex flex-col justify-between transition-all duration-300 transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } ${theme === 'dark' ? 'bg-slate-900 border-[#6366f1]/10' : 'bg-[#FAF8FD]/95 border-[#7e6c9e]/20'}`}
      >
        {/* ── CHANGED: wrapped in flex-col with min-h-0 so nav can scroll ── */}
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand header */}
          <div className={`flex items-center justify-between px-6 py-5 border-b flex-shrink-0 ${theme === 'dark' ? 'border-[#6366f1]/10' : 'border-[#7e6c9e]/20'}`}>
            <div 
              onClick={() => setView('landing')} 
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Return to Landing Page"
            >
              <span className="w-8 h-8 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white text-lg font-black shadow-lg animate-pulse">C</span>
              <span className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent italic tracking-tight group-hover:opacity-85">
                ConstellaCare
              </span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className={`md:hidden p-1 rounded-full ${theme === 'dark' ? 'hover:bg-slate-850 text-slate-400' : 'hover:bg-purple-100/60 text-[#7e6c9e]'}`}
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* ── CHANGED: added overflow-y-auto flex-1 so this scrolls ── */}
          <nav className="p-4 space-y-6 overflow-y-auto flex-1">
            {NAV_GROUPS.map((group) => (
              <div key={group.group} className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#a855f7] block pl-2 mb-2">
                  {group.group}
                </span>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-3 py-2 rounded-xl text-xs font-bold leading-none capitalize transition-all duration-200 cursor-pointer ${
                      activeSection === item.id
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-[#211738] to-[#120d21] text-[#f4d4a8] border border-[#c9a0dc]/20'
                          : 'bg-gradient-to-r from-[#decfe6] to-[#e8e2f4] text-[#1a1530] border border-[#c9a0dc]/20'
                        : theme === 'dark'
                          ? 'bg-transparent text-[#9b8ab8] hover:bg-[#1c1530]/50 font-semibold'
                          : 'bg-transparent text-[#4d3c69] hover:bg-purple-100/60'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* ── CHANGED: added flex-shrink-0 so stars counter stays pinned at bottom ── */}
        <div className={`p-6 border-t flex-shrink-0 ${theme === 'dark' ? 'border-[#6366f1]/10' : 'border-[#7e6c9e]/20'}`}>
          <div className="bg-gradient-to-tr from-slate-950 to-slate-850 text-slate-100 rounded-2xl p-4 border border-purple-500/15 text-center relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 blur-xl rounded-full" />
            <Award className="w-7 h-7 text-amber-500 dark:text-amber-400 mx-auto animate-pulse" />
            <span className="text-[10px] text-purple-400 block font-mono font-bold tracking-widest mt-1">STAR ENERGY INDEX</span>
            <span className="text-2xl font-black mt-1 block text-[#5b4a7a] dark:text-[#d4af37]">{totalStars} ✨</span>
            <p className="text-[10px] text-slate-350 mt-1.5 leading-relaxed">
              Every mindful check-in lights a new star. Watch your sky align.
            </p>
          </div>
        </div>
      </aside>

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[#1e133a]/30 dark:bg-slate-950/40 backdrop-blur-xs z-30 md:hidden transition-all"
        />
      )}

      {/* ── Main Dashboard Panel Area ── */}
      <main className="flex-1 md:pl-64 min-h-screen flex flex-col z-10 relative">
        
        {/* Interactive Topbar */}
        <header className="sticky top-0 bg-[#FAF8FD]/85 dark:bg-slate-900/80 backdrop-blur-md py-4 px-6 md:px-10 flex items-center justify-between border-b border-purple-200/50 dark:border-[#6366f1]/10 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 bg-purple-100/30 dark:bg-slate-850 rounded-xl cursor-pointer"
            >
              <Compass className="w-5 h-5 text-purple-650 dark:text-purple-400" />
            </button>
            <h1 className="text-lg font-black bg-gradient-to-r from-[#1e133a] to-[#4d3c69] dark:from-slate-100 dark:to-slate-350 bg-clip-text text-transparent">
              {getSectionTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Cloud Sync Backup Status Indicator */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden leading-none sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Sync Active
                </span>
                
                {/* Profile avatar button with click-to-logout functionality */}
                <div className="relative group">
                  <button
                    onClick={handleLogout}
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
                onClick={() => {
                  setProgressiveAuthReason("Enrolling encrypted cloud sync coordinates");
                  setProgressiveAuthOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#d4798e] via-[#9c82ba] to-[#decfe6] text-white hover:scale-101 active:scale-99 transition-all shadow-md cursor-pointer border border-[#c9a0dc]/20"
              >
                <span>Backup Progress ☁️</span>
              </button>
            )}

            {/* Stars counter on header right */}
            {/* <div className="flex items-center gap-1.5 bg-purple-100/50 dark:bg-[#1a0e30]/40 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-bold text-purple-650 dark:text-purple-400">
              <Star className="w-3.5 h-3.5 fill-purple-600 dark:fill-purple-500 animate-pulse" />
              <span>{totalStars} Stars</span>
            </div> */}
            <div className={`flex items-center gap-1.5 bg-gradient-to-r from-[#d4798e]/10 to-[#9c82ba]/10 border border-[#d4798e]/35 px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'text-[#f4d4a8]' : 'text-[#d4798e]'}`}>
              <Star className="w-3.5 h-3.5 fill-[#d4798e] text-[#d4798e] animate-pulse" />
              <span>{totalStars} stars aligned</span>
            </div>

            {/* Light / Dark selector utility */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 bg-purple-100/40 dark:bg-slate-850 hover:bg-purple-100 hover:text-purple-750 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-400 rounded-xl transition cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>
          </div>
        </header>

        {/* ── Main Content Compartment ── */}
        <div className="flex-1 p-6 md:p-10 max-w-5xl w-full mx-auto space-y-8 pb-32">
          
          {/*  DASHBOARD HOME SECTION ✨ */}
          {activeSection === 'home' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* TOP AREA: ✨ Dynamic Greeting Hero */}
              <div className={`relative overflow-hidden rounded-3xl p-7 md:p-9 shadow-xl border ${theme === 'dark' ? 'bg-gradient-to-tr from-purple-100/50 via-pink-100/10 to-slate-950 text-slate-100 border-purple-500/20' : 'bg-gradient-to-tr from-[#decfe6]/40 via-[#e8e2f4]/20 to-white text-[#1e133a] border-purple-200'}`}>
                {/* Immersive space dust flow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                  <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl animate-pulse duration-[10s]" />
                  <div className="absolute bottom-5 left-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl animate-pulse duration-[7s]" />
                </div>

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
                      {user
                        ? `Good evening, ${user.displayName.split(' ')[0]} ✨`
                        // : 'Good evening, Sarah ✨'}
                        : 'Good evening ✨'}
                    </h2>

                    <p className="text-xs text-slate-350 max-w-md mt-1 leading-relaxed">
                      Your Constellation index has flared brighter this week. Let's make sure you take a slow, gentle orbit of comfort tonight.
                    </p>
                    {/* Status grid summary */}
                    <div className="mt-5 flex items-center gap-4.5 flex-wrap">
                      <div className={`border border-purple-500/10 rounded-xl py-1 px-3 ${theme === 'dark' ? 'bg-slate-850/60' : 'bg-white/70'}`}>
                        <span className={`text-[9px] uppercase font-mono tracking-wider block font-bold ${theme === 'dark' ? 'text-slate-350' : 'text-[#7e6c9e]'}`}>Resilience</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Calmer than last week</span>
                      </div>
                      <div className={`border border-purple-500/10 rounded-xl py-1 px-3 ${theme === 'dark' ? 'bg-slate-850/60' : 'bg-white/70'}`}>
                        <span className={`text-[9px] uppercase font-mono tracking-wider block font-bold ${theme === 'dark' ? 'text-slate-350' : 'text-[#7e6c9e]'}`}>Next Oncology Check</span>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Tomorrow, 2:30 PM</span>
                      </div>
                      <div className={`border border-purple-500/10 rounded-xl py-1 px-3 ${theme === 'dark' ? 'bg-slate-850/60' : 'bg-white/70'}`}>
                        <span className={`text-[9px] uppercase font-mono tracking-wider block font-bold ${theme === 'dark' ? 'text-slate-350' : 'text-[#7e6c9e]'}`}>Constellation circle</span>
                        <span className="text-xs font-bold text-pink-600 dark:text-pink-400">2 active check-ins</span>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block flex-shrink-0 animate-bounce duration-[3s]">
                    <Star className="w-16 h-16 fill-purple-400/40 text-purple-400 filter drop-shadow-[0_0_15px_#a855f7]" />
                  </div>
                </div>
              </div>

              {/* SECTION 1: LATEST LIVING CONSTELLATION OVERVIEW */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#a855f7] flex items-center gap-1.5 pl-1.5">
                    <Compass className="w-4 h-4" /> Living Constellation Orbits
                  </h4>
                  <span className="text-xs text-[#7e6c9e] dark:text-slate-400">Mouse over coordinates to view logs</span>
                </div>
                <LivingConstellation stars={stars} totalStars={totalStars} />
              </div>

              {/* RE-DIRECTION MULTI-COLUMN DESIGN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left & Middle Column (Astra Insights + Journey) */}
                <div className="lg:col-span-2 space-y-8">
                  {/* SECTION 2: ASTRA AI INSIGHTS CARD */}
                  <AstraInsights 
                    starsCount={totalStars}
                    recentSymptoms={symptomLog}
                    lastAction={lastAction}
                    onTriggerAction={(action) => {
                      if (action === 'copilot') setActiveSection('appointment');
                      else if (action === 'breath') setActiveSection('calm');
                      else if (action === 'reflection') setActiveSection('reflection');
                    }}
                  />

                  {/* SECTION 3: CALENDAR JOURNEY (Mini cards row) */}
                  <div className="space-y-3.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#a855f7] block pl-1.5">Today's Journey Activities</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      <button 
                        onClick={() => setActiveSection('mood')} 
                        className="bg-white dark:bg-slate-900 hover:border-purple-400 dark:hover:border-purple-900 border border-purple-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2 shadow-sm transition-all"
                      >
                        <span className="text-2xl animate-pulse">🌸</span>
                        <span className="text-xs font-bold text-[#0284c7]">Mood Check-In</span>
                        <span className="text-[10px] text-[#1e133a] dark:text-slate-400">Facial emotion scanner</span>
                      </button>

                      <button 
                        onClick={() => setActiveSection('calm')} 
                        className="bg-white dark:bg-slate-900 hover:border-purple-400 dark:hover:border-purple-900 border border-purple-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2 shadow-sm transition-all"
                      >
                        <span className="text-2xl animate-pulse">🫧</span>
                        {/* <span className= "text-xs font-bold text-[#1e133a] dark:text-slate-400">Calm exercises</span>
                        <span className="text-[10px] text-[#22d3ee]">Bubble expansion and calming sounds</span> */}
                        {/* colors swapped */}
                        <span className="text-xs font-bold text-[#0284c7]">
                          Calm exercises
                        </span>

                        <span className="text-[10px] text-[#1e133a] dark:text-slate-400">
                          Bubble expansion and calming sounds
                        </span>
                      </button>

                      <button 
                        onClick={() => setActiveSection('appointment')} 
                        className="bg-white dark:bg-slate-900 hover:border-purple-400 dark:hover:border-purple-900 border border-purple-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2 shadow-sm transition-all"
                      >
                        <span className="text-2xl animate-pulse">🩺</span>
                        <span className="text-xs font-bold text-[#0284c7]">Copilot 2.0</span>
                        <span className="text-[10px] text-[#1e133a] dark:text-slate-400">Articulate your concerns</span>
                      </button>

                      <button 
                        onClick={() => setActiveSection('bottles')} 
                        className="bg-white dark:bg-slate-900 hover:border-purple-400 dark:hover:border-purple-900 border border-purple-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center gap-2 shadow-sm transition-all"
                      >
                        <span className="text-2xl animate-pulse">💌</span>
                        <span className="text-xs font-bold text-[#1e133a] dark:text-slate-400">Message Bottle</span>
                        <span className="text-[10px] text-[#1e133a] dark:text-slate-400">Therapeutic messages</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column (Care Circle Orbits Preview on Home!) */}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#a855f7] block pl-1.5">Concentric Care Circle</span>
                  <div 
                    onClick={() => setActiveSection('circle')}
                    className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400/50 transition-all aspect-square lg:aspect-auto"
                  >
                    <div className="absolute inset-0 bg-radial from-violet-500/5 to-transparent blur-xl" />
                    {/* Compact version of rotating orbits preview */}
                    <div className="relative w-28 h-28 border border-dashed border-purple-300/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '40s' }}>
                      <div className="absolute top-2 left-6 w-6 h-6 rounded-full bg-pink-300 text-slate-900 font-bold text-[10px] flex items-center justify-center shadow-lg">M</div>
                      <div className="absolute bottom-4 right-2 w-6 h-6 rounded-full bg-blue-300 text-slate-900 font-bold text-[10px] flex items-center justify-center shadow-lg">E</div>
                      <div className="absolute bottom-2 left-3 w-6 h-6 rounded-full bg-purple-300 text-slate-900 font-bold text-[10px] flex items-center justify-center shadow-lg">C</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-400 to-indigo-500 text-white font-bold text-xs flex items-center justify-center ring-4 ring-purple-500/20">Me</div>
                    </div>
                    
                    <h5 className="text-xs font-bold text-[#1e133a] dark:text-slate-205 mt-4">Family Connections Active</h5>
                    <p className="text-[10px] text-[#7e6c9e] dark:text-slate-400 max-w-[150px] mt-1.5 mx-auto leading-relaxed">
                      Mom checked in today. Your sister added encouraging tea lines.
                    </p>
                  </div>
                </div>
              </div>

              {/* MAP EMOTIONAL SKY CHART */}
              {/* <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#a855f7] block pl-1.5">Emotional Weather Sky Chart</span>
                <EmotionalTrendTracking />
              </div> */}

            </div>
          )}

          {/*  TALK TO ASTRA ✨ */}
          {activeSection === 'astra' && (
            <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[520px] relative font-sans animate-fade-in">
              {/* Astra Header */}
              <div className="bg-gradient-to-tr from-slate-950 to-indigo-950 p-4.5 text-white flex items-center justify-between border-b border-slate-800 relative">
                <div className="absolute inset-0 bg-radial from-violet-600/20 to-transparent blur-md" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-500 flex items-center justify-center text-white scale-102 ring-2 ring-purple-400 animate-pulse">
                    <Sparkles className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black tracking-widest uppercase text-purple-300">ASTRA COPRESENCE</h3>
                    <p className="text-[9px] text-slate-400 font-mono">STABLE SECURE TUNNEL // ACTIVE</p>
                  </div>
                </div>
                
                <span className="text-[9px] font-mono border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold animate-pulse">
                  ● Astra Connected
                </span>
              </div>

              {/* Chat history display */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4.5 bg-[#FAF8FD]/60 dark:bg-slate-950/20">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[76%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm relative ${
                        msg.sender === 'user'
                          ? 'bg-[#1e133a] text-white dark:bg-slate-100 dark:text-slate-900 rounded-tr-none'
                          : 'bg-white dark:bg-slate-900 text-[#3d3650] dark:text-slate-300 rounded-tl-none border border-purple-100 dark:border-slate-850'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      <span className="block text-[8px] text-slate-400 text-right mt-1.5 font-mono">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl rounded-tl-none p-4 text-slate-400 flex items-center gap-2 border border-slate-100 dark:border-slate-850 font-semibold text-xs">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      <span>Astra is reading your orbit...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Suggestion prompts */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-purple-100 dark:border-slate-850 flex gap-2 overflow-x-auto">
                <button
                  onClick={() => handleSendChat("I am feeling physically exhausted after today's sessions... Guidelines?")}
                  className="px-3 py-1.5 border border-purple-200 dark:border-slate-800 text-[10px] font-bold text-[#4d3c69] dark:text-slate-400 rounded-full whitespace-nowrap hover:border-purple-400 cursor-pointer text-xs"
                >
                  "Exhausted after session"
                </button>
                <button
                  onClick={() => handleSendChat("I have minor nausea spikes during the deep night, what has worked?")}
                  className="px-3 py-1.5 border border-purple-200 dark:border-slate-800 text-[10px] font-bold text-[#4d3c69] dark:text-slate-400 rounded-full whitespace-nowrap hover:border-purple-400 cursor-pointer text-xs"
                >
                  "Night nausea adjustments"
                </button>
                <button
                  onClick={() => handleSendChat("Guide me through a quick grounding breath to help clear my racing heart.")}
                  className="px-3 py-1.5 border border-purple-200 dark:border-slate-800 text-[10px] font-bold text-[#4d3c69] dark:text-slate-400 rounded-full whitespace-nowrap hover:border-purple-400 cursor-pointer text-xs"
                >
                  " racing thoughts "
                </button>
              </div>

              {/* Chat Input panel bar */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-950/40 border-t border-purple-100 dark:border-slate-850 flex gap-2">
                <input
                  type="text"
                  placeholder="Share whatever feels right — no expectations here..."
                  value={chatPrompt}
                  onChange={e => setChatPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  className="flex-1 text-xs px-4 py-3 rounded-xl border border-purple-200 dark:border-slate-800 bg-transparent text-[#2e214c] dark:text-slate-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={() => handleSendChat()}
                  className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4 fill-white" />
                </button>
              </div>
            </div>
          )}

          {/*  MOOD CHECK-IN ── */}
          {activeSection === 'mood' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl leading-relaxed">
                <p className="text-sm text-[#4d3c69] dark:text-slate-400 leading-relaxed center">
                  Checking in with how you are feeling helps map your long-term diagnostic trends.
                  <br></br>Both biometric scans (the visual sensors) and daily emotion card selections are welcome.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-5 shadow-xl">
                  <span className="text-xs font-bold font-mono tracking-widest text-[#a855f7] uppercase block mb-4">Biometric Mood Sensor Scanner</span>
                  <FacialEmotionDetection onDetected={(rawEm) => {
                    addStar("Mapped Facial Line Alignment", "mood");
                    setLastAction(`Biometric mapped ${rawEm}`);
                  }} />
                </div>

                <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold font-mono tracking-widest text-[#a855f7] uppercase block mb-4">Daily Emotion Selector Card Set</span>
                    <EmotionCards 
                      emotions={PATIENT_EMOTION_CARDS}
                      responses={PATIENT_AI_RESPONSES}
                      onSelect={(cardId) => {
                        addStar("Selected Daily Emotion Chip", "mood");
                        setLastAction(`Logged mood: ${cardId}`);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*  CALM CORNER ── */}
          {activeSection === 'calm' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl leading-relaxed">
                <p className="text-sm text-[#4d3c69] dark:text-slate-400">
                  Mindfulness isn't a distraction; it lowers cortisol baselines allowing chemotherapy compounds to settle comfortably inside cells.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <BubbleBreathing onComplete={() => {
                  addStar("Completed Mindful Resilient Breathing", "calm");
                  setLastAction("Practiced Bubble Breathing");
                }} />

                {/* Soundtrack Corner */}
                <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                  <span className="text-xs font-bold font-mono tracking-widest text-[#a855f7] uppercase block mb-4">Clinical Calming Soundtrack Orbits</span>
                  
                  <div className="space-y-4">
                    <p className="text-xs text-[#4d3c69] dark:text-slate-400 leading-relaxed">
                      Settle your thoughts under gentle acoustic white noises and space soundtracks curated by care leads.
                    </p>

                    <div className="bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-100/60 p-4.5 rounded-2xl flex items-center justify-between text-left">
                      <div>
                        <b className="text-xs text-slate-800 dark:text-slate-400 block font-bold">Deep Cosmic Rest Playlist</b>
                        <span className="text-[10px] text-[#7e6c9e] dark:text-slate-400 block mt-0.5">Opens in Spotify when you need background calm.</span>
                      </div>
                      <a 
                        href="https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-purple-600 text-white rounded-full text-xs shadow hover:scale-105 transition"
                      >
                        <Compass className="w-4.5 h-4.5 fill-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*  VOICE JOURNAL ── */}
          {activeSection === 'voice' && (
            <div className="space-y-8 animate-fade-in">
              <VoiceJournal onJournalSaved={(entry) => {
                setReflectionHistory(prev => [entry, ...prev]);
                setLastAction("Transcribed Voice Journal");
              }} />
            </div>
          )}

          {/*  APPOINTMENT COPILOT ── */}
          {activeSection === 'appointment' && (
            <div className="space-y-8 animate-fade-in">
              <AppointmentCopilot onQuestionsBuilt={() => {
                addStar("Formulated Pre-Appointment Questions", "appointment");
                setLastAction("Created Oncologist Prompt Sheet");
              }} />
            </div>
          )}

          {/*  SYMPTOM TRACKER ── */}
          {activeSection === 'symptoms' && (
            <div className="space-y-8 animate-fade-in">
              <SymptomTracker onLogSymptoms={(log) => {
                setSymptomLog(log);
                addStar("Logged Symptom Checklist", "symptom");
                setLastAction("Logged Daily Symptoms");
              }} />
            </div>
          )}

          {/*  TIMELINE ── */}
          {activeSection === 'timeline' && (
            <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl font-sans animate-fade-in">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <h3 className="text-md font-extrabold text-[#1e133a] dark:text-slate-100">Care Chronology Pipeline</h3>
                <p className="text-xs text-[#7e6c9e] dark:text-slate-400 mt-1">Track milestones. Every mapped node aligns you to release.</p>
              </div>

              <div className="relative pl-6 border-l-2 border-purple-500/15 space-y-8 text-left py-2">
                {timelineItems.map((mil, idx) => (
                  <div key={mil.id} className="relative">
                    {/* Glowing orb anchor */}
                    <span className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full border-2 ${
                      mil.done 
                        ? 'bg-gradient-to-tr from-pink-400 to-purple-500 border-white ring-4 ring-pink-400/20 shadow-md' 
                        : 'bg-[#decfe6] border-purple-200 text-[#4d3c69] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400'
                    }`} />
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#7e6c9e] dark:text-slate-400">{mil.date}</span>
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                          mil.type === 'medical' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400' :
                          mil.type === 'emotional' ? 'bg-pink-50 text-pink-600 dark:bg-pink-950/20 dark:text-pink-400' :
                          'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                        }`}>
                          {mil.type}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#2e214c] dark:text-slate-200 mt-1 leading-snug">{mil.label}</h4>
                      {mil.notes && <p className="text-[11px] leading-relaxed mt-1 text-[#4d3c69] dark:text-slate-400">{mil.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/*  REPORTS ── */}
          {activeSection === 'reports' && (
            <div className="space-y-8 animate-fade-in">
              <Reports />
            </div>
          )}

          {/*  CARE CIRCLE ── */}
          {activeSection === 'circle' && (
            <div className="space-y-8 animate-fade-in">
              <CareCircle />
            </div>
          )}

          {/*  MESSAGE BOTTLES ── */}
          {activeSection === 'bottles' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/5 blur-3xl rounded-full" />
                <span className="text-4xl block mb-3 animate-bounce">💌</span>
                <h3 className="text-md font-extrabold text-[#1e133a] dark:text-slate-100">Hopeful Message Bottles</h3>
                <p className="text-xs text-[#7e6c9e] dark:text-slate-400 mt-1.5 leading-relaxed">
                  Supportive messages gathered from shared health journeys. <br></br>Unscrew a bottle whenever dark clouds make the stars harder to see.
                </p>

                <div className="my-6 max-w-md w-full bg-purple-50/50 dark:bg-slate-950/30 border border-dashed border-purple-300/40 rounded-2xl p-5 leading-relaxed shadow-inner min-h-[90px] flex items-center justify-center italic text-xs text-[#3d3650] dark:text-slate-300">
                  {bottleIndex !== null 
                    ? MESSAGE_BOTTLES[bottleIndex] 
                    : "No active alignment message opened yet. Pull a secure cork below."}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={unlockBottle}
                    disabled={unlockedBottles >= MESSAGE_BOTTLES.length}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-sans text-xs font-bold px-6 py-2.5 rounded-full shadow-lg hover:shadow-purple-500/20 cursor-pointer disabled:opacity-40"
                  >
                    {unlockedBottles >= MESSAGE_BOTTLES.length ? 'All Bottles Dispatched 🌸' : 'Acquire Orbits Bottle 🌟'}
                  </button>

                  <span className="text-[10px] font-mono text-[#7e6c9e] dark:text-slate-400 font-bold uppercase mt-1">
                    {unlockedBottles} / {MESSAGE_BOTTLES.length} BOTTLES UNLOCKED
                  </span>
                </div>
              </div>
            </div>
          )}

          {/*  RESOURCES ── */}
          {activeSection === 'resources' && (
            <div className="space-y-8 animate-fade-in">
              <Resources />
            </div>
          )}

          {/*  PROGRESS ── */}
          {activeSection === 'progress' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="pb-3 border-b border-purple-100 dark:border-slate-815/50 mb-5">
                  <h3 className="text-md font-extrabold text-[#1e133a] dark:text-white">Active Constellation Index</h3>
                  <p className="text-xs text-[#7e6c9e] dark:text-slate-400 mt-1">A historical view of all illuminated alignment points mapping safety guidelines.</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-slate-55/40 dark:bg-slate-950/30 rounded-2xl border border-purple-100 dark:border-slate-800">
                    <span className="text-2xl font-black text-purple-600 block">{stars.length}</span>
                    <span className="text-[10px] font-semibold text-[#7e6c9e] dark:text-slate-400 block mt-1">Illuminated Stars</span>
                  </div>
                  <div className="p-4 bg-slate-55/40 dark:bg-slate-950/30 rounded-2xl border border-purple-100 dark:border-slate-800">
                    <span className="text-2xl font-black text-pink-600 block">{Math.max(1, Math.floor(stars.length / 5))}</span>
                    <span className="text-[10px] font-semibold text-[#7e6c9e] dark:text-slate-400 block mt-1">Formed Constellations</span>
                  </div>
                  <div className="p-4 bg-slate-55/40 dark:bg-slate-950/30 rounded-2xl border border-purple-100 dark:border-slate-800">
                    <span className="text-2xl font-black text-cyan-600 block">{unlockedBottles}</span>
                    <span className="text-[10px] font-semibold text-[#7e6c9e] dark:text-slate-400 block mt-1">Hope Messages Discovered</span>
                  </div>
                </div>
              </div>

              {/* Connected Star summary items */}
              <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-5 shadow-xl">
                <span className="text-xs font-bold font-mono tracking-widest text-[#a855f7] block mb-4 uppercase">Stellar Log Pathway Archive</span>
                <div className="space-y-3">
                  {stars.slice().reverse().map(star => (
                    <div key={star.id} className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-purple-100 dark:border-slate-850 rounded-xl text-left">
                      <div>
                        <b className="text-xs font-bold text-[#1e133a] dark:text-slate-100">{star.label}</b>
                        <span className="text-[9px] text-[#a855f7] font-mono uppercase block mt-0.5">✦ Sector aligned // {star.category}</span>
                      </div>
                      <span className="text-[9px] font-mono text-[#7e6c9e] dark:text-slate-400 whitespace-nowrap">{star.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/*  REFLECTION ARCHIVE ── */}
          {activeSection === 'reflection' && (
            <div className="space-y-8 animate-fade-in font-sans">
              <div className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-3.5 bg-purple-50/50 dark:bg-purple-950/25 border border-purple-100/60 p-4.5 rounded-2xl mb-6">
                  <span className="text-3xl animate-pulse">🌙</span>
                  <div>
                    <span className="text-[9px] font-bold font-mono tracking-wider text-purple-600 uppercase">ACTIVE COGNITIVE ALIGNMENT PROMPT</span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic mt-0.5">
                      "{REFLECTIONS[reflectionIndex]}"
                    </p>
                  </div>
                </div>

                <label className="text-[10px] font-bold font-mono tracking-widest text-[#7e6c9e] dark:text-slate-400 block mb-2">WRITE YOUR SECURE THOUGHTS</label>
                <textarea
                  className="w-full text-xs p-4 bg-[#FAF8FD] dark:bg-slate-950 rounded-2xl border border-purple-200 dark:border-slate-805 focus:outline-none focus:border-purple-500 text-[#2e214c] dark:text-slate-250 leading-relaxed resize-none"
                  rows={4}
                  placeholder="The page is empty. There is absolute permission to express frustration, beauty, stable relief, or fog. This is just for you..."
                  value={reflectionAnswer}
                  onChange={e => setReflectionAnswer(e.target.value)}
                />

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveReflection}
                    disabled={!reflectionAnswer.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white select-none text-xs font-bold px-5 py-2.5 rounded-full shadow-lg cursor-pointer disabled:opacity-40"
                  >
                    Commit to Constellation Star ✦
                  </button>
                </div>
              </div>

              {/* Reflection historical log summary */}
              {reflectionHistory.length > 0 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#a855f7] block pl-1">Historical Reflections Archive</span>
                  <div className="space-y-4">
                    {reflectionHistory.map(item => (
                      <div key={item.id} className="bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-805 p-5 rounded-2xl shadow-sm text-left">
                        <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-slate-805 mb-2.5">
                          <span className="text-[10px] font-bold text-[#7e6c9e] dark:text-slate-400">Prompt: "{item.prompt}"</span>
                          <span className="text-[9px] font-mono text-[#7e6c9e] dark:text-slate-400">{item.date}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-[#3d3650] dark:text-slate-350">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'shared' && (
            <div className="animate-fade-in">
              <SharedConstellation
                theme={theme}
                role="patient"
                onNavigateHome={() => setActiveSection('home')}
              />
            </div>
          )}

        </div>

        {/* ── BOTTOM RIGHT FLOATING QUICK ACTIONS MENU ── */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            {/* Quick action menu selector overlay panel */}
            {quickSupportOpen && (
              <div className="absolute bottom-16 right-0 w-52 bg-white dark:bg-slate-900 border border-purple-200/50 dark:border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-md animate-fade-in flex flex-col gap-1.5 text-left">
                <span className="text-[9px] font-extrabold uppercase font-mono tracking-widest text-slate-700 dark:text-pink-500 border-b border-slate-200 dark:border-slate-850 pb-1.5 mb-1 pl-1">
                  QUICK COMPASS
                </span>

                <button
                  onClick={() => {
                    setActiveSection('astra');
                    setQuickSupportOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-350 dark:text-slate-350 hover:bg-purple-100/50 dark:hover:bg-purple-900/10 cursor-pointer text-left"
                >
                  <Sparkles className="w-4 h-4 text-purple-700 dark:text-purple-600" />
                  <span>Talk with Astra</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('calm');
                    setQuickSupportOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-350 dark:text-slate-350 hover:bg-purple-100/50 dark:hover:bg-purple-900/10 cursor-pointer text-left"
                >
                  <Heart className="w-4 h-4 text-cyan-600 dark:text-cyan-500 animate-pulse" />
                  <span>Breathing exercises</span>
                </button>

                <button
                  onClick={() => {
                    setActiveSection('voice');
                    setQuickSupportOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-350 dark:text-slate-350 hover:bg-purple-100/50 dark:hover:bg-purple-900/10 cursor-pointer text-left"
                >
                  <Compass className="w-4 h-4 text-purple-700 dark:text-purple-500" />
                  <span>Voice Journal</span>
                </button>

                <div className="border-t border-slate-200 dark:border-[#c9a0dc]/15 pt-1.5 mt-1">
                  <div className="px-2 py-1">
                    <div className="flex items-center gap-2 text-[11px] font-black text-red-600 dark:text-red-400 mb-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-500 animate-bounce" />
                      <span>Get Help Now 🚨</span>
                    </div>

                    <a
                      href="tel:995"
                      className="w-full flex items-center justify-between px-2 py-2 rounded-xl text-[11px] font-semibold text-slate-350 dark:text-slate-350 hover:bg-red-500/10 transition"
                    >
                      <span>Singapore Emergency</span>
                      <span className="text-red-600 dark:text-red-500 font-bold">995</span>
                    </a>

                    <a
                      href="tel:1767"
                      className="w-full flex items-center justify-between px-2 py-2 rounded-xl text-[11px] font-semibold text-slate-350 dark:text-slate-350 hover:bg-purple-500/10 transition"
                    >
                      <span>SOS Crisis Hotline</span>
                      <span className="text-purple-700 dark:text-purple-600 font-bold">1767</span>
                    </a>

                    <a
                      href="tel:63892222"
                      className="w-full flex items-center justify-between px-2 py-2 rounded-xl text-[11px] font-semibold text-slate-350 dark:text-slate-350 hover:bg-indigo-500/10 transition"
                    >
                      <span>IMH Mental Health</span>
                      <span className="text-[10px] leading-none text-indigo-700 dark:text-indigo-400 font-bold">6389 2222</span>
                    </a>

                    <button
                      onClick={() => {
                        setActiveSection('calm');
                        setQuickSupportOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-[11px] font-semibold text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/10 transition"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Ground Me First</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Glowing Trigger Orb Button */}
            <button
              onClick={() => setQuickSupportOpen(!quickSupportOpen)}
              className="px-5 py-3 rounded-full bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-2xl hover:scale-103 transition-all ring-4 ring-purple-400/20 select-none"
            >
              <Heart className="w-4 h-4 fill-white animate-pulse" />
              <span>Need support?</span>
            </button>
          </div>
        </div>

        {/* PROGRESSIVE ACCOUNT REWARD WALL */}
        <ProgressiveAuthModal
          isOpen={progressiveAuthOpen}
          onClose={() => setProgressiveAuthOpen(false)}
          reason={progressiveAuthReason}
          theme={theme}
          onAuthSuccess={handleAuthSuccess}
        />

      </main>
    </div>
  );
}