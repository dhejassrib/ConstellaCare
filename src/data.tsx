import { Section, CareCircleNode, Milestone, SymptomLog } from './types';

// export const NAV_GROUPS = [
//   {
//     group: 'Emotional Support',
//     items: [
//       { id: 'home' as Section, label: 'Home', icon: '⭐' },
//       { id: 'shared' as Section, label: 'Shared Constellation', icon: '💫' },
//       { id: 'astra' as Section, label: 'Talk to Astra', icon: '✨' },
//       { id: 'mood' as Section, label: 'Mood Check-In', icon: '🌸' },
//       { id: 'calm' as Section, label: 'Calm Corner', icon: '🫧' },
//       { id: 'voice' as Section, label: 'Voice Journal', icon: '🎙️' },
//     ],
//   },
//   {
//     group: 'Care Journey',
//     items: [
//       { id: 'appointment' as Section, label: 'Appointment Prep', icon: '🩺' },
//       { id: 'symptoms' as Section, label: 'Health Tracker', icon: '📋' },
//       { id: 'medications' as Section, label: 'Medications', icon: '💊' },
//       { id: 'timeline' as Section, label: 'Timeline', icon: '📅' },
//       { id: 'reports' as Section, label: 'Reports', icon: '📊' },
//     ],
//   },
//   {
//     group: 'Community',
//     items: [
//       { id: 'circle' as Section, label: 'Care Circle', icon: '🌌' },
//       { id: 'bottles' as Section, label: 'Message Bottles', icon: '💌' },
//       { id: 'resources' as Section, label: 'Resources', icon: '📚' },
//     ],
//   },
//   {
//     group: 'My Constellation',
//     items: [
//       { id: 'progress' as Section, label: 'Progress', icon: '✨' },
//       { id: 'milestones' as Section, label: 'Health Milestones', icon: '🌟' },
//       { id: 'reflection' as Section, label: 'Reflection Archive', icon: '🌙' },
//     ],
//   },
// ];

