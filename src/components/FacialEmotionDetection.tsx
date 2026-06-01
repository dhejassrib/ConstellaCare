import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Sparkles, Check, Play, ShieldAlert } from 'lucide-react';

interface FacialEmotionDetectionProps {
  onDetected: (emotion: string) => void;
  accentClass?: string;
}

export default function FacialEmotionDetection({ onDetected, accentClass }: FacialEmotionDetectionProps) {
  const [streamActive, setStreamActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // const handleStartCamera = async () => {
  //   setCameraError(false);
  //   setDetectedEmotion(null);
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
  //     streamRef.current = stream;
  //     if (videoRef.current) {
  //       videoRef.current.srcObject = stream;
  //       // The browser handles autoplay automatically now
  //     }
  //     setStreamActive(true);
  //   } catch (err) {
  //     console.warn("Camera hardware not available or permission denied. Loading simulated biometric sensor instead.", err);
  //     setCameraError(true);
  //     setStreamActive(true); 
  //   }
  // };
  const handleStartCamera = async () => {
    setCameraError(false);
    setDetectedEmotion(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 240 }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        await videoRef.current.play();
      }

      setStreamActive(true);
    } catch (err) {
      console.warn("Camera not available or permission denied.", err);
      setCameraError(true);
      setStreamActive(true);
    }
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setStreamActive(false);
    setIsScanning(false);
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
  };

  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setDetectedEmotion(null);

    scanIntervalRef.current = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanIntervalRef.current!);
          setIsScanning(false);
          const results = ['Resilience Stable', 'Quiet Fatigue', 'Tender/Fragile', 'Calmed baseline'];
          const finalEmotion = results[Math.floor(Math.random() * results.length)];
          setDetectedEmotion(finalEmotion);
          onDetected(finalEmotion);
          return 100;
        }
        return prev + 5;
      });
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative aspect-video flex items-center justify-center text-slate-500 shadow-inner">
        
        {streamActive ? (
          <>
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_65%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px]" />
                
                <div className="w-16 h-16 rounded-full border border-dashed border-purple-500/40 flex items-center justify-center animate-spin mb-3">
                  <Camera className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">Biometric Simulator Active</span>
                <span className="text-[9px] text-slate-500 block mt-1">Camera disabled. Scanning mock matrix.</span>
              </div>
            ) : (
              <video
                ref={videoRef}
                className="w-full h-full object-cover transform -scale-x-100"
                autoPlay // <-- ADDED THIS: Fixes the frozen black screen issue
                muted
                playsInline
              />
            )}

            <div className="absolute inset-4 pointer-events-none border border-white/5 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.65))]">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400" />
            </div>

            {isScanning && (
              <div 
                // Removed custom animation class, relying on standard transition for the smooth scan effect
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_8px_#c084fc] z-10 pointer-events-none transition-all duration-100 ease-linear"
                style={{
                  top: `${scanProgress}%`
                }}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
              <Camera className="w-5 h-5 text-slate-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-300 font-mono tracking-widest uppercase mb-1">FACIAL SCAN COMMENCEMENT</h4>
            <p className="text-[11px] text-slate-500 max-w-[250px] mb-4">
              Unlock a constellation star by mapping your current physical and emotional facial lines.
            </p>
            <button
              onClick={handleStartCamera}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white select-none text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Start Biometric Cam
            </button>
          </div>
        )}

        {isScanning && (
          <div className="absolute top-3 left-3 bg-slate-900/80 border border-purple-500/30 px-2 py-0.5 rounded font-mono text-[9px] text-purple-400">
            SCANNING HORIZONS: {scanProgress}%
          </div>
        )}
      </div>

      {streamActive && (
        <div className="mt-4 flex gap-3">
          {!isScanning && !detectedEmotion && (
            <button
              onClick={handleScan}
              className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Initialize Facial Scan
            </button>
          )}

          <button
            onClick={handleStopCamera}
            className="px-3.5 py-1.5 bg-transparent border border-slate-200 dark:border-slate-805 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl cursor-pointer"
          >
            Turn Off Sensor
          </button>
        </div>
      )}

      {detectedEmotion && (
        <div className="mt-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 p-4 rounded-xl text-center max-w-sm relative overflow-hidden transition-all duration-500 ease-in-out opacity-100">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 blur-xl rounded-full" />
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-sm mb-1">
            <Check className="w-4 h-4 text-emerald-500" />
            Biometric Scan Complete!
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Identified Alignment: <span className="font-extrabold text-purple-600 dark:text-purple-400 capitalize">{detectedEmotion}</span>. Constellation index expanded!
          </p>
        </div>
      )}
    </div>
  );
}