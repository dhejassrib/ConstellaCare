import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Sparkles, AlertCircle, Headphones, CloudLightning } from 'lucide-react';
import { JournalEntry } from '../types';
import { GoogleGenAI } from '@google/genai';

interface VoiceJournalProps {
  onJournalSaved: (entry: JournalEntry) => void;
}

export default function VoiceJournal({ onJournalSaved }: VoiceJournalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [transcript, setTranscript] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    emotions: string[];
    validation: string;
    weather: string;
  } | null>(null);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Mock templates for quick bypass testing if needed
  // const mockTemplates = [
  //   { label: "🥀 Vulnerable Fatigue", text: "I finished my second chemo round today. My body feels entirely heavy, like lead. Even holding a fork is tough... but Chloe made me some ginger water, and that felt like a quiet drop of safety in my throat." },
  //   { label: "🌱 A Moment of Hope", text: "Woke up feeling stable today. The nauseous fog took the morning off. Gavin and I sat on the porch for ten minutes. I felt the dry sun on my face. Feeling grateful that today feels accessible." },
  //   { label: "🌪️ Pre-Appointment Flurry", text: "The next check-up is tomorrow. My chest feels tight, my breathing is high in my rib cage. I am terrified of what the blood marker counts will say, but I am trying to focus on my bubble breathing orbits." }
  // ];

  // Waveform Visualization Effect
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let barsCount = 38;
    let data: number[] = Array(barsCount).fill(4);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#c084fc'; 

      for (let i = 0; i < barsCount; i++) {
        const factor = isRecording ? Math.random() * 28 + 2 : 3;
        data[i] = data[i] * 0.7 + factor * 0.3; 

        const h = Math.max(3, data[i]);
        const w = (canvas.width / barsCount) - 3;
        const x = i * (w + 3);
        const y = (canvas.height - h) / 2;

        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 4);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  const startRecord = async () => {
    setErrorMessage(null);
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setErrorMessage("Your browser doesn't support live transcription. Try using Chrome or Edge!");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript;
          }
        }
        if (currentTranscript) {
          setTranscript(prev => prev + currentTranscript + ' ');
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage("Microphone access blocked! Allow permissions in your browser URL bar.");
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      
      setIsRecording(true);
      setRecordProgress(0);
      setTranscript('');
      setAnalysisResult(null);

      progressIntervalRef.current = setInterval(() => {
        setRecordProgress(prev => {
          if (prev >= 100) {
            stopRecord();
            return 100;
          }
          return prev + 1.2;
        });
      }, 100);
      
    } catch (err: any) {
      console.error("Mic setup failed:", err);
      setErrorMessage("Could not start microphone. Check your browser permissions.");
    }
  };

  const stopRecord = () => {
    setIsRecording(false);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const analyzeAudio = async () => {
    if (!transcript) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
      
      if (!apiKey) {
        setErrorMessage("Missing API Key! Make sure VITE_GEMINI_API_KEY is defined in your local .env file.");
        setIsAnalyzing(false);
        return;
      }

      // Initialize official SDK instance
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        You are Astra, an empathetic AI for a healthcare app. Analyze this patient journal entry: "${transcript}"
        
        Return ONLY a valid JSON object (no markdown, no backticks, no other text) with exactly these keys:
        - "emotions": An array of 2 short emotion tags representing how the user feels (e.g., ["Anxious", "Seeking Calm"]).
        - "validation": A short, highly empathetic, supportive sentence validating their feelings.
        - "weather": A creative, 1-sentence metaphor for their emotional state (e.g., "Stormy seas looking for a lighthouse").
      `;

      // Swapping to modern active model identifier via official SDK configuration pipelines
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const aiText = response.text;
      if (!aiText) {
        throw new Error("Empty content stream packet received from API gateway");
      }
      
      const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);

      setAnalysisResult({
        emotions: data.emotions || ["Processing"],
        validation: data.validation || "I hear your voice and I am here for you.",
        weather: data.weather || "Starlight shifting"
      });

      onJournalSaved({
        id: Math.random().toString(),
        date: 'Just now',
        prompt: 'Voice Journal Record',
        text: transcript,
        emotionsDetected: data.emotions || ["Processing"]
      });

    } catch (e: any) {
      console.error("Gemini API Execution Error:", e);
      setErrorMessage("Astra couldn't finalize the content generation stream. Swapping to baseline mode.");
      
      setAnalysisResult({
        emotions: ["Quiet Fatigue", "Tender Sincerity"],
        validation: "I hear the soft timber of courage in your voice. It is completely safe to acknowledge that the path feels heavy while maintaining your focus. We will wrap your coordinate in soft rest.",
        weather: "Evening nebula glowing behind gentle lavender clouds"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2.5xl p-6 shadow-xl transition-all duration-300">
      <div className="text-center max-w-md mx-auto">
        <h3 className="text-lg font-black theme-heading mb-1">Empathetic Voice Journaling</h3>
        <p className="text-xs text-[#5a487c] dark:text-slate-400">
          Some days it's easier to talk than type. Share your thoughts aloud, and let Astra transcribe and reflect on your emotional weather.
        </p>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-bold flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errorMessage}
          </div>
        )}

        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative">
            <button
              onClick={isRecording ? stopRecord : startRecord}
              disabled={isTranscribing || isAnalyzing}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white ring-8 shadow-2xl transition-all duration-300 cursor-pointer ${
                isRecording 
                  ? 'bg-red-500 animate-pulse ring-red-500/20' 
                  : 'bg-purple-600 hover:bg-purple-700 ring-purple-600/10 hover:shadow-purple-500/30'
              }`}
            >
              {isRecording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-8 h-8" />}
            </button>
            {isRecording && (
              <svg className="absolute -inset-4 w-28 h-28 pointer-events-none transform -rotate-95">
                <circle
                  cx="56"
                  cy="56"
                  r="52"
                  stroke="#ef4444"
                  fill="none"
                  strokeWidth="3.5"
                  strokeDasharray={`${recordProgress * 3.26} 1000`}
                  className="transition-all duration-100"
                />
              </svg>
            )}
          </div>

          <span className="text-xs font-bold font-mono uppercase tracking-widest mt-4 text-slate-500 dark:text-slate-400">
            {isRecording ? `${Math.floor(recordProgress / 10)}s // RECORDING ACTIVE` : 'TAP ORB TO RECORD EMOTIONS'}
          </span>
        </div>

        <div className="w-full h-12 bg-slate-50 dark:bg-slate-950 rounded-xl p-2.5 flex items-center justify-center border border-slate-100 dark:border-slate-800 mb-6">
          <canvas ref={canvasRef} width="350" height="40" className="w-full h-full" />
        </div>

        {!isRecording && !isTranscribing && (
          <>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
              {/* <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">Capture Simulators</span></div> */}
            </div>

            {/* <div className="flex justify-center gap-2.5 flex-wrap mb-6">
              {mockTemplates.map((tmp, ix) => (
                <button
                  key={ix}
                  onClick={() => {
                    setTranscript(tmp.text);
                    setAnalysisResult(null);
                  }}
                  className={`text-[11px] font-semibold py-1.5 px-3 rounded-full border transition cursor-pointer ${
                    transcript === tmp.text
                      ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-400 text-purple-700 dark:text-purple-300'
                      : 'bg-transparent border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tmp.label}
                </button>
              ))}
            </div> */}
          </>
        )}

        {isTranscribing && (
          <div className="flex flex-col items-center justify-center py-4 bg-purple-50/20 dark:bg-purple-950/10 border border-dashed border-purple-200 rounded-2xl mb-6">
            <Headphones className="w-6 h-6 text-purple-500 animate-bounce" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-2">Astra is transcribing voice orbits...</span>
          </div>
        )}

        {transcript && !isTranscribing && (
          <div className="text-left bg-gradient-to-tr from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border border-slate-150 dark:border-slate-800 p-4.5 rounded-2xl mb-5 shadow-inner">
            <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-slate-400 block mb-1.5">Voice Transcription Transcript</span>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              rows={3}
              className="w-full text-slate-700 dark:text-slate-200 text-xs bg-transparent border-none focus:outline-none resize-none leading-relaxed"
            />
            
            {!analysisResult && (
              <button
                onClick={analyzeAudio}
                disabled={isAnalyzing}
                className="mt-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-t-transparent border-pink-400 animate-spin" />
                    <span className="font-black theme-heading text-xs">
                    Analyzing Emotional Weather...
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span className="font-black theme-heading text-xs">
                    Analyze with Astra AI
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {analysisResult && (
          <div className="text-left bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/40 dark:border-purple-900/30 rounded-2xl p-5 shadow-lg relative overflow-hidden r">
            <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/5 blur-2xl rounded-full" />
            
            <div className="flex items-center gap-2 pb-3 border-b border-purple-200/30 dark:border-purple-900/20 mb-3.5">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Astra Cosmic Empathy Log</span>
            </div>

            <div className="mb-4 on-dark-surface bg-[#1a1530] dark:bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 shadow-inner">
              <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-amber-400">
                <CloudLightning className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider font-mono text-slate-350 block">Identified Weather Horizon</span>
                <span className="text-xs font-bold text-slate-400">{analysisResult.weather}</span>
              </div>
            </div>

            <div className="mb-3.5">
              <span className="text-[10px] font-bold uppercase font-mono tracking-widest text-slate-400 block mb-1.5">Detected Resonance Layers</span>
              <div className="flex gap-1.5 flex-wrap">
                {analysisResult.emotions.map(em => (
                  <span key={em} className="
                    text-[10px] font-black
                    theme-heading
                    bg-gradient-to-r from-pink-200 to-purple-200
                    dark:from-pink-950/30 dark:to-purple-950/30
                    text-[#2e1446]
                    dark:text-pink-200
                    border border-purple-300/60
                    dark:border-pink-900/30
                    px-3 py-1 rounded-full
                    shadow-sm
                    ">
                    ✦ {em}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic">
              "{analysisResult.validation}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}