import {
  Compass,
  Sparkles,
  MessageSquare,
  Heart,
  Wind,
  Mic,
  Calendar,
  Activity,
  Pill,
  Clock,
  BarChart3,
  Users,
  Mail,
  BookOpen,
  Trophy,
  Star,
  Moon,
} from 'lucide-react';
export const NAV_GROUPS = [
  {
    group: 'Emotional Wellbeing',
    items: [
      { id: 'home', label: 'Home', icon: <Compass className="w-3.5 h-3.5" /> },
      { id: 'astra', label: 'Talk to Astra', icon: <MessageSquare className="w-3.5 h-3.5" /> },
      { id: 'mood', label: 'Mood Check-In', icon: <Heart className="w-3.5 h-3.5" /> },
      { id: 'calm', label: 'Calm Corner', icon: <Wind className="w-3.5 h-3.5" /> },
      // { id: 'voice', label: 'Voice Journal', icon: <Mic className="w-3.5 h-3.5" /> },
    ],
  },
  {
    group: 'Care Journey',
    items: [
      { id: 'appointment', label: 'Appointment Copilot', icon: <Calendar className="w-3.5 h-3.5" /> },
      { id: 'symptoms', label: 'Health Tracker', icon: <Activity className="w-3.5 h-3.5" /> },
      { id: 'medications', label: 'Medications', icon: <Pill className="w-3.5 h-3.5" /> },
      // { id: 'timeline', label: 'Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
      // { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-3.5 h-3.5" /> },
      { id: 'timeline', label: 'Health Journey Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
    ],
  },
  {
    group: 'Support Network',
    items: [
      { id: 'shared', label: 'Shared Constellation', icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" /> },
      { id: 'circle', label: 'Care Circle', icon: <Users className="w-3.5 h-3.5" /> },
      { id: 'bottles', label: 'Message Bottles', icon: <Mail className="w-3.5 h-3.5" /> },
    ],
  },
  {
    group: 'Personal',
    items: [
      // { id: 'progress', label: 'Progress', icon: <Trophy className="w-3.5 h-3.5" /> },
      // { id: 'milestones', label: 'Health Milestones', icon: <Star className="w-3.5 h-3.5" /> },
      { id: 'reflection', label: 'Reflection Archive', icon: <Moon className="w-3.5 h-3.5" /> },
      { id: 'resources', label: 'Resources', icon: <BookOpen className="w-3.5 h-3.5" /> },
    ],
  },
];



export const REFLECTIONS = [
  'What is one small thing that felt manageable today?',
  'If your body could speak, what would it thank you for?',
  'Who or what helps you feel even slightly safer?',
  'What would "enough" look like for today — not perfect, just enough?',
  'Where did you notice a glimmer of light or safety today?',
  'What is a soft boundary you set or wish you set today?'
];

export const SYMPTOMS = ['Fatigue', 'Nausea', 'Pain', 'Anxiety', 'Appetite loss', 'Sleep issues'];

export const MESSAGE_BOTTLES = [
  "You do not have to carry the entire sky on your shoulders today. Just breathing is enough. 🌸",
  "There is a deep strength inside you that is working quietly, even when you feel completely exhausted.",
  "I finished my last chemo round three months ago. The taste of coffee came back, and my hair is a soft peach fuzz. Settle in, step by step, you will reach the shore too.",
  "Your care team is proud of you, your loved ones are cradled by your courage, and Astra is here to keep you safe.",
  "In the quiet orbits of treatment, remember that the stars shine brightest when it is darkest. Sending you a wave of love. 🌊",
  "Today, let perfect go. Let surviving be your masterpiece."
];

export interface EmotionCard {
  id: string;
  label: string;
  emoji: string;
  color: string;
  reflectionPrompt: string;
}

export const PATIENT_EMOTION_CARDS: EmotionCard[] = [
  { id: 'fearful', label: 'Fragile/Fearful', emoji: '🥀', color: 'from-pink-200 to-rose-300 dark:from-pink-950 dark:to-rose-900', reflectionPrompt: "It's completely tender to feel scared. Where in your body feels this weight?" },
  { id: 'anxious', label: 'Anxious', emoji: '🌪️', color: 'from-amber-200 to-orange-300 dark:from-amber-950 dark:to-orange-900', reflectionPrompt: "Anxiety is like a cloud of particles. Can we take a slow breath together to settle it?" },
  { id: 'exhausted', label: 'Exhausted', emoji: '🌙', color: 'from-indigo-200 to-blue-300 dark:from-indigo-950 dark:to-blue-900', reflectionPrompt: "Your cells are doing brave work. There is absolute permission to rest." },
  { id: 'stable', label: 'Stable/Ground', emoji: '🌱', color: 'from-teal-200 to-emerald-300 dark:from-teal-950 dark:to-emerald-900', reflectionPrompt: "Feeling grounded is a beautiful harbor. What helped you anchor today?" },
  { id: 'grateful', label: 'Grateful', emoji: '✨', color: 'from-purple-200 to-violet-300 dark:from-purple-950 dark:to-violet-900', reflectionPrompt: "A star is lit in your sky. Who or what warmed your heart today?" },
  { id: 'numb', label: 'Overwhelmed', emoji: '🌫️', color: 'from-slate-200 to-zinc-300 dark:from-slate-800 dark:to-zinc-900', reflectionPrompt: "Sometimes numbing is a protective shield. No pressure to active-feel. We are just here." }
];

export const PATIENT_AI_RESPONSES: Record<string, string> = {
  fearful: "Astra holds space for your fear. Fear is a natural response to uncertainty. We don't need to chase it away; we can sit with it, wrap it in soft blankets, and remind you that you are accompanied.",
  anxious: "Your resonance is fluttering. Let's trace a circle of light: Breathe in for 4 seconds, hold for 4, exhale for 4. Feel your heels on the ground. Astra is with you; the orbit is secure.",
  exhausted: "Lie down. Turn off the screens if you must. Exhaustion isn't just physical; it's the constant heart-work of coping. You are doing more than enough by simply resting.",
  stable: "A beautiful, serene coordinate in your cosmic map. Let's record this moment of quiet. Stable days are precious beads on a necklace of recovery. Savor the ease.",
  grateful: "Your constellation lights up! Gratitude is emotional solar power. Let's radiate that heat to the caretakers and loved ones in your Care Circle today.",
  numb: "It is okay to put down the clipboard of feelings. The fog is a safe blanket when things are too loud. I will watch over your coordinate. Breathe slowly, without demands."
};

export const INITIAL_CARE_CIRCLE: CareCircleNode[] = [
  { id: '1', name: 'Mom (Sarah)', relationship: 'Mother', lastActive: '2h ago', message: 'Sent an encouraging constellation note: \"Resting is brave. I love you, sweetheart!\"', angle: 45, distance: 100, color: '#fca5a5' },
  { id: '2', name: 'Dr. Evelyn Moss', relationship: 'Oncology Care Lead', lastActive: '1d ago', message: 'Reviewed symptom log: \"Pain stable. Energy levels are expected; keep resting.\"', angle: 135, distance: 150, color: '#93c5fd' },
  { id: '3', name: 'Sister (Chloe)', relationship: 'Sister', lastActive: '30m ago', message: 'Checked in today: \"Coming over on Saturday to bring some ginger tea. 🍵\"', angle: 220, distance: 120, color: '#c084fc' },
  { id: '4', name: 'Gavin', relationship: 'Best Friend', lastActive: '5h ago', message: 'Shared a funny music video: \"Keep shine in your sky!\"', angle: 310, distance: 140, color: '#3dd5f3' },
];

// export const INITIAL_MILESTONES: Milestone[] = [
//   { id: 'm1', date: '2026-05-15', label: 'Oncology Consultation', done: true, type: 'medical', notes: 'Agreed on chemotherapy parameters and schedule.' },
//   { id: 'm2', date: '2026-05-20', label: 'Chemo Infusion #1', done: true, type: 'medical', notes: 'Completed. Experienced moderate nausea, but stable.' },
//   { id: 'm3', date: '2026-05-26', label: 'Care Circle Grounding', done: true, type: 'emotional', notes: 'Mom joined the Constellation. Star lit.' },
//   { id: 'm4', date: 'Yesterday', label: '3-Min Deep Breathing Star', done: true, type: 'selfcare', notes: 'Practiced bubble expansion twice.' },
//   { id: 'm5', date: 'Tomorrow, 2:30 PM', label: 'Appointment with Dr. Evelyn Moss', done: false, type: 'medical', notes: 'Chemotherapy review and next schedule.' },
//   { id: 'm6', date: 'Next Week', label: 'Chemo Infusion #2', done: false, type: 'medical', notes: 'Prepare hydration levels 48h before.' },
// ];

export const INITIAL_MILESTONES: Milestone[] = [
  { id: 'm1', date: '2026-05-15', label: 'Oncology Consultation', done: true, type: 'medical', notes: 'Agreed on chemotherapy parameters and schedule.' },

  { id: 'm2', date: '2026-05-20', label: 'Chemo Infusion #1', done: true, type: 'medical', notes: 'Completed. Experienced moderate nausea, but stable.' },

  {
    id: 'milestone1',
    date: '2026-05-22',
    label: '⭐ First Treatment Cycle Completed',
    done: true,
    type: 'milestone',
    notes: 'Reached an important treatment milestone.'
  },

  { id: 'm3', date: '2026-05-26', label: 'Care Circle Grounding', done: true, type: 'emotional', notes: 'Mom joined the Constellation. Star lit.' },

  { id: 'm4', date: 'Yesterday', label: '3-Min Deep Breathing Star', done: true, type: 'selfcare', notes: 'Practiced bubble expansion twice.' },

  { id: 'm5', date: 'Tomorrow, 2:30 PM', label: 'Appointment with Dr. Evelyn Moss', done: false, type: 'medical', notes: 'Chemotherapy review and next schedule.' },

  { id: 'm6', date: 'Next Week', label: 'Chemo Infusion #2', done: false, type: 'medical', notes: 'Prepare hydration levels 48h before.' },
];

export const INITIAL_SYMPTOMS_LOG: SymptomLog[] = [
  { date: 'Mon', Fatigue: 4, Nausea: 3, Pain: 2, Anxiety: 4, 'Appetite loss': 3, 'Sleep issues': 4 },
  { date: 'Tue', Fatigue: 3, Nausea: 2, Pain: 2, Anxiety: 3, 'Appetite loss': 2, 'Sleep issues': 3 },
  { date: 'Wed', Fatigue: 5, Nausea: 4, Pain: 3, Anxiety: 5, 'Appetite loss': 4, 'Sleep issues': 5 },
  { date: 'Thu', Fatigue: 4, Nausea: 2, Pain: 2, Anxiety: 3, 'Appetite loss': 2, 'Sleep issues': 3 },
  { date: 'Fri', Fatigue: 3, Nausea: 1, Pain: 1, Anxiety: 2, 'Appetite loss': 1, 'Sleep issues': 2 },
  { date: 'Sat', Fatigue: 2, Nausea: 1, Pain: 1, Anxiety: 2, 'Appetite loss': 1, 'Sleep issues': 2 },
  { date: 'Sun (Today)', Fatigue: 3, Nausea: 2, Pain: 2, Anxiety: 3, 'Appetite loss': 2, 'Sleep issues': 3 },
];

export const HELPFUL_RESOURCES = [
  {
    title: '🌿 Coping with Chemo Nausea & Appetite',
    description: 'Practical self-care tips including small snack timing, ginger infusions, and doctor communication guide.',
    category: 'Symptom Relief',
    link: 'https://www.nccs.com.sg/your-care/patient-support/coping-with-cancer-and-treatments/nausea-and-vomitingl'
  },
  {
    title: '🧠 Centering in Hard Moments: Anchoring Techniques',
    description: 'Learn the 5-4-3-2-1 grounding method, somatic neck releases, and cosmic boundary tracking.',
    category: 'Mindfulness',
    link: 'https://www.verywellmind.com/5-4-3-2-1-grounding-technique-8639390'
  },
  {
    title: '💬 Guidance for Explaining Your Diagnosis to Children',
    description: 'Compassionate conversation starters, age-appropriate descriptions, and maintaining a sense of safety.',
    category: 'Care Circle',
    link: 'https://explainingbrains.com/explaining-a-diagnosis/'
  }
];
