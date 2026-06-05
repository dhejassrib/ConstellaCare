export type Section =
  | 'home'
  | 'astra'
  | 'mood'
  | 'calm'
  | 'voice'
  | 'appointment'
  | 'symptoms'
  | 'medications'
  | 'milestones'
  | 'timeline'
  | 'reports'
  | 'circle'
  | 'bottles'
  | 'resources'
  | 'progress'
  | 'reflection'
  | 'shared';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'astra';
  text: string;
  timestamp: string;
}

export interface CareCircleNode {
  id: string;
  name: string;
  relationship: string;
  lastActive: string;
  message?: string;
  angle: number; // orbital angle
  distance: number; // orbital radius
  color: string;
}

export interface Milestone {
  id: string;
  date: string;
  label: string;
  done: boolean;
  type: 'medical' | 'emotional' | 'selfcare' | 'milestone';
  notes?: string;
}

export interface SymptomLog {
  date: string;
  Fatigue: number;
  Nausea: number;
  Pain: number;
  Anxiety: number;
  'Appetite loss': number;
  'Sleep issues': number;
}

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  text: string;
  emotionsDetected?: string[];
}

export interface ConstellationStar {
  id: string;
  x: number; // percentage coordinate 0-100
  y: number; // percentage coordinate 0-100
  label: string;
  category: 'mood' | 'calm' | 'journal' | 'appointment' | 'symptom' | 'medications';
  timestamp: string;
  brightness: number; // pulsing strength
}
