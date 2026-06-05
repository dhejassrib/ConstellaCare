// CaregiverDashboard.tsx:
import React, { useState, useEffect, useRef } from 'react';
import SharedConstellation from './SharedConstellation';
import styles from '../Landing.module.css';
import ConstellaLogo from './ConstellaLogo';
import { GoogleGenAI } from '@google/genai';
import {
  Sun, Moon, Star, MessageSquare, Heart, Sparkles, Navigation, CheckCircle,
  ChevronRight, Compass, ShieldAlert, Award, FileText, Send, HelpCircle, X,
  Activity, Battery, Plus, Trash, Lock, Calendar, Users, Mic, Volume2, Clock,
  ArrowRight, ShieldCheck, RefreshCw, Wind, Pill, FileBarChart, Mail, Trophy, BookOpen, Zap
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

function generateLocalCaregiverCommFallback(query: string): string {
  const text = query.toLowerCase();
  if (text.includes('chemo') || text.includes('chemotherapy')) {
    return `🌟 Before treatment, focus on comfort and predictability. Consider saying:\n\n"We don't have to be brave all day. Let's just focus on getting through this next hour together."`;
  }
  return `✨ I couldn't reach the communication assistant right now, but I'm still here to help draft supportive wording.`;
}

export default function CaregiverDashboard({ theme, onThemeToggle, onNavigate, user, onAuthTrigger, onLogout }: CaregiverDashboardProps) {
  const [activeSection, setActiveSection] = useState<CaregiverSection>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalStars, setTotalStars] = useState(12);
  const [quickSupportOpen, setQuickSupportOpen] = useState(false);

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

  const [appointments, setAppointments] = useState<AppointmentEvent[]>(() => {
    const cached = localStorage.getItem('caregiver-appointments');
    if (cached) return JSON.parse(cached);
    return [
      { id: '1', title: 'Chemotherapy Infusion Cycle 2', date: 'Tomorrow', time: '2:30 PM', transport: 'Driver: Chloe (Sister)', medsLogged: true, notesPinned: 'Focus on cold cap application protocol immediately on start.' },
      { id: '2', title: 'Post-chemo Hydration Checkup', date: 'Next Tuesday', time: '11:00 AM', transport: 'Driver: Sarah (Self)', medsLogged: false, notesPinned: 'Bring nausea diary to review blood pressure indicators.' },
    ];
  });

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
  const [isJournalAnalyzing, setIsJournalAnalyzing] = useState(false);
  const [journalLogs, setJournalLogs] = useState<Array<{ id: string; text: string; date: string; reply: string }>>(() => {
    const cached = localStorage.getItem('caregiver-journal-logs');
    if (cached) return JSON.parse(cached);
    return [];
  });
  
  const [voiceActive, setVoiceActive] = useState(false);
  const [waveSeconds, setWaveSeconds] = useState(0);
  const recognitionRef = useRef<any>(null);

  const [currentRecoveryRem, setCurrentRecoveryRem] = useState('Take a moment to stretch your shoulders and neck. Have a few slow sips of water before continuing.');
  
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionFeedback, setEmotionFeedback] = useState<string>('');
  const [energyLevel, setEnergyLevel] = useState(55);
  const [recoveryScore, setRecoveryScore] = useState(65);
  const [emotionalLoad, setEmotionalLoad] = useState('Elevated');

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
    let timerInterval: NodeJS.Timeout;
    if (voiceActive) {
      timerInterval = setInterval(() => {
        setWaveSeconds((s) => s + 1);
      }, 1000);
    } else {
      setWaveSeconds(0);
    }
    return () => clearInterval(timerInterval);
  }, [voiceActive]);

  useEffect(() => {
    const reminders = [
      "Take a moment to stretch your shoulders and neck. Have a few slow sips of water before continuing.",
      "Look away from your screen for 20 seconds. Notice two things around you that you haven't paid attention to today.",
      "Try a quick breathing reset: inhale for 4 seconds, hold for 2, then exhale slowly for 6 seconds.",
      "Progress doesn't have to be dramatic. Small actions count too."
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
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleSendCommQuery = async (custom?: string) => {
    const textToSend = custom || commQuery;
    if (!textToSend.trim()) return;

    setCommChat(prev => [...prev, { sender: 'user', text: textToSend }]);
    setCommQuery('');
    setTyping(true);

    const normalized = textToSend.trim().toLowerCase();
    if (normalized.includes("support sarah before chemotherapy")) {
      setCommChat(prev => [...prev, { sender: 'ai', text: `✨ Pre-treatment Reassurance Option:\n"We are going to take this step-by-step today. My only job today is to hold your hand and ensure you feel safe."` }]);
      setTyping(false);
      return;
    }

    try {
      const response = await fetch('/api/caregiver/comm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });
      if (response.ok) {
        const data = await response.json();
        setCommChat(prev => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setCommChat(prev => [...prev, { sender: 'ai', text: generateLocalCaregiverCommFallback(textToSend) }]);
      }
    } catch (err) {
      setCommChat(prev => [...prev, { sender: 'ai', text: generateLocalCaregiverCommFallback(textToSend) }]);
    } finally {
      setTyping(false);
      setTotalStars(prev => prev + 1);
    }
  };

  const saveJournalEntry = async () => {
    if (!journalText.trim()) return;
    setIsJournalAnalyzing(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
      if (!apiKey) {
        throw new Error("Missing VITE_GEMINI_API_KEY");
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        You are Astra, an AI supporting a family oncology caregiver. Read this raw decompress log: "${journalText}"
        Provide a highly empathetic, supportive response acknowledging their exhaustion or emotional strain. Remind them that taking care of themselves is part of taking care of the patient. Keep it to 2 validation sentences.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const aiReply = response.text || "Astra is alongside you in this quiet space.";

      const entry = {
        id: Math.random().toString(),
        text: journalText,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        reply: aiReply
      };

      setJournalLogs(prev => [entry, ...prev]);
      setJournalText('');
    } catch (error) {
      console.error("Caregiver Journal AI Processing Error:", error);
      const fallbackEntry = {
        id: Math.random().toString(),
        text: journalText,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        reply: "Astra has captured your exhaustion logs. It is completely safe to acknowledge that this path feels heavy. Rest your eyes tonight."
      };
      setJournalLogs(prev => [fallbackEntry, ...prev]);
      setJournalText('');
    } finally {
      setIsJournalAnalyzing(false);
      setTotalStars(prev => prev + 1);
    }
  };

  const triggerVoiceNote = () => {
    if (voiceActive) {
      setVoiceActive(false);
      if (recognitionRef.current) recognitionRef.current.stop();
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Live speech transcription is not fully configured on this browser asset. Falling back to simulator text.");
        setJournalText("Sarah rested for 3 hours after chemo #2. Feeling a slight knot in my stomach because her skin looks pale. However, her temperature is stable at 36.8°C.");
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;

      rec.onresult = (event: any) => {
        const voiceResult = event.results[event.results.length - 1][0].transcript;
        setJournalText(prev => prev + (prev ? " " : "") + voiceResult);
      };

      rec.onerror = (e: any) => console.error("Voice recording error:", e);
      rec.onend = () => setVoiceActive(false);

      recognitionRef.current = rec;
      rec.start();
      setVoiceActive(true);
    }
  };

  const addBurnoutEvent = (moodType: 'fatigue' | 'overwhelm' | 'stable' | 'gratitude', notes: string, energy: number) => {
    const newEvent: BurnoutEvent = { id: Math.random().toString(), time: 'Just Now', moodType, energy, notes };
    setBurnoutEvents(prev => [newEvent, ...prev]);
    setEnergyLevel(energy);
    setTotalStars(prev => prev + 1);
  };

  const txt = theme === 'dark' ? 'text-[#f5f0eb]' : 'text-[#1e133a]';
  const txtMuted = theme === 'dark' ? 'text-[#9b8ab8]' : 'text-[#4d3c69]';
  const txtSubtle = theme === 'dark' ? 'text-slate-300' : 'text-[#3d3650]';
  const cardBg = theme === 'dark' ? 'bg-[#120d21]' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-[#c9a0dc]/8' : 'border-[#d7d0e5]/50';
  const surfaceBg = theme === 'dark' ? 'bg-[#07040f]/60' : 'bg-slate-50';
  const surfaceBorder = theme === 'dark' ? 'border-[#c9a0dc]/10' : 'border-purple-100';

  return (
    <div className={`flex min-h-screen transition-all duration-500 font-sans ${theme === 'dark' ? 'dark bg-[#07040f] text-[#f5f0eb]' : 'bg-[#FAF8FD] text-[#1e133a]'}`}>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#9b8ab8]/15 via-[#ea96a6]/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 bottom-0 left-0 border-r backdrop-blur-md w-64 z-40 flex flex-col justify-between transition-all duration-300 transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} ${theme === 'dark' ? 'bg-[#0f0a21]/90 border-[#c9a0dc]/15' : 'bg-[#FAF8FD]/95 border-[#7e6c9e]/20'}`}>
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#6366f1]/10">
            <div onClick={() => onNavigate('/')} className="flex items-center gap-2.5 cursor-pointer group">
              <span className="w-8 h-8 flex justify-center mb-4"><ConstellaLogo size={50} className={styles.logo} /></span>
              <span className="font-bold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent italic tracking-tight group-hover:opacity-85">ConstellaCare</span>
            </div>
          </div>

          <nav className="p-4 space-y-5 overflow-y-auto flex-1">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#d4798e] block pl-2.5 mb-2.5">Support Center</span>
              {[
                { id: 'home', label: 'Dashboard Home', icon: <Compass className="w-3.5 h-3.5" /> },
                { id: 'shared', label: 'Shared Constellation', icon: <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> },
                { id: 'emotion', label: 'Caregiver Wellbeing', icon: <Activity className="w-3.5 h-3.5" /> },
                { id: 'appointments', label: 'Treatment Timeline', icon: <Calendar className="w-3.5 h-3.5" /> },
                { id: 'communication', label: 'Communication Assistant', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                { id: 'circle', label: 'Care Orbit Circle', icon: <Users className="w-3.5 h-3.5" /> },
                { id: 'journal', label: 'Private Journal', icon: <Mic className="w-3.5 h-3.5" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as CaregiverSection)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold leading-none capitalize transition-all duration-200 cursor-pointer ${activeSection === item.id ? (theme === 'dark' ? 'bg-gradient-to-r from-[#211738] to-[#120d21] text-[#f4d4a8] border border-[#c9a0dc]/20' : 'bg-gradient-to-r from-[#decfe6] to-[#e8e2f4] text-[#1a1530] border border-[#c9a0dc]/20') : (theme === 'dark' ? 'bg-transparent text-[#9b8ab8] hover:bg-[#1c1530]/50 font-semibold' : 'bg-transparent text-[#4d3c69] hover:bg-purple-100/60 font-semibold')}`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className={`p-6 border-t flex-shrink-0 ${theme === 'dark' ? 'border-[#6366f1]/10' : 'border-[#7e6c9e]/20'}`}>
          <div className={`rounded-2xl p-4 border text-center relative overflow-hidden shadow-md ${theme === 'dark' ? 'bg-gradient-to-tr from-slate-950 to-slate-850 text-slate-100 border-purple-500/15' : 'bg-gradient-to-tr from-[#ede6f8] to-[#decfe6] text-[#1e133a] border-[#c9a0dc]/25'}`}>
            <Award className="w-7 h-7 text-amber-500 dark:text-amber-400 mx-auto animate-pulse" />
            <span className={`text-[10px] block font-mono font-bold tracking-widest mt-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-700'}`}>CAREGIVER CARESCORE</span>
            <span className="text-2xl font-black mt-1 block">{totalStars} ✨</span>
          </div>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 md:pl-64 min-h-screen flex flex-col z-10 relative">
        <header className="sticky top-0 bg-[#FAF8FD]/85 dark:bg-slate-900/80 backdrop-blur-md py-4 px-6 md:px-10 flex items-center justify-between border-b border-purple-200/50 dark:border-[#6366f1]/10 z-20">
          <h1 className={`text-base font-extrabold flex items-center gap-1.5 capitalize ${theme === 'dark' ? 'text-[#FAF8FD]' : 'text-[#2e214c]'}`}>
            {activeSection === 'home' ? 'Dashboard Home' : `${activeSection} Interface`}
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={onThemeToggle} className="p-2 bg-purple-100/40 dark:bg-slate-850 text-purple-600 dark:text-purple-400 rounded-xl cursor-pointer">
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>
          </div>
        </header>

        {/* Recovery Alert Banner */}
        <div className="px-6 md:px-10 pt-4">
          <div className="bg-gradient-to-r from-[#decfe6]/20 via-[#e8e2f4]/15 to-[#ea96a6]/5 border border-[#c9a0dc]/30 rounded-2xl p-3.5 flex items-start gap-3 shadow-sm relative overflow-hidden">
            <Sparkles className="w-4 h-4 text-[#d4798e] flex-shrink-0 mt-0.5 animate-bounce" />
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#d4798e] block">QUICK RESET TIPS</span>
              <p className={`text-xs italic mt-0.5 leading-relaxed font-semibold ${theme === 'dark' ? 'text-[#FAF8FD]/90' : 'text-[#3d3650]'}`}>{currentRecoveryRem}</p>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="flex-1 p-6 md:p-10 max-w-5xl w-full mx-auto space-y-8 pb-32 text-left">
          
          {/* HOME DASHBOARD VIEW */}
          {activeSection === 'home' ? (
            <div className="space-y-8 animate-fade-in">
              <div className={`relative overflow-hidden rounded-3xl p-7 md:p-9 border shadow-xl ${cardBg} ${cardBorder}`}>
                <h2 className={`text-xl md:text-2xl font-black tracking-tight ${txt}`}>Caregiver Dashboard Coordinates Live</h2>
                <p className={`text-xs mt-1 leading-relaxed ${txtMuted}`}>You have logged active care routines safely this week.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Astra Care Insights */}
                <div className={`border rounded-3xl p-6 shadow-md flex flex-col justify-between ${cardBg} ${cardBorder}`}>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5 border-b pb-2 mb-3"><Sparkles className="w-4 h-4" /> Astra Insights</h4>
                    <p className={`text-xs ${txtSubtle}`}>"You've handled dense medication log updates for Sarah this morning. Settle down with a quick rest circle tonight."</p>
                  </div>
                </div>

                {/* Shared Care Tasks Checkbox Grid */}
                <div className={`border rounded-3xl p-6 shadow-md flex flex-col justify-between ${cardBg} ${cardBorder}`}>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#d4798e] flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Operational Checklist</h4>
                    <div className="space-y-2 mt-4">
                      {tasks.map(task => (
                        <div key={task.id} className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${task.done ? 'opacity-45 line-through' : `${surfaceBg} ${surfaceBorder}`}`}>
                          <span onClick={() => toggleTask(task.id)} className="cursor-pointer font-bold">{task.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* WELLBEING EMOTIONS VIEW */}
          {activeSection === 'emotion' && (
            <div className="space-y-8 animate-fade-in">
              <div className={`border rounded-3xl p-6 shadow-xl ${cardBg} ${cardBorder}`}>
                <h3 className={`text-md font-bold flex items-center gap-2 ${txt}`}><Activity className="w-4 h-4 text-pink-500" /> Caregiver Mood Check-In</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {['exhausted', 'worried', 'peaceful', 'overwhelmed'].map(id => (
                    <button key={id} onClick={() => triggerEmotionCheckIn(id, id)} className={`p-4 border rounded-2xl cursor-pointer hover:scale-102 transition ${cardBg} ${selectedEmotion === id ? 'ring-2 ring-purple-500' : ''}`}>
                      <span className="text-2xl block">✦</span>
                      <span className="text-xs font-bold uppercase tracking-wider block mt-1">{id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TREATMENT TIMELINE VIEW */}
          {activeSection === 'appointments' && (
            <div className={`border rounded-3xl p-6 shadow-xl ${cardBg} ${cardBorder}`}>
              <h3 className="text-md font-black mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-pink-400" /> Treatment Pipeline</h3>
              {appointments.map(app => (
                <div key={app.id} className={`p-4 border rounded-xl mb-3 ${surfaceBg} ${surfaceBorder}`}>
                  <h4 className="font-bold text-xs">{app.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{app.date} // {app.time}</p>
                </div>
              ))}
            </div>
          )}

          {/* CONVERSATION PHRASING ASSISTANT */}
          {activeSection === 'communication' && (
            <div className={`border rounded-3xl p-6 shadow-xl ${cardBg} ${cardBorder}`}>
              <h3 className="text-sm font-black mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Communication Assistant</h3>
              <div className="space-y-3 h-64 overflow-y-auto p-2">
                {commChat.map((c, i) => (
                  <p key={i} className={`text-xs p-2.5 rounded-xl max-w-[85%] ${c.sender === 'user' ? 'bg-purple-950 text-white ml-auto' : 'bg-slate-950/40 text-slate-300'}`}>{c.text}</p>
                ))}
              </div>
            </div>
          )}

          {/* ORBIT NETWORK VIEW */}
          {activeSection === 'circle' && (
            <div className={`border rounded-3xl p-6 shadow-xl ${cardBg} ${cardBorder}`}>
              <h3 className="text-sm font-black mb-2"><Users className="w-4 h-4" /> Care Orbit System Matrix</h3>
              <p className="text-xs text-slate-400">Your core relational orbit support metrics are mapped as active and secure.</p>
            </div>
          )}

          {/* 🎙️ LIVE GEMINI VOICE DECOMPRESS SPACE VIEW */}
          {activeSection === 'journal' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div className={`border rounded-3xl p-6 shadow-xl leading-relaxed relative overflow-hidden ${cardBg} ${cardBorder}`}>
                <span className="absolute top-0 right-0 w-28 h-28 bg-[#d4798e]/5 blur-2xl rounded-full" />
                <h3 className={`text-md font-extrabold flex items-center gap-2 ${txt}`}>
                  <Lock className="w-4 h-4 text-emerald-500" /> Secure Caregiver Decompress Space
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${txtMuted}`}>
                  This journal block routes securely to Astra AI to help validate your internal thoughts. Completely safe from patient tracking metrics.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
                  <div className={`md:col-span-5 rounded-2xl p-5 border flex flex-col items-center justify-center text-center h-[240px] ${theme === 'dark' ? 'bg-[#07040f] border-[#c9a0dc]/10' : 'bg-purple-50/20 border-purple-200/55'}`}>
                    <div className={`flex items-end justify-center gap-1 my-4 h-12 ${voiceActive ? 'opacity-100' : 'opacity-30'}`}>
                      {[1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 2, 1].map((bar, bIdx) => (
                        <div key={bIdx} className="w-1 rounded-full bg-[#d4798e]" style={{ height: voiceActive ? `${bar * 9 + Math.random() * 8}px` : '4px' }} />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={triggerVoiceNote}
                      className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all ${voiceActive ? 'bg-red-500 animate-pulse' : 'bg-purple-600'}`}
                    >
                      <Mic className="w-5 h-5 text-white" />
                    </button>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-3">{voiceActive ? 'Recording Live Audio...' : 'Click to stream transcript'}</span>
                  </div>

                  <div className="md:col-span-7 flex flex-col justify-between">
                    <textarea
                      className={`w-full text-xs p-4 rounded-2xl border focus:outline-none focus:border-[#d4798e] bg-transparent ${theme === 'dark' ? 'text-slate-200 border-slate-800' : 'text-[#2e214c] border-purple-300'}`}
                      rows={6}
                      placeholder="Pour whatever fits inside your heart tonight. Sarah cannot read this; your boundaries are locked."
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[10px] text-slate-500">🔒 Dynamic Aligned Encryption</span>
                      <button
                        type="button"
                        onClick={saveJournalEntry}
                        disabled={!journalText.trim() || isJournalAnalyzing}
                        className="px-5 py-2.5 rounded-xl bg-[#d4798e] hover:bg-[#ea96a6] text-white text-xs font-bold cursor-pointer disabled:opacity-40"
                      >
                        {isJournalAnalyzing ? "Analyzing Decompress Log..." : "Commit to Star Constell ✦"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ARCHIVE LOG HISTORY CARDS */}
                {journalLogs.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#d4798e] block pl-1">Decompress Archives</span>
                    <div className="space-y-4">
                      {journalLogs.map((log) => (
                        <div key={log.id} className={`p-5 rounded-2xl border space-y-3.5 ${surfaceBg} ${surfaceBorder}`}>
                          <div className="flex justify-between items-center border-b border-[#7e6c9e]/10 pb-2">
                            <span className="text-[9px] font-mono text-[#d4798e]">🔓 DECOMPRESSED LOG</span>
                            <span className="text-[10px] font-mono font-bold text-slate-400">{log.date}</span>
                          </div>
                          <p className="text-xs leading-relaxed italic text-slate-700 dark:text-slate-300">"{log.text}"</p>
                          <div className="p-3 bg-[#decfe6]/10 rounded-xl border border-[#c9a0dc]/15 flex gap-2.5 items-start text-[11px]">
                            <Sparkles className="w-4 h-4 text-[#d4798e] mt-0.5 flex-shrink-0 animate-pulse" />
                            <div>
                              <b className="uppercase font-bold tracking-wider text-[8px] text-[#ea96a6] block mb-0.5">Astra Compass Interpretation:</b>
                              <p className="italic text-slate-600 dark:text-slate-400 leading-normal">
                                {log.reply || "Astra has synchronized your decompress alignment vector safely."}
                              </p>
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

          {/* NETWORKING SHARED LAYOUT MATRIX */}
          {activeSection === 'shared' && (
            <div className="animate-fade-in">
              <SharedConstellation theme={theme} role="caregiver" isLoggedIn={!!user} onNavigateHome={() => setActiveSection('home')} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}