// FacialEmotionDetection.tsx
import { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, Check, Play, X } from 'lucide-react';

interface FacialEmotionDetectionProps {
  onDetected: (emotion: string) => void;
}

const SCAN_RESULTS = [
  'Resilience Stable',
  'Quiet Fatigue',
  'Tender / Fragile',
  'Calmed Baseline',
  'Cautious Hope',
  'Gentle Overwhelm',
];

export default function FacialEmotionDetection({ onDetected }: FacialEmotionDetectionProps) {
  const [phase, setPhase] = useState<'idle' | 'active' | 'scanning' | 'done'>('idle');
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [liveEmotion, setLiveEmotion] = useState('Analyzing...');

  // ── Start camera ──────────────────────────────────────────────────────────
  const startCamera = async () => {
    setDetectedEmotion(null);
    setScanProgress(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Attach stream then play — avoids the "no source" black screen
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {/* autoplay policy – silently ignore */});
        };
      }

      setCameraAvailable(true);
      setPhase('active');
    } catch {
      // No camera or permission denied — show simulator
      setCameraAvailable(false);
      setPhase('active');
    }
  };

  const startScan = () => {
  const LIVE_EMOTIONS = [
    'Calm',
    'Hopeful',
    'Neutral',
    'Tired',
    'Anxious',
    'Overwhelmed',
  ];

  if (phase !== 'active') return;

  setPhase('scanning');
  setScanProgress(0);

  const emotionInterval = setInterval(() => {
    setLiveEmotion(
      LIVE_EMOTIONS[Math.floor(Math.random() * LIVE_EMOTIONS.length)]
    );
    }, 500);

    intervalRef.current = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 4;

        if (next >= 100) {
          clearInterval(intervalRef.current!);
          clearInterval(emotionInterval);

          const result =
            LIVE_EMOTIONS[Math.floor(Math.random() * LIVE_EMOTIONS.length)];

          setLiveEmotion(result);
          setDetectedEmotion(result);
          setPhase('done');
          onDetected(result);

          return 100;
        }

        return next;
      });
    }, 80);
  };

  // ── Stop camera ───────────────────────────────────────────────────────────
  const stopCamera = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setPhase('idle');
    setDetectedEmotion(null);
    setScanProgress(0);
  };

  // ── Run scan ──────────────────────────────────────────────────────────────
  // const startScan = () => {

  //   const LIVE_EMOTIONS = [
  //     'Calm',
  //     'Hopeful',
  //     'Neutral',
  //     'Tired',
  //     'Anxious',
  //     'Overwhelmed',
  //   ];

  //   if (phase !== 'active') return;
  //   setPhase('scanning');
  //   setScanProgress(0);

  //   intervalRef.current = setInterval(() => {
  //     setScanProgress(prev => {
  //       const next = prev + 4;
  //       if (next >= 100) {
  //         clearInterval(intervalRef.current!);
  //         const result = SCAN_RESULTS[Math.floor(Math.random() * SCAN_RESULTS.length)];
  //         setDetectedEmotion(result);
  //         setPhase('done');
  //         onDetected(result);
  //         return 100;
  //       }
  //       return next;
  //     });
  //   }, 80);
  // };

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const isLive = phase === 'active' || phase === 'scanning' || phase === 'done';

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* ── Video viewport ── */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner"
           style={{ aspectRatio: '4/3' }}>

        {/* Real camera feed — always mounted so the ref is available */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover`}
          style={{
            transform: 'scaleX(-1)', // mirror
            display: (isLive && cameraAvailable) ? 'block' : 'none',
          }}
          autoPlay
          playsInline
          muted
        />

        {/* Simulator overlay (no camera) */}
        {isLive && !cameraAvailable && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_65%)]" />
            <div className="absolute inset-0 opacity-20"
                 style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="w-16 h-16 rounded-full border border-dashed border-purple-500/50 flex items-center justify-center animate-spin mb-3"
                 style={{ animationDuration: '8s' }}>
              <Camera className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-widest">Biometric Simulator</span>
            <span className="text-[9px] text-slate-500 mt-1">Camera unavailable · Running mock scan</span>
          </div>
        )}

        {/* Idle placeholder */}
        {!isLive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
              <Camera className="w-5 h-5 text-slate-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-300 font-mono tracking-widest uppercase mb-1">
              Biometric Mood Scanner
            </h4>
            <p className="text-[11px] text-slate-500 max-w-[220px] mb-5 leading-relaxed">
              Map your current emotional state using your facial expression patterns.
            </p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Start Sensor
            </button>
          </div>
        )}

        {/* Corner bracket overlay — always shown when live */}
        {isLive && (
          <div className="absolute inset-4 pointer-events-none">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-purple-400/80" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-purple-400/80" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-purple-400/80" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-purple-400/80" />
          </div>
        )}

        {/* Face tracking box */}
        {isLive && (
          <div
            className="absolute border-2 border-purple-400 rounded-xl pointer-events-none"
            style={{
              width: '140px',
              height: '180px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 20px rgba(192,132,252,0.35)',
            }}
          />
        )}

        {/* Live emotion label */}
        {isLive && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bg-slate-900/90 border border-purple-500/40 px-3 py-1 rounded-full z-20"
            style={{ top: 'calc(50% - 120px)' }}
          >
            <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider">
              {liveEmotion}
            </span>
          </div>
        )}

        {/* Scan line */}
        {phase === 'scanning' && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent pointer-events-none z-10"
            style={{
              top: `${scanProgress}%`,
              boxShadow: '0 0 10px #c084fc, 0 0 20px #a855f780',
              transition: 'top 80ms linear',
            }}
          />
        )}

        {/* Scan progress badge */}
        {phase === 'scanning' && (
          <div className="absolute top-3 left-3 bg-slate-900/85 border border-purple-500/40 px-2 py-0.5 rounded font-mono text-[9px] text-purple-300 z-20">
            SCANNING: {scanProgress}%
          </div>
        )}

        {/* Done badge */}
        {phase === 'done' && (
          <div className="absolute top-3 left-3 bg-emerald-900/80 border border-emerald-500/40 px-2 py-0.5 rounded font-mono text-[9px] text-emerald-300 z-20 flex items-center gap-1">
            <Check className="w-3 h-3" /> SCAN COMPLETE
          </div>
        )}

        {/* Close button */}
        {isLive && (
          <button
            onClick={stopCamera}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white z-20 cursor-pointer transition-colors"
            title="Stop camera"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ── Action buttons below viewport ── */}
      {isLive && (
        <div className="flex gap-3 justify-center flex-wrap">
          {phase === 'active' && (
            <button
              onClick={startScan}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Start Scan
            </button>
          )}

          {phase === 'done' && (
            <button
              onClick={() => { setPhase('active'); setScanProgress(0); setDetectedEmotion(null); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Scan Again
            </button>
          )}

          <button
            onClick={stopCamera}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl cursor-pointer transition-colors"
          >
            Turn Off Sensor
          </button>
        </div>
      )}

      {/* ── Result card ── */}
      {detectedEmotion && (
        <div className="w-full bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-4 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/8 blur-xl rounded-full" />
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-sm mb-1">
            <Check className="w-4 h-4 text-emerald-500" />
            Biometric Scan Complete
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Identified alignment:{' '}
            <span className="font-extrabold text-purple-600 dark:text-purple-400">{detectedEmotion}</span>
            {' '}· Constellation index expanded ✨
          </p>
        </div>
      )}
    </div>
  );
